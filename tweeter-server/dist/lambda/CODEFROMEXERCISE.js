"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
let sqsClient = new client_sqs_1.SQSClient();
function sendMessage() {
    return __awaiter(this, void 0, void 0, function* () {
        const sqs_url = "https://sqs.us-west-2.amazonaws.com/839064361653/Tweeter";
        const messageBody = "I hope this works";
        const params = {
            DelaySeconds: 10,
            MessageBody: messageBody,
            QueueUrl: sqs_url,
        };
        try {
            const data = yield sqsClient.send(new client_sqs_1.SendMessageCommand(params));
            console.log("Success, message sent. MessageID:", data.MessageId);
        }
        catch (err) {
            throw err;
        }
    });
}
sendMessage();
const handler = function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < event.Records.length; ++i) {
            const { body } = event.Records[i];
            // TODO: Add code to print message body to the log.
            if (body) {
                console.log(body);
            }
            return null;
        }
        ;
    });
};
exports.handler = handler;
