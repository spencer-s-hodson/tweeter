"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const Service_1 = require("./Service");
const Follows_1 = require("../../entity/Follows");
class AuthService extends Service_1.Service {
    isValidAuthToken(authToken) {
        const timeDifference = Date.now() - authToken.timestamp;
        // 20 minutes
        if (timeDifference >= 120000) {
            return false;
        }
        return true;
    }
    dynamoFollowsToFollows(follows) {
        const myObj = follows;
        return new Follows_1.Follows(myObj.follower_handle, myObj.followee_handle);
    }
    getAliasFromDynamoAuth(authToken) {
        const dynamoAuthToken = authToken;
        return dynamoAuthToken.user_alias;
    }
}
exports.AuthService = AuthService;
