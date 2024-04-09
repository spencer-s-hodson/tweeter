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
exports.DynamoFollowsDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const DataPage_1 = require("../../entity/DataPage");
const DAO_1 = require("../DAO"); // this doesn't so anything as of right now
class DynamoFollowsDAO extends DAO_1.DAO {
    constructor() {
        super(...arguments);
        this.tableName = "follows";
        this.indexName = "follows_index";
    }
    putItem(follower_handle, follower_name, followee_handle, followee_name) {
        return __awaiter(this, void 0, void 0, function* () {
            // follower_handle = this.addAtSymbol(follower_handle);
            // followee_handle = this.addAtSymbol(followee_handle);
            const item = {
                follower_handle,
                follower_name,
                followee_handle,
                followee_name,
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand({ TableName: this.tableName, Item: item }));
        });
    }
    getItem(follower_handle, followee_handle) {
        return __awaiter(this, void 0, void 0, function* () {
            follower_handle = this.addAtSymbol(follower_handle);
            followee_handle = this.addAtSymbol(followee_handle);
            const key = {
                follower_handle,
                followee_handle
            };
            const { Item } = yield this.client.send(new lib_dynamodb_1.GetCommand({ TableName: this.tableName, Key: key }));
            return Item;
        });
    }
    updateItem(follower_handle, followee_handle, new_follower_name, new_followee_name) {
        return __awaiter(this, void 0, void 0, function* () {
            follower_handle = this.addAtSymbol(follower_handle);
            followee_handle = this.addAtSymbol(followee_handle);
            const params = {
                TableName: this.tableName,
                Key: {
                    follower_handle,
                    followee_handle
                },
                UpdateExpression: "SET follower_name = :new_follower_name, followee_name = :new_followee_name",
                ExpressionAttributeValues: {
                    ":new_follower_name": new_follower_name,
                    ":new_followee_name": new_followee_name
                }
            };
            yield this.client.send(new lib_dynamodb_1.UpdateCommand(params));
        });
    }
    deleteItem(follower_handle, followee_handle) {
        return __awaiter(this, void 0, void 0, function* () {
            follower_handle = this.addAtSymbol(follower_handle);
            followee_handle = this.addAtSymbol(followee_handle);
            const params = {
                TableName: this.tableName,
                Key: {
                    follower_handle,
                    followee_handle
                }
            };
            yield this.client.send(new lib_dynamodb_1.DeleteCommand(params));
        });
    }
    getPageOfFollowees(follower_handle, page_size, last_followee_handle) {
        return __awaiter(this, void 0, void 0, function* () {
            follower_handle = this.addAtSymbol(follower_handle);
            // last_followee_handle = this.addAtSymbol(last_followee_handle);
            const params = {
                TableName: this.tableName,
                KeyConditionExpression: 'follower_handle = :fh',
                ExpressionAttributeValues: {
                    ':fh': follower_handle,
                },
                Limit: page_size,
                ExclusiveStartKey: last_followee_handle ? { follower_handle: follower_handle, followee_handle: last_followee_handle } : undefined,
            };
            // Perform the query
            const result = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            const items = result.Items;
            const hasMorePages = result.LastEvaluatedKey == undefined;
            // Construct and return the DataPage object
            return new DataPage_1.DataPage(items, hasMorePages);
        });
    }
    getPageOfFollowers(followee_handle, page_size, last_follower_handle) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                IndexName: "follows_index", // Assuming there's a GSI for querying by followee_handle
                KeyConditionExpression: 'followee_handle = :eh',
                ExpressionAttributeValues: {
                    ':eh': followee_handle,
                },
                Limit: page_size,
                ExclusiveStartKey: last_follower_handle ? { followee_handle: followee_handle, follower_handle: last_follower_handle } : undefined,
            };
            const result = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            const items = result.Items; // replace this
            const lastKey = result.LastEvaluatedKey ? result.LastEvaluatedKey.follower_handle : undefined;
            return new DataPage_1.DataPage(items, lastKey);
        });
    }
    getFollowersCount(followee_handle) {
        return __awaiter(this, void 0, void 0, function* () {
            return 1;
        });
    }
    getFolloweesCount(follower_handle) {
        return __awaiter(this, void 0, void 0, function* () {
            return 1;
        });
    }
    addAtSymbol(handle) {
        if (handle[0] == "@") {
            return handle;
        }
        else {
            return "@" + handle;
        }
    }
}
exports.DynamoFollowsDAO = DynamoFollowsDAO;
