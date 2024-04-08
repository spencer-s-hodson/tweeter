"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class DAO {
    constructor() {
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({ region: "us-west-2" }));
    }
}
exports.DAO = DAO;
