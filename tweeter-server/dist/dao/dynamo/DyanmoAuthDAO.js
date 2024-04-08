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
exports.DynamoAuthDAO = void 0;
const DAO_1 = require("../DAO");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class DynamoAuthDAO extends DAO_1.DAO {
    constructor() {
        super(...arguments);
        this.tableName = "authtokens";
    }
    getAuth(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = {
                token
            };
            const { Item } = yield this.client.send(new lib_dynamodb_1.GetCommand({ TableName: this.tableName, Key: key }));
            return Item;
        });
    }
    putAuth(token, timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = {
                token,
                timestamp
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand({ TableName: this.tableName, Item: item }));
        });
    }
    deleteAuth(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    token
                }
            };
            yield this.client.send(new lib_dynamodb_1.DeleteCommand(params));
        });
    }
}
exports.DynamoAuthDAO = DynamoAuthDAO;
