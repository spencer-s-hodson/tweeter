import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

let sqsClient = new SQSClient();

async function sendMessage(): Promise<void> {
  const sqs_url = "https://sqs.us-west-2.amazonaws.com/839064361653/Tweeter";
  const messageBody = "I hope this works";

  const params = {
    DelaySeconds: 10,
    MessageBody: messageBody,
    QueueUrl: sqs_url,
  };

  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
    console.log("Success, message sent. MessageID:", data.MessageId);
  } catch (err) {
    throw err;
  }
}

sendMessage();



export const handler = async function (event: any) {
  for (let i = 0; i < event.Records.length; ++i) {
    const { body } = event.Records[i];
    // TODO: Add code to print message body to the log.
    if (body) {
      console.log(body);
    }
    return null;
  };
}
