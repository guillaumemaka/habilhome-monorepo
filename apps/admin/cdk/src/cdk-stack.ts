import * as cdk from '@aws-cdk/core'
import * as ecs from '@aws-cdk/aws-ecs'
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns'
import * as acm from '@aws-cdk/aws-certificatemanager'
import * as ecr from '@aws-cdk/aws-ecr'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as sd from '@aws-cdk/aws-servicediscovery'
import * as route53 from '@aws-cdk/aws-route53'
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2'
import * as ssm from '@aws-cdk/aws-ssm'

const ENV = 'habilhome'
const TAGS: { [key: string]: string } = {
  Maintainer: 'Guillaume Maka',
  MaintainerEmail: 'guillaume.maka@gmail.com',
  Project: 'ProjetOntario',
  CostCenter: 'Lachapelle'
}

function _addTags(scope: cdk.Construct) {
  for (const tag in TAGS) {
    cdk.Tags.of(scope).add(tag, TAGS[tag])
  }
}

function _id(id: string): string {
  return `${ENV}/${id}`
}

function _exportName(exportName: string): string {
  return `${ENV}::${exportName}`
}

class BaseInfrastructure extends cdk.Construct {
  readonly cluster: ecs.ICluster
  readonly vpc: ec2.IVpc
  readonly sdNamespace: sd.IPrivateDnsNamespace
  readonly alb: elbv2.ApplicationLoadBalancer
  readonly hostedZone: route53.HostedZone
  readonly certificate: acm.ICertificate

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id)

    const vpcId = ssm.StringParameter.valueFromLookup(
      this,
      '/habilhome/BaseVpcId'
    )

    this.vpc = ec2.Vpc.fromLookup(this, _id('habilhome/BaseVpc'), {
      vpcId
    })

    this.sdNamespace = sd.PrivateDnsNamespace.fromPrivateDnsNamespaceAttributes(
      this,
      'SDNamespace',
      {
        namespaceArn: cdk.Fn.importValue(_exportName('NSArn')),
        namespaceId: cdk.Fn.importValue(_exportName('NSId')),
        namespaceName: cdk.Fn.importValue(_exportName('NSName'))
      }
    )

    this.cluster = ecs.Cluster.fromClusterAttributes(this, _id('ECSCluster'), {
      clusterName: cdk.Fn.importValue(_exportName('ECSClusterName')),
      vpc: this.vpc,
      securityGroups: [
        // ec2.SecurityGroup.fromSecurityGroupId(
        //   this,
        //   _id('SG'),
        //   cdk.Fn.importValue(_exportName("ALBSecGroupId"))
        // )
      ],
      defaultCloudMapNamespace: this.sdNamespace
    })

    this.hostedZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      _id('HabilhomeHostedZone'),
      {
        hostedZoneId: cdk.Fn.importValue(_exportName('HostedZoneId')),
        zoneName: 'habilhome.com'
      }
    ) as route53.HostedZone

    this.alb = elbv2.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(
      this,
      'ALB',
      {
        loadBalancerCanonicalHostedZoneId: this.hostedZone.hostedZoneId,
        loadBalancerDnsName: cdk.Fn.importValue(_exportName('ALBDNSName')),
        loadBalancerArn: cdk.Fn.importValue(_exportName('ALBArn')),
        securityGroupId: cdk.Fn.importValue(_exportName('ALBSecGroupId')),
        vpc: this.vpc
      }
    ) as elbv2.ApplicationLoadBalancer

    this.certificate = acm.Certificate.fromCertificateArn(
      this,
      _id('Certificate'),
      cdk.Fn.importValue(_exportName('CertificateArn'))
    )
  }
}

export class HabilhomeAdminStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const target = process.env.TARGET || 'prod'

    const domainName =
      target === 'prod'
        ? 'admin.habilhome.com'
        : `admin-${target}.habilhome.com`

    const base = new BaseInfrastructure(this, _id('BaseInfrastructure'))

    // Task
    const fargateTaskDef = new ecs.FargateTaskDefinition(
      this,
      _id('AdminTaskDefnition'),
      {
        cpu: 1024,
        memoryLimitMiB: 512
      }
    )

    const repository = ecr.Repository.fromRepositoryName(
      this,
      _id('HabilhomeAdminRepo'),
      'habilhome/vt-admin'
    )

    const PORT = 3000

    const container = fargateTaskDef.addContainer('admin', {
      image: ecs.ContainerImage.fromEcrRepository(
        repository,
        process.env.IMAGE_TAG || 'latest'
      ),
      environment: {
        CONTAINER_API_URL: `http://api.${
          base.sdNamespace.namespaceName
        }:${PORT}`,
        NODE_ENV: 'production',
        PORT: `${PORT}`
      },
      logging: new ecs.AwsLogDriver({
        streamPrefix: 'habilhome-admin'
      })
    })

    container.addPortMappings({
      containerPort: 3000
    })

    const AdminService = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      _id('AdminService'),
      {
        certificate: base.certificate,
        serviceName: 'admin',
        loadBalancer: base.alb,
        domainName,
        domainZone: base.hostedZone,
        desiredCount: 1,
        cloudMapOptions: {
          cloudMapNamespace: base.sdNamespace
        },
        assignPublicIp: false,
        taskDefinition: fargateTaskDef
      }
    )

    const listener443 = base.alb.addListener('Admin-PublicListener-443', {
      protocol: elbv2.ApplicationProtocol.HTTPS,
      port: 443,
      certificates: [base.certificate],
      open: true,
      defaultAction: elbv2.ListenerAction.fixedResponse(503)
    })

    listener443.addTargets('HabilihomeAdmin-3000-tcp', {
      port: 443,
      targets: [
        AdminService.service.loadBalancerTarget({
          containerPort: PORT,
          containerName: 'admin'
        })
      ],
      // healthCheck: {
      //   interval: cdk.Duration.seconds(60),
      //   path: '/Admin/health',
      //   timeout: cdk.Duration.seconds(5)
      // },
      conditions: [elbv2.ListenerCondition.hostHeaders([domainName])],
      priority: 10
    })

    _addTags(this)
  }
}
