import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
//AMPLIFY
import * as amplify from '@aws-cdk/aws-amplify-alpha';
//CODEBUILD
import * as codebuild from 'aws-cdk-lib/aws-codebuild';


export class CoreAssetTrackerDeploymentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);



    //*****************************AMPLIFY**********************************/
    const amplifyApp = new amplify.App(this, 'coreAssetTracker-amplify', {
      //name of Amplify app
      appName: 'coreAssetTracker',


      //description of Amplify app
      description: 'coreAssetTracker APP deployed with Amplify',


      //source provider of Amplify app
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: "alisarwarr",
        repository: "CoreAssetTracker-Frontend",
        oauthToken: cdk.SecretValue.secretsManager('github-token')
      }),


      //custome rules for Amplify app
      customRules: [
        {
          source: "/<*>",
          target: '/index.html',
          status: amplify.RedirectStatus.NOT_FOUND_REWRITE
        }
      ],


      //once branch delete from service provider ( github ), automatically delete from Amplify app
      autoBranchDeletion: true,


      //app will host only static assets or server side rendered assets in addition to static
      //by default, the value is set to WEB (static only) ex. ReactJS
      //however, server side rendering can be turned on by setting to WEB_COMPUTE ex. NextJS
      platform: amplify.Platform.WEB_COMPUTE,


      //alternatively add a `amplify.yml` to the repo
      buildSpec: codebuild.BuildSpec.fromObjectToYaml({
        version: "1.0",
        frontend: {
          phases: {
            preBuild: {
              commands: ["npm ci"],
            },
            build: {
              commands: ["npm run build"],
            }
          },
          artifacts: {
            baseDirectory: ".next",
            files: ['**/*']
          },
          cache: {
            paths: ['node_modules/**/*']
          }
        }
      })
    });


    //add branch to Amplify App
    amplifyApp.addBranch('coreAssetTracker-branch', {
      branchName: "main",
      stage: "PRODUCTION"
    });


    //send by Amplify App
    new cdk.CfnOutput(this, 'coreAssetTracker-appId', {
      value: amplifyApp.appId
    })
    //*****************************AMPLIFY**********************************/
  }
}