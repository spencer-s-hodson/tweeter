"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoStoryDAO = void 0;
const DAO_1 = require("../DAO");
class DynamoStoryDAO extends DAO_1.DAO {
    constructor() {
        super(...arguments);
        this.tableName = "some table";
    }
}
exports.DynamoStoryDAO = DynamoStoryDAO;
