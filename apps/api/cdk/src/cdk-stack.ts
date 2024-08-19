import * as cdk from "@aws-cdk/core";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import * as acm from "@aws-cdk/aws-certificatemanager";
import * as ecr from "@aws-cdk/aws-ecr";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as sd from "@aws-cdk/aws-servicediscovery";
import * as route53 from "@aws-cdk/aws-route53";
import * as elbv2 from "@aws-cdk/aws-elasticloadbalancingv2";
import * as sqs from "@aws-cdk/aws-sqs";
import * as ssm from "@aws-cdk/aws-ssm";
import * as s3 from "@aws-cdk/aws-s3";

const ENV = "habilhome";
const TAGS: { [key: string]: string } = {
  Maintainer: "Guillaume Maka",
  MaintainerEmail: "guillaume.maka@gmail.com",
  Project: "ProjetOntario",
  CostCenter: "Lachapelle",
};

function _addTags(scope: cdk.Construct) {
  for (const tag in TAGS) {
    cdk.Tags.of(scope).add(tag, TAGS[tag]);
  }
}

function _id(id: string): string {
  return `${ENV}/${id}`;
}

function _exportName(exportName: string): string {
  return `${ENV}::${exportName}`;
}

class BaseInfrastructure extends cdk.Construct {
  readonly cluster: ecs.ICluster;
  readonly vpc: ec2.IVpc;
  readonly sdNamespace: sd.IPrivateDnsNamespace;
  readonly alb: elbv2.ApplicationLoadBalancer;
  readonly hostedZone: route53.HostedZone;
  readonly sqsEmailQueue: sqs.Queue;
  readonly certificate: acm.ICertificate;
  readonly bucket: s3.IBucket;
  readonly securityGroup: ec2.ISecurityGroup;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const vpcId = ssm.StringParameter.valueFromLookup(
      this,
      "/habilhome/BaseVpcId"
    );

    this.vpc = ec2.Vpc.fromLookup(this, _id("habilhome/BaseVpc"), {
      vpcId,
    });

    this.sdNamespace = sd.PrivateDnsNamespace.fromPrivateDnsNamespaceAttributes(
      this,
      "SDNamespace",
      {
        namespaceArn: cdk.Fn.importValue(_exportName("NSArn")),
        namespaceId: cdk.Fn.importValue(_exportName("NSId")),
        namespaceName: cdk.Fn.importValue(_exportName("NSName")),
      }
    );

    this.securityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      _id("SecurityGroup"),
      cdk.Fn.importValue(_exportName("ALBSecGroupId"))
    );

    this.cluster = ecs.Cluster.fromClusterAttributes(this, _id("ECSCluster"), {
      clusterName: cdk.Fn.importValue(_exportName("ECSClusterName")),
      vpc: this.vpc,
      securityGroups: [
        // ec2.SecurityGroup.fromSecurityGroupId(
        //   this,
        //   _id('SG'),
        //   cdk.Fn.importValue(_exportName("ALBSecGroupId"))
        // )
      ],
      defaultCloudMapNamespace: this.sdNamespace,
    });

    this.hostedZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      _id("HabilhomeHostedZone"),
      {
        hostedZoneId: cdk.Fn.importValue(_exportName("HostedZoneId")),
        zoneName: "habilhome.com",
      }
    ) as route53.HostedZone;

    this.alb = elbv2.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(
      this,
      "ALB",
      {
        loadBalancerCanonicalHostedZoneId: this.hostedZone.hostedZoneId,
        loadBalancerDnsName: cdk.Fn.importValue(_exportName("ALBDNSName")),
        loadBalancerArn: cdk.Fn.importValue(_exportName("ALBArn")),
        securityGroupId: cdk.Fn.importValue(_exportName("ALBSecGroupId")),
        vpc: this.vpc,
      }
    ) as elbv2.ApplicationLoadBalancer;

    this.sqsEmailQueue = sqs.Queue.fromQueueArn(
      this,
      _id("SQSEmailQueue"),
      cdk.Fn.importValue(_exportName("SQSEmailQueueArn"))
    ) as sqs.Queue;

    this.certificate = acm.Certificate.fromCertificateArn(
      this,
      _id("Certificate"),
      cdk.Fn.importValue(_exportName("CertificateArn"))
    );

    this.bucket = s3.Bucket.fromBucketAttributes(this, _id("Bucket"), {
      bucketName: cdk.Fn.importValue(_exportName("BucketName")),
    });
  }
}

