"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoFeedDAO = void 0;
const DAO_1 = require("../DAO");
class DynamoFeedDAO extends DAO_1.DAO {
    constructor() {
        super(...arguments);
        this.tableName = "someTable";
    }
}
exports.DynamoFeedDAO = DynamoFeedDAO;
