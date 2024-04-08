import { DAOFactory } from "./DAOFactory";
import { DynamoDAOFactory } from "./DyanmoDAOFactory";

export class Factory {
  private static _factory: DAOFactory;

  public static get factory(): DAOFactory {
    if (this._factory == null) {
      this._factory = new DynamoDAOFactory();
    }
    return this._factory;
  }
}
