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
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    // // create a users DAO
    // const userDAO: DynamoUserDAO = Factory.factory.getUserDAO();
    // // add user0 - user24 with put command
    // for (let i = 0; i < 25; i++) {
    //   await userDAO.putUser(
    //     `User${i}`, // alias
    //     "a",        // password
    //     "User",     // first name
    //     `${i}`,          // last name
    //     "https://my-tweeter-bucket.s3.us-west-2.amazonaws.com/image/thousand-yard-stare-1000-yard-stare.png"  // image url
    //   );
    // }
});
main();
