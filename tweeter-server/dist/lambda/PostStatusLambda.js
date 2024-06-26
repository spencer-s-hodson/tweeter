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
exports.postStatusHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const StatusService_1 = require("../model/service/StatusService");
const postStatusHandler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const deserializedEvent = tweeter_shared_1.PostStatusRequest.fromJson(event);
    const result = yield new StatusService_1.StatusService().postStatus(deserializedEvent);
    // if (result.success) {
    //   // send message to the first queue
    //   await this.sqs.sendMessage(JSON.stringify(request), POST_STATUS_QUEUE);
    // }
    return result;
});
exports.postStatusHandler = postStatusHandler;
