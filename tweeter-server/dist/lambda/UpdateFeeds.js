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
const tweeter_shared_1 = require("tweeter-shared");
const BATCH_SIZE = 25;
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    let authTokenJSON = JSON.parse(event.Records[0].body).authToken;
    let statusJSON = JSON.parse(event.Records[0].body).status;
    let authToken = tweeter_shared_1.AuthToken.fromJson(JSON.stringify(authTokenJSON));
    let status = tweeter_shared_1.Status.fromJson(JSON.stringify(statusJSON));
    // call the service and handle the errors there?
});
exports.handler = handler;
