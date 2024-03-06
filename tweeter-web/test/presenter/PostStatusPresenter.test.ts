import { instance, mock, verify, spy, when, anything } from "ts-mockito";  // make sure this is ts-mockito when writing tests
import { AppNavbarView, AppNavbarPresenter } from "../../src/presenter/AppNavbarPresenter";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../../src/model/service/UserService";

describe("PostStatusPresenter", () => {
  /**
   * The presenter tells the view to display a logging out message.
   */
  it("")

  /**
   * The presenter calls logout on the user service with the correct auth token.
   */
  it("")

  /**
   * When the logout is successful, the presenter tells the view to clear the last 
   * info message, clear the user info, and navigate to the login page.
   */
  it("")

  /**
   * When the logout is not successful, the presenter tells the view to display an 
   * error message and does not tell it to do the following: clear the last info message, 
   * clear the user info, and navigate to the login page.
   */
  it("")
})



