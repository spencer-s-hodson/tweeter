import { instance, mock, verify, spy, when, anything, capture } from "ts-mockito";  // make sure this is ts-mockito when writing tests
import { PostStatusView, PostStatusPresenter } from "../../src/presenter/PostStatusPresenter"
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockStatusService: StatusService;

  const authToken: AuthToken = new AuthToken("abc123", Date.now());
  const post: string = "Hello World!";
  const user: User = new User("Spencer", "Hodson", "spencer-hodson", "image")
  const status: Status = new Status(post, user, 0);

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance))
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockStatusService = mock<StatusService>();
    const mockStatusServiceInstance = instance(mockStatusService);
    
    when(postStatusPresenterSpy.service).thenReturn(mockStatusServiceInstance);
  })

  /**
   * The presenter tells the view to display a posting status message.
   */
  it("Display a posting status message.", async () => {
    await postStatusPresenter.submitPost(post, user, authToken);
    verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
  })

  /**
   * The presenter calls postStatus on the post status service with the correct status string and auth token.
   */
  it("Calls submitPost with correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(post, user, authToken);
    verify(mockStatusService.postStatus(authToken, status))
  })

  /**
   * When posting of the status is successful, the presenter tells the view to clear the last info message, 
   * clear the post, and display a status posted message.
   */
  it("Clear the last info message, clear the post, and display a status posted message.", async () => {
    await postStatusPresenter.submitPost(post, user, authToken);

    verify(mockPostStatusView.displayErrorMessage(anything())).never();

    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.setPost("")).once();  // I have this in my presenter class and im not sure if that's bad
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
  })

  /**
   * When posting of the status is not successful, the presenter tells the view to display an error message 
   * and does not tell it to do the following: clear the last info message, clear the post, and display a 
   * status posted message.
   */
  it("Don't Clear the last info message, clear the post, and display a status posted message.", async () => {
    const error = new Error("An error occurred");
    when(mockStatusService.postStatus(authToken, anything())).thenThrow(error);

    await postStatusPresenter.submitPost(post, user, authToken);

    verify(mockPostStatusView.displayErrorMessage("Failed to post to status because of exception: An error occurred")).once();

    verify(mockPostStatusView.clearLastInfoMessage()).never();
    verify(mockPostStatusView.setPost("")).never();  // I have this in my presenter class and im not sure if that's bad
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();
  })


  /** TEST REIVEW
   * Mock: a fake object
   * Spy: wrapper around an object that monitors its inputs and output, modify SOME of the behavior
   * 
   * Why would I ever want a spy vs. a mock?
   * - use a mock when you haven't implemented a class yet, isolate it from dependencies for unit testing
   * - use a spy 
   * 
   * DEFINETLY GO OVER Software Design Principles
   * - if you have no idea, guess single responsibility
   */
})



