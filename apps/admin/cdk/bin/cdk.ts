#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkStack } from '../src/cdk-stack';

const _env: cdk.Environment = {
  account: '',
  region: ''
}

const environment = 'habilhome'
const stackName = `${environment}-admin`
const app = new cdk.App();

new CdkStack(app, stackName, { env: _env });
