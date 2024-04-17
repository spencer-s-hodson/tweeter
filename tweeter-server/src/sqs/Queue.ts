import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export class MySQS {
  private sqsClient = new SQSClient();

  public async sendMessage(messageBody: string, sqs_url: string): Promise<void> {

    const params = {
      DelaySeconds: 10,
      MessageBody: messageBody,
      QueueUrl: sqs_url,
    };

    try {
      const data = await this.sqsClient.send(new SendMessageCommand(params));
      console.log("Success, message sent. MessageID:", data.MessageId);
    } catch (err) {
      throw err;
    }
  }
}
