import * as cdk from 'aws-cdk-lib';
import { User } from 'aws-cdk-lib/aws-iam';
import { LambdaDestination } from 'aws-cdk-lib/aws-lambda-destinations';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { getIotPolicy } from './policies/iot';

export class UibIamStack extends cdk.Stack {
  private readonly accountUIB;
  
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.accountUIB = '066179810773'
    const users = [
      { user: 'pbo645', region: 'eu-central-1' },
      { user: 'cpc550', region: 'eu-west-3' },
      { user: 'arm792', region: 'eu-west-2' },
      { user: 'amc770', region: 'eu-west-1' },
      { user: 'pmr506', region: 'eu-north-1' },
      { user: 'apb492', region: 'us-east-1' },
      { user: 'fsc573', region: 'us-east-2' },
      { user: 'agc648', region: 'us-west-2' },
    ]
    users.forEach(u => this.managePolicies(u.user, u.region))

    // const l = NodejsFunction.fromFunctionArn(this, 'testf', 'arn:aws:lambda:us-east-2:066179810773:function:function5')
    // const b = Bucket.fromBucketArn(this, 'b', 'arn:aws:s3:::fsc573')

  }


  private managePolicies(userName: string, region: string) {
    User.fromUserName(this, userName + '_user', userName).attachInlinePolicy(getIotPolicy(userName, region, this.accountUIB, this))
  }
}
