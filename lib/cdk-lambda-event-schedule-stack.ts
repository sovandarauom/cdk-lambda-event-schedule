import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import * as path from "path";

export class CdkLambdaEventScheduleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const newLambda = new Function(this, 'newLambda',{
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset(path.join(__dirname, 'handlers')),
      handler: 'cron.handler',
      memorySize: 128,
      logRetention: RetentionDays.ONE_DAY,
    });

    const lambdaTarget = new LambdaFunction(newLambda);
    const eventRule = new Rule(this, 'scheduleRule', {
      schedule: Schedule.expression('cron(0/5 * * * ? *)'),
      targets: [lambdaTarget],
    });
  }
}
