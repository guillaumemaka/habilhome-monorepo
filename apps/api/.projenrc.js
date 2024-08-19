const { AwsCdkTypeScriptApp, NodeProject } = require("projen");

const authorInfo = {
  authorName: "Guillaume Maka",
  authorEmail: "guillaume.maka@gmail.com",
};

const apiProject = new NodeProject({
  ...authorInfo,
  name: "@habilhome/rest-api",
  gitignore: [".secrets", "dist", ".env"],
  dependabot: false,
  deps: [
    "@babel/runtime@^7.3.1",
    "@koa/cors@^2.2.2",
    "@koa/multer@3.0.0",
    "@koa/router@8.0.0",
    "accept-language-parser@1.5.0",
    "awilix@^4.0.1",
    "awilix-koa@^4.0.0",
    "aws-sdk@2.769.0",
    "axios@^0.18.0",
    "bcryptjs@2.4.3",
    "bluebird@3.5.3",
    "bristol@^0.4.0",
    "commander@2.19.0",
    "cross-env@6.0.3",
    "debug@4.1.1",
    "dotenv@7.0.0",
    "email-templates@^5.1.0",
    "fast-json-patch@3.0.0-1",
    "fejl@^1.0.2",
    "joi@14.3.1",
    "jsonwebtoken@8.5.0",
    "koa@^2.6.2",
    "koa-body@4.1.0",
    "koa-bodyparser@^4.2.1",
    "koa-compress@^3.0.0",
    "koa-cookie@1.0.0",
    "koa-passport@4.1.1",
    "koa-respond@^2.1.0",
    "koa-roles@2.0.0",
    "koa2-validation@1.0.0",
    "lodash@4.17.20",
    "mime@2.4.3",
    "mongoose@^5.5.12",
    "mongoose-paginate-v2@^1.0.23",
    "multer@1.4.2",
    "multer-s3@2.9.0",
    "multer-s3-transform@2.3.2",
    "multer-sharp-s3@0.2.1",
    "nats@1.2.10",
    "nodemailer@^6.2.1",
    "palin@^2.2.0",
    "passport@0.4.0",
    "passport-jwt@4.0.0",
    "password-prompt@1.1.2",
    "pug@^2.0.3",
    "readline-sync@1.4.9",
    "sharp@0.24.0",
    "slug@1.1.0",
    "yenv@^2.1.0",
  ],
  devDeps: [
    "@babel/cli@7.2.3",
    "@babel/core@7.3.4",
    "@babel/node@7.2.2",
    "@babel/plugin-proposal-decorators@7.3.0",
    "@babel/plugin-proposal-object-rest-spread@7.3.4",
    "@babel/plugin-transform-runtime@^7.2.0",
    "@babel/preset-env@^7.3.1",
    "babel-core@7.0.0-bridge.0",
    "babel-eslint@^10.0.1",
    "eslint@^5.10.0",
    "eslint-config-prettier@^3.3.0",
    "eslint-config-standard@^12.0.0",
    "eslint-plugin-import@^2.14.0",
    "eslint-plugin-jest@^22.1.2",
    "eslint-plugin-node@^8.0.0",
    "eslint-plugin-promise@^4.0.1",
    "eslint-plugin-standard@^4.0.0",
    "husky@^1.2.1",
    "json-form-data@1.7.2",
    "lint-staged@^8.1.0",
    "nodemon@^1.18.9",
    "rimraf@^2.6.2",
    "smid@^0.1.1",
    "supertest@^5.0.0",
    "esbuild",
    "formdata-polyfill",
  ],
  jest: true,
  jestOptions: {
    jestConfig: {
      testEnvironment: "node",
      testMatch: [
        "**/__tests__/**/*.(spec|test).js?(x)",
        "**/?(*.)+(spec|test).js?(x)",
      ],
    },
  },
  scripts: {
    start:
      "cross-env NODE_ENV=production node -r 'dotenv/config' dist/bin/www.js",
    // build: "rimraf dist && cross-env NODE_ENV=production node build-project.js",
    dev:
      "cross-env NODE_ENV=development nodemon -r 'node_modules/dotenv/config' src/bin/www.js",
    ci:
      "cross-env NODE_ENV=test rimraf dist && jest -ci --coverage --verbose --forceExit --detectOpenHandles",
    cover: "yarn test --coverage",
    lint: 'eslint --fix src && prettier --write "src/**/*.js"',
    cli: "babel-node -r 'node_modules/dotenv/config' src/lib/cli/index.js",
  },
  packageManager: 'pnpm',
  srcdir: "src/",
  libdir: "dist",
  buildWorkflow: false,
  releaseWorkflow: false,
  defaultReleaseBranch: 'main'
});

apiProject.removeTask('build')

apiProject.addTask('build')
.exec("rimraf dist && NODE_ENV=production babel src -d dist -s")

apiProject.removeTask('test')
apiProject.addTask('test')
  .exec("cross-env NODE_ENV=test rimraf dist && jest --detectOpenHandles --forceExit --runInBand",)

apiProject.addTask('projen:update')
.exec('rush add projen --consistent')

apiProject.addTask('projen')
.exec('npx projen --no-post')

apiProject.addFields({
  nodemonConfig: {
    execMap: {
      js: "babel-node",
    },
  },
  husky: {
    hooks: {
      "pre-commit": "scripts/run-test.shw",
    },
  },
});

apiProject.synth();

const cdkProject = new AwsCdkTypeScriptApp({
  parent: apiProject,
  outdir: "cdk",
  ...authorInfo,
  name: "@habilhome/rest-api-cdk",
  cdkVersionPinning: true,
  cdkVersion: "1.77.0",
  cdkDependencies: [
    "@aws-cdk/aws-certificatemanager",
    "@aws-cdk/aws-ec2",
    "@aws-cdk/aws-ecr",
    "@aws-cdk/aws-ecr-assets",
    "@aws-cdk/aws-ecs",
    "@aws-cdk/aws-ecs-patterns",
    "@aws-cdk/aws-elasticloadbalancingv2",
    "@aws-cdk/aws-iam",
    "@aws-cdk/aws-route53",
    "@aws-cdk/aws-s3",
    "@aws-cdk/aws-sqs",
    "@aws-cdk/aws-ssm",
    "@aws-cdk/aws-servicediscovery",
  ],
  devDeps: ["esbuild"],
  "defaultReleaseBranch": 'main',
  packageManager: 'pnpm'
});

cdkProject.addTask('projen')
.exec('npx projen --no-post')

if (process.env.EXCLUDE_CDK === undefined) {
  cdkProject.synth();
}
