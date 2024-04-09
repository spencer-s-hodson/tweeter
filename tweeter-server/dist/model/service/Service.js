"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const Factory_1 = require("../../factory/Factory");
class Service {
    constructor() {
        this.authDAO = Factory_1.Factory.factory.getAuthDAO();
    }
    isValidAuthToken(authToken) {
        const timeDifference = Date.now() - authToken.timestamp;
        // 20 minutes
        if (timeDifference >= 120000) {
            return false;
        }
        return true;
    }
}
exports.Service = Service;
