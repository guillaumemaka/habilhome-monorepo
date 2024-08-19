import { HabilhomeAdminStack } from './cdk-stack'
import * as cdk from '@aws-cdk/core'

const env = {
  account:
    process.env.AWS_ACCOUNT_ID ||
    process.env.CDK_DEFAULT_ACOUNT ||
    '650988679566',
  region:
    process.env.AWS_DEFAULT_REGION ||
    process.env.CDK_DEFAULT_ACOUNT ||
    'ca-central-1' // process.env.AWS_REGION
}

const environment = 'habilhome'
const stackName = `${environment}-api`
const app = new cdk.App()

new HabilhomeAdminStack(app, stackName, { env })
