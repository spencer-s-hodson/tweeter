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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const sha256_1 = __importDefault(require("crypto-js/sha256"));
const tweeter_shared_1 = require("tweeter-shared");
const Factory_1 = require("../../factory/Factory");
const Service_1 = require("./Service");
class UserService extends Service_1.Service {
    constructor() {
        super();
        this.userDAO = Factory_1.Factory.factory.getUserDAO();
    }
    login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // make sure the request is okay
            if (!request || !request.alias || !request.password) {
                throw new Error("[Bad Request]: Please enter a username and a password");
            }
            // if the user doesn't exist then throw an error
            const existingUser = yield this.userDAO.getUser(request.alias);
            if (existingUser == null) {
                throw new Error("[Unauthorized]: Invalid alias or password");
            }
            // create user and authToken
            const user = this.dynamoUserToUser(existingUser);
            const authToken = tweeter_shared_1.AuthToken.Generate();
            // put authToken in table
            yield this.authDAO.putAuth(authToken.token, authToken.timestamp, user.alias);
            // return a login response
            return new tweeter_shared_1.AuthenticateResponse(true, `Successfully logged in ${existingUser.firstName}.`, user, authToken);
        });
    }
    ;
    register(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // make sure the request is okay
            if (!request || !request.alias || !request.password || !request.firstName || !request.lastName || !request.userImageBytes) {
                throw new Error("[Bad Request]: Please enter all information");
            }
            // check if the user already exists
            const existingUser = yield this.userDAO.getUser(request.alias);
            if (existingUser != null) {
                throw new Error("[Unauthorized]: A user with this username already exists");
            }
            // hash the password
            const hashedPassword = UserService.hashPassword(request.password);
            // convert image string to actual image, puts the image in the S3 bucket
            const image_url = yield this.userDAO.putImage(`${request.alias}-image`, request.userImageBytes);
            // put the user in the DB
            yield this.userDAO.putUser(request.alias, hashedPassword, request.firstName, request.lastName, image_url, 0, 0);
            // create a user and authToken if all of this worked
            const user = new tweeter_shared_1.User(request.firstName, request.lastName, request.alias, image_url);
            const authToken = tweeter_shared_1.AuthToken.Generate();
            // put the authToken in table
            yield this.authDAO.putAuth(authToken.token, authToken.timestamp, user.alias);
            // return the appropriate response
            return new tweeter_shared_1.AuthenticateResponse(true, `Successfully registered ${user.firstName} ${user.lastName}`, user, authToken);
        });
    }
    logout(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // make sure the request is okay
            if (!request || !request.authToken) {
                throw new Error("[Bad Request]: Unable to logout the user");
            }
            // delete the authToken in the DB
            yield this.authDAO.deleteAuth(request.authToken.token);
            return new tweeter_shared_1.LogoutResponse(true, "Successfuly logged user out");
        });
    }
    ;
    getUser(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // make sure the request is good
            if (!request || !request.alias || !request.authToken) {
                throw new Error("[Bad Request]: Please enter all information");
            }
            // get the authtoken from the database
            const auth = yield this.authDAO.getAuth(request.authToken.token);
            if (!auth) {
                throw new Error("[Internal Server Error]: Couldn't get and authToken from the DB");
            }
            // get the user
            const user = yield this.userDAO.getUser(request.alias);
            if (!user) {
                return new tweeter_shared_1.GetUserResponse(false, "couldn't find user", null);
            }
            else {
                const actualUser = this.dynamoUserToUser(user);
                return new tweeter_shared_1.GetUserResponse(true, "successfully found user", actualUser);
            }
        });
    }
    ;
    // hashs the password
    static hashPassword(password) {
        return (0, sha256_1.default)(password).toString();
    }
}
exports.UserService = UserService;
