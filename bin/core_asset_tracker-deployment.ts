#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CoreAssetTrackerDeploymentStack } from '../lib/core_asset_tracker-deployment-stack';


const app = new cdk.App();
new CoreAssetTrackerDeploymentStack(app, 'CoreAssetTrackerDeploymentStack', {});