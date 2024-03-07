import React from "react";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { MemoryRouter } from "react-router-dom";
import Login from "../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../src/presenter/authenicationPresenters/LoginPresenter";
import { anything, instance, mock, verify } from "ts-mockito";
import { AuthToken, User } from "tweeter-shared";
import useUserInfo from "../../../src/components/Hooks/userInfoHook";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";

jest.mock("../../../src/components/Hooks/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/Hooks/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

describe("PostStatus Component", () => {
  beforeAll(() => {
    const mockUser = mock<User>();
    const mockUserInstance = instance(mockUser);

    const mockAuthToken = mock<AuthToken>();
    const mockAuthTokenInstance = instance(mockAuthToken);

    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    })
  })

  /**
   * When first rendered the Post Status and Clear buttons are both disabled.
   */
  it("Initially, post and clear buttons are disabled", () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElements();
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  })

  /**
   * Both buttons are enabled when the text field has text.
   */
  it("Buttons Enabled", async () => {
    const { textField, postStatusButton, clearButton, user } = renderPostStatusAndGetElements();

    await user.type(textField, "Hello World!");

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  })

  /**
   * Both buttons are disabled when the text field is cleared.
   */
  it("Buttons Disabled", async () => {
    const { textField, postStatusButton, clearButton, user } = renderPostStatusAndGetElements();

    await user.type(textField, "Hello World!");

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(textField);

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  })

  /**
   * The presenter's postStatus method is called with correct parameters when the Post Status button is pressed.
   */
  it("PostStatus presenter's submitPost is called", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const { currentUser, authToken } = useUserInfo();
    const { textField, postStatusButton, user } = renderPostStatusAndGetElements(mockPresenterInstance);

    await user.type(textField, "Hello World!");
    await user.click(postStatusButton);

    verify(mockPresenter.submitPost("Hello World!", currentUser!, authToken!)).once();  // why is this not working???
  })
})

const renderPostStatus = (presenter?: PostStatusPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <PostStatus presenter={presenter} />
      ) : (
        <PostStatus />
      )}
    </MemoryRouter>
  )
}

const renderPostStatusAndGetElements = (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const textField = screen.getByLabelText("text");
  const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });

  return { textField, postStatusButton, clearButton, user }
}
