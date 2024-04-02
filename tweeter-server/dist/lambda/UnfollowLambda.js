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
exports.unfollowHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const FollowService_1 = require("../model/service/FollowService");
const unfollowHandler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Event before deserialization: " + JSON.stringify(event));
    const deserializedEvent = tweeter_shared_1.UnfollowRequest.fromJson(event);
    console.log("Deserialized Event: " + JSON.stringify(deserializedEvent));
    return new FollowService_1.FollowService().unfollow(deserializedEvent);
});
exports.unfollowHandler = unfollowHandler;
