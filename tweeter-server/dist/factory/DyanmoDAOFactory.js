"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDAOFactory = void 0;
const DyanmoAuthDAO_1 = require("../dao/dynamo/DyanmoAuthDAO");
const DynamoFeedDAO_1 = require("../dao/dynamo/DynamoFeedDAO");
const DynamoFollowsDAO_1 = require("../dao/dynamo/DynamoFollowsDAO");
const DynamoStoryDAO_1 = require("../dao/dynamo/DynamoStoryDAO");
const DynamoUserDAO_1 = require("../dao/dynamo/DynamoUserDAO");
class DynamoDAOFactory {
    getAuthDAO() {
        return new DyanmoAuthDAO_1.DynamoAuthDAO();
    }
    getFeedDAO() {
        return new DynamoFeedDAO_1.DynamoFeedDAO();
    }
    getFollowsDAO() {
        return new DynamoFollowsDAO_1.DynamoFollowsDAO();
    }
    getStoryDAO() {
        return new DynamoStoryDAO_1.DynamoStoryDAO();
    }
    getUserDAO() {
        return new DynamoUserDAO_1.DynamoUserDAO();
    }
}
exports.DynamoDAOFactory = DynamoDAOFactory;
