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
            if (request.alias == null || request.password == null) {
                throw new Error("Bad Request: Please enter a username and a password");
            }
            // if the user doesn't exist then throw an error
            const existingUser = yield this.userDAO.getUser(request.alias);
            if (existingUser == null) {
                throw new Error("Internal Server Error: Invalid alias or password");
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
    // TODO: make sure the right error message is getting thrown
    register(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // make sure the request is okay
            if (request.alias == null || request.password == null || request.firstName == null || request.lastName == null || request.userImageBytes == null) {
                throw new Error("Bad Request: Please enter all information");
            }
            // check if the user already exists
            console.log(request.alias);
            const existingUser = yield this.userDAO.getUser(request.alias);
            if (existingUser != null) {
                throw new Error("User already exists in DB!"); // should this return a bad AuthenticateResponse instead?
            }
            console.log("EXISTING USER: JSON.stringify(existingUser)");
            // hash the password
            const hashedPassword = UserService.hashPassword(request.password);
            // convert image string to actual image, puts the image in the S3 bucket
            const image_url = yield this.userDAO.putImage(`${request.alias}-image`, request.userImageBytes);
            // put the user in the DB
            yield this.userDAO.putUser(request.alias, hashedPassword, request.firstName, request.lastName, image_url, 1, 1);
            // create a user and authToken if all of this worked
            const user = new tweeter_shared_1.User(request.firstName, request.lastName, request.alias, image_url);
            const authToken = tweeter_shared_1.AuthToken.Generate();
            // put the authToken in table
            yield this.authDAO.putAuth(authToken.token, authToken.timestamp, user.alias);
            // return the appropriate response
            return new tweeter_shared_1.AuthenticateResponse(true, "success", user, authToken);
        });
    }
    logout(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // make sure the request is okay
            if (request.authToken == null) {
                throw new Error("Auth Error: Invalid auth token");
            }
            // delete the authToken
            yield this.authDAO.deleteAuth(request.authToken.token);
            // await this.initialize();
            return new tweeter_shared_1.LogoutResponse(true, "successfuly logged user out");
        });
    }
    ;
    // test this
    getUser(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // make sure the request is good
            if (request.alias == null) {
                throw new Error("Bad Request: User does not exist");
            }
            // get the authtoken from the database
            const auth = yield this.authDAO.getAuth(request.authToken.token);
            if (auth == null) {
                throw new Error("Auth Error: Invalid auth token");
            }
            // get the user
            const user = yield this.userDAO.getUser(request.alias);
            if (user == null) {
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
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            // add user0 - user24 with put command
            for (let i = 0; i < 25; i++) {
                yield this.userDAO.putUser(`@User${i}`, // alias
                "a", // password
                "User", // first name
                `${i}`, // last name
                "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png", // why doesn't this work
                1, // following
                1 // followers
                );
            }
            // go mess with clint and flint in the database
            // and then go mess with the dynamo excercise
        });
    }
}
exports.UserService = UserService;