export class HabilhomeApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const target = process.env.TARGET || "prod";

    const domainName =
      target === "prod" ? "api.habilhome.com" : `${target}-api.habilhome.com`;

    const base = new BaseInfrastructure(this, _id("BaseInfrastructure"));

    // Task
    const fargateTaskDef = new ecs.FargateTaskDefinition(
      this,
      _id("ApiTaskDefnition"),
      {
        cpu: 1024,
        memoryLimitMiB: 512,
      }
    );

    const repository = ecr.Repository.fromRepositoryName(
      this,
      _id("HabilhomeApiRepo"),
      "habilhome/vt-rest-api"
    );

    const container = fargateTaskDef.addContainer("api", {
      image: ecs.ContainerImage.fromEcrRepository(
        repository,
        process.env.IMAGE_TAG || "latest"
      ),
      environment: {
        NODE_ENV: "production",
        PORT: "3000",
        AWS_BUCKET: base.bucket.bucketName,
        QUEUE_URL: cdk.Fn.importValue(_exportName("SQSEmailQueueUrl")),
        MONGO_URI: `${cdk.SecretValue.secretsManager(
          "habilhome/prod/MongoDBAtlas"
        )}`,
        JWT_SECRET: `${cdk.SecretValue.secretsManager(
          "habilhome/prod/JwtSecret"
        )}`,
        GOOGLE_RECAPTCHA_SECRET: `${cdk.SecretValue.secretsManager(
          "habilhome/prod/GoogleRecaptchaSecret"
        )}`,
      },
      logging: new ecs.AwsLogDriver({
        streamPrefix: "api",
      }),
    });

    base.sqsEmailQueue.grantSendMessages(fargateTaskDef.taskRole);
    base.bucket.grantReadWrite(fargateTaskDef.taskRole);

    container.addPortMappings({
      containerPort: 3000,
    });

    const apiService = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      _id("ApiService"),
      {
        certificate: base.certificate,
        serviceName: "api",
        loadBalancer: base.alb,
        domainName,
        domainZone: base.hostedZone,
        desiredCount: 1,
        cloudMapOptions: {
          cloudMapNamespace: base.sdNamespace,
        },
        assignPublicIp: false,
        taskDefinition: fargateTaskDef,
        cluster: base.cluster,
      }
    );

    // const listener443 = base.alb.addListener("Api-PublicListener-443", {
    //   protocol: elbv2.ApplicationProtocol.HTTPS,
    //   port: 443,
    //   certificates: [base.certificate],
    //   open: true,
    //   defaultAction: elbv2.ListenerAction.fixedResponse(503),
    // });

    const listener443 = elbv2.ApplicationListener.fromApplicationListenerAttributes(
      this,
      _id("ALBListener443"),
      {
        securityGroup: base.securityGroup,
        listenerArn: cdk.Fn.importValue(_exportName("ALBListener443Arn")),
      }
    );

    const tg = new elbv2.ApplicationTargetGroup(this, _id("Api-TargetGroup"), {
      vpc: base.vpc,
      port: 443,
      targets: [
        apiService.service.loadBalancerTarget({
          containerPort: 3000,
          containerName: "api",
        }),
      ],
      healthCheck: {
        interval: cdk.Duration.seconds(60),
        path: "/api/health",
        timeout: cdk.Duration.seconds(5),
        port: "3000",
        protocol: elbv2.Protocol.HTTP,
      },
    });

    listener443.addTargetGroups(_id("TG"), {
      targetGroups: [tg],
      conditions: [elbv2.ListenerCondition.hostHeaders([domainName])],
      priority: 10,
    });

    // listener443.addTargets("HabilihomeApi-3000-tcp", {
    //   port: 443,
    //   targets: [
    //     apiService.service.loadBalancerTarget({
    //       containerPort: 3000,
    //       containerName: "api",
    //     }),
    //   ],
    //   healthCheck: {
    //     interval: cdk.Duration.seconds(60),
    //     path: "/api/health",
    //     timeout: cdk.Duration.seconds(5),
    //     port: "3000",
    //     protocol: elbv2.Protocol.HTTP,
    //   },
    //   conditions: [elbv2.ListenerCondition.hostHeaders([domainName])],
    //   priority: 10,
    // });

    _addTags(this);
  }
}
