import { ServerFacade } from "../net/ServerFacade";

export class Service {
  protected serverFacade: ServerFacade = new ServerFacade();
  protected addAt(handle: string) {
    if (handle[0] == "@") {
      return handle;
    }
    else {
      return "@" + handle;
    }
  }
}
