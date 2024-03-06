import { instance, mock, verify, spy, when, anything, capture } from "ts-mockito";  // make sure this is ts-mockito when writing tests
import { AppNavbarView, AppNavbarPresenter } from "../../src/presenter/AppNavbarPresenter";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../../src/model/service/UserService";

describe("AppNavbarPresenter", () => {
  let mockAppNavbarView: AppNavbarView;
  let appNavbarPresenter: AppNavbarPresenter;
  let mockUserService: UserService;

  const authToken: AuthToken = new AuthToken("abc123", Date.now());

  beforeEach(() => {
    mockAppNavbarView = mock<AppNavbarView>();
    const mockAppNavbarViewInstance = instance(mockAppNavbarView);

    const appNavbarPresenterSpy = spy(new AppNavbarPresenter(mockAppNavbarViewInstance))
    appNavbarPresenter = instance(appNavbarPresenterSpy);

    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);
    
    when(appNavbarPresenterSpy.service).thenReturn(mockUserServiceInstance);
  })

  /**
   * The presenter tells the view to display a logging out message.
   */
  it("Display a logging out message.", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockAppNavbarView.displayInfoMessage("Logging Out...", 0)).once();
  })

  /**
   * The presenter calls logout on the user service with the correct auth token.
   */
  it("Calls logout with the correct auth token", async () => {
    // make a spy of the presenter?
    await appNavbarPresenter.logOut(authToken);
    verify(mockUserService.logout(authToken)).once();

    // let [capturedAuthToken] = capture(mockUserService.logout).last();
    // expect(capturedAuthToken).toEqual(authToken);
  })

  /**
   * When the logout is successful, the presenter tells the view to clear the last
   * info message, clear the user info, and navigate to the login page.
   */
  it("Clear the last info message, clear the user info, and navigate to login page", async () => {
    await appNavbarPresenter.logOut(authToken);

    verify(mockAppNavbarView.displayErrorMessage(anything())).never();

    verify(mockAppNavbarView.clearLastInfoMessage()).once();
    verify(mockAppNavbarView.clearUserInfo()).once();  // navigate is handled in here
  })

  /**
   * When the logout is not successful, the presenter tells the view to display an
   * error message and does not tell it to do the following: clear the last info message,
   * clear the user info, and navigate to the login page.
   */
  it("Does not clear the last info message, clear the user info, and navigate to login page", async () => {
    const error = new Error("An error occurred");
    when(mockUserService.logout(authToken)).thenThrow(error);

    await appNavbarPresenter.logOut(authToken);

    verify(mockAppNavbarView.displayErrorMessage("Failed to log user out because of exception: An error occurred")).once();

    verify(mockAppNavbarView.clearLastInfoMessage()).never();
    verify(mockAppNavbarView.clearUserInfo()).never();  // navigate is handled in here
  })
});
