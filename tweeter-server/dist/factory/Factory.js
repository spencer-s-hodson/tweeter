"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factory = void 0;
const DyanmoDAOFactory_1 = require("./DyanmoDAOFactory");
class Factory {
    static get factory() {
        if (this._factory == null) {
            this._factory = new DyanmoDAOFactory_1.DynamoDAOFactory();
        }
        return this._factory;
    }
}
exports.Factory = Factory;
