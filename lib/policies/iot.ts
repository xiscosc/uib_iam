import { Stack } from "aws-cdk-lib";
import { Effect, Policy, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";

export function getIotPolicy(userName: string, region: string, accountId: string, stack: Stack): Policy {

  const lambdaRole = new Role(stack, `${userName}_role_lambda`, {
    assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    roleName: `${userName}_role_lambda`
  })

  const lambdaPolicy = new Policy(stack, `${userName}_lambda_policy_musi_iot`, { policyName: `${userName}_lambda_policy_musi_iot` })
  lambdaPolicy.addStatements(new PolicyStatement({
    actions: ["logs:CreateLogGroup"],
    effect: Effect.ALLOW,
    resources: [`arn:aws:logs:${region}:${accountId}:*`],
  }))

  lambdaPolicy.addStatements(new PolicyStatement({
    actions: [
      "s3:ListBucketVersions",
      "s3:ListBucket",
    ],
    effect: Effect.ALLOW,
    resources: [`arn:aws:s3:::${userName}*`],
  }))

  lambdaPolicy.addStatements(new PolicyStatement({
    actions: [
      "s3:PutObject",
      "s3:GetObject",
      "s3:DeleteObject"
    ],
    effect: Effect.ALLOW,
    resources: [`arn:aws:s3:::${userName}*/*`],
  }))

  lambdaPolicy.addStatements(new PolicyStatement({
    actions: [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ],
    effect: Effect.ALLOW,
    resources: [`arn:aws:logs:${region}:${accountId}:log-group:/aws/lambda/*`],
  }))

  lambdaPolicy.addStatements(new PolicyStatement({
    actions: [
      "iot:*",
      "dynamodb:*",
      'lambda:*',
      "apigateway:*",
      "sns:*",
      "sqs:*"
    ],
    effect: Effect.ALLOW,
    resources: ['*'],
    conditions: {
      "StringEquals": {
        "aws:RequestedRegion": region
      }
    }
  }))

  

  lambdaRole.attachInlinePolicy(lambdaPolicy)

  const userPolicy = new Policy(stack, `${userName}_policy_musi_iot`, { policyName: `${userName}_policy_musi_iot` })
  userPolicy.addStatements(new PolicyStatement({
    actions: [
      "iot:*",
      "dynamodb:*",
      'lambda:*',
      "apigateway:*",
      "cloudwatch:*",
      "logs:*",
      "sns:*",
      "sqs:*"
    ],
    effect: Effect.ALLOW,
    resources: ['*'],
    conditions: {
      "StringEquals": {
        "aws:RequestedRegion": region
      }
    }
  }))

  userPolicy.addStatements(new PolicyStatement({
    actions: ["iam:PassRole"],
    effect: Effect.ALLOW,
    resources: [lambdaRole.roleArn]
  }))

  return userPolicy
}
