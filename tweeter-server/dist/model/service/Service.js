"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const Factory_1 = require("../../factory/Factory");
const Follows_1 = require("../../entity/Follows");
class Service {
    constructor() {
        this.authDAO = Factory_1.Factory.factory.getAuthDAO();
    }
    isValidAuthToken(authToken) {
        // make sure to delete the authToken
        return true;
        // const timeDifference: number = Date.now() - authToken.timestamp;
        // // 20 minutes
        // if (timeDifference >= 120000) {
        //   return false;
        // }
        // return true;
    }
    dynamoUserToUser(user) {
        const dyanmoUser = user;
        return new tweeter_shared_1.User(dyanmoUser.user_first_name, dyanmoUser.user_last_name, dyanmoUser.user_alias, dyanmoUser.user_image);
    }
    dynamoFollowsToFollows(follows) {
        const myObj = follows;
        return new Follows_1.Follows(myObj.follower_handle, myObj.followee_handle);
    }
    dynamoAuthtoAuth(authToken) {
        const myObj = authToken;
        return new tweeter_shared_1.AuthToken(myObj.token, myObj.timestamp);
    }
    getAliasFromDynamoAuth(authToken) {
        const dynamoAuthToken = authToken;
        return dynamoAuthToken.user_alias;
    }
}
exports.Service = Service;
