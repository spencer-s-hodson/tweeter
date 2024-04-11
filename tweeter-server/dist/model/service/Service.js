"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const Factory_1 = require("../../factory/Factory");
class Service {
    constructor() {
        this.authDAO = Factory_1.Factory.factory.getAuthDAO();
        this.userDAO = Factory_1.Factory.factory.getUserDAO();
    }
    dynamoUserToUser(user) {
        const dyanmoUser = user;
        return new tweeter_shared_1.User(dyanmoUser.user_first_name, dyanmoUser.user_last_name, dyanmoUser.user_alias, dyanmoUser.user_image);
    }
    dynamoAuthtoAuth(authToken) {
        const myObj = authToken;
        return new tweeter_shared_1.AuthToken(myObj.token, myObj.timestamp);
    }
}
exports.Service = Service;
