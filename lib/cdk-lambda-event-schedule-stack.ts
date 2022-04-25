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

    const cronjob = new Function(this, 'cronjob',{
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset(path.join(__dirname, 'handlers')),
      handler: 'cron.handler',
      memorySize: 128,
      logRetention: RetentionDays.ONE_DAY,
    });
    const lambdaTargetCron = new LambdaFunction(cronjob);
    
    const listEc2 = new Function(this, 'listEc2',{
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset(path.join(__dirname, 'handlers')),
      handler: 'list-image.handler',
      memorySize: 128,
      logRetention: RetentionDays.ONE_DAY,
    });
    const lambdaTargetListEc2 = new LambdaFunction(listEc2);

    const eventRuleCron = new Rule(this, 'eventRuleCron', {
      schedule: Schedule.expression('cron(0/30 * * * ? *)'),
      targets: [lambdaTargetCron],
    });

    const eventRuleListEc2 = new Rule(this, 'eventRuleListEc2', {
      schedule: Schedule.expression('cron(0/10 * * * ? *)'),
      targets: [lambdaTargetListEc2],
    });
  }
}
