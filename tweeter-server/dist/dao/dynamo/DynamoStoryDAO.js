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
exports.DynamoStoryDAO = void 0;
const DataPage_1 = require("../../entity/DataPage");
const DAO_1 = require("../DAO");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class DynamoStoryDAO extends DAO_1.DAO {
    constructor() {
        super(...arguments);
        this.tableName = "story";
    }
    putStory(user_alias, timestamp, post) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = {
                user_alias,
                timestamp,
                post
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand({ TableName: this.tableName, Item: item }));
        });
    }
    getPageOfStories(user_alias, page_size, last_timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                KeyConditionExpression: 'user_alias = :ua',
                ExpressionAttributeValues: {
                    ':ua': user_alias,
                },
                Limit: page_size,
                ExclusiveStartKey: last_timestamp ? { user_alias: user_alias, timestamp: last_timestamp } : undefined,
            };
            // Perform the query
            const result = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            const items = result.Items;
            const hasMorePages = result.LastEvaluatedKey == undefined;
            // Construct and return the DataPage object
            return new DataPage_1.DataPage(items, hasMorePages);
        });
    }
}
exports.DynamoStoryDAO = DynamoStoryDAO;
