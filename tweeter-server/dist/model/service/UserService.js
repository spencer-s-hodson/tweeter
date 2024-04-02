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
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class UserService {
    login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = tweeter_shared_1.FakeData.instance.firstUser;
            if (request.alias != null || request.password != null) {
                throw new Error("Please enter a username and a password");
            }
            if (user === null) {
                throw new Error("Invalid alias or password");
            }
            return new tweeter_shared_1.AuthenticateResponse(true, "nice", user, tweeter_shared_1.AuthToken.Generate());
        });
    }
    ;
    register(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Replace with the result of calling the server
            let user = tweeter_shared_1.FakeData.instance.firstUser;
            if (request.alias != null || request.password != null) {
                throw new Error("Please enter all information");
            }
            if (user === null) {
                throw new Error("Invalid registration");
            }
            return new tweeter_shared_1.AuthenticateResponse(true, "nice", user, tweeter_shared_1.AuthToken.Generate());
        });
    }
    ;
    logout(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // Pause so we can see the logging out message. Delete when the call to the server is implemented.
            yield new Promise((res) => setTimeout(res, 1000));
            return new tweeter_shared_1.LogoutResponse(true, "successfuly logged out");
        });
    }
    ;
    getUser(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return new tweeter_shared_1.GetUserResponse(true, "successfully found user", tweeter_shared_1.FakeData.instance.findUserByAlias(request.alias));
        });
    }
    ;
}
exports.UserService = UserService;
