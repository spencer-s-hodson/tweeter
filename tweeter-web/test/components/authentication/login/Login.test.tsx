import React from "react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenter/authenicationPresenters/LoginPresenter";
import { anything, instance, mock, verify } from "ts-mockito";

library.add(fab);

describe("Login Component", () => {
  /**
   * When first rendered the sign-in button is disabled.
   */
  it("Start with sign-in button disabled", () => {
    const { signInButton } = renderLoginAndGetElements("/");
    expect(signInButton).toBeDisabled();
  })

  /**
   * The sign-in button is enabled when both the alias and password fields have text.
   */
  it("Sign In button enabled if alias and password have text", async () => {
    const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElements("/");

    await user.type(aliasField, "a");
    await user.type(passwordField, "b");

    expect(signInButton).toBeEnabled();

  })

  /**
   * The sign-in button is disabled if either the alias or password field is cleared.
   */
  it("Sign in button disabled if alias and password don't have text", async () => {
    const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElements("/");

    await user.type(aliasField, "a");
    await user.type(passwordField, "b");

    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "1");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  })

  /**
   * The presenter's login method is called with correct parameters when the sign-in button is pressed.
   */
  it("Login presenter's login method is called", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "htpp://someurl.com";
    const alias = "@SomeAlias";
    const password = "myPassword";
    const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElements(originalUrl, mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);

    await user.click(signInButton);

    verify(mockPresenter.doLogin(alias, password, anything(), originalUrl)).once();  // is happening 0 times
  })
})

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>
  )
}

const renderLoginAndGetElements = (originalUrl: string, presenter?: LoginPresenter) => {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { signInButton, aliasField, passwordField, user }
}
