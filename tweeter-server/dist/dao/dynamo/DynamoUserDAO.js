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
exports.DynamoUserDAO = void 0;
const DAO_1 = require("../DAO");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_s3_1 = require("@aws-sdk/client-s3");
class DynamoUserDAO extends DAO_1.DAO {
    constructor() {
        super(...arguments);
        this.tableName = "users";
    }
    getUser(user_alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = {
                user_alias
            };
            const { Item } = yield this.client.send(new lib_dynamodb_1.GetCommand({ TableName: this.tableName, Key: key }));
            return Item;
        });
    }
    // need to change table name
    putUser(user_alias, user_password, user_first_name, user_last_name, user_image, following, followers) {
        return __awaiter(this, void 0, void 0, function* () {
            // is this wrong?
            const item = {
                user_alias,
                user_first_name,
                user_image,
                user_last_name,
                user_password,
                following,
                followers
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand({ TableName: this.tableName, Item: item }));
        });
    }
    putImage(fileName, imageStringBase64Encoded) {
        return __awaiter(this, void 0, void 0, function* () {
            const BUCKET = "my-tweeter-bucket";
            const REGION = "us-west-2";
            let decodedImageBuffer = Buffer.from(imageStringBase64Encoded, "base64");
            const s3Params = {
                Bucket: BUCKET,
                Key: "image/" + fileName,
                Body: decodedImageBuffer,
                ContentType: "image/png",
                ACL: client_s3_1.ObjectCannedACL.public_read,
            };
            const c = new client_s3_1.PutObjectCommand(s3Params);
            const client = new client_s3_1.S3Client({ region: REGION });
            try {
                yield client.send(c);
                return (`https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${fileName}`);
            }
            catch (error) {
                throw Error("s3 put image failed with: " + error);
            }
        });
    }
}
exports.DynamoUserDAO = DynamoUserDAO;
