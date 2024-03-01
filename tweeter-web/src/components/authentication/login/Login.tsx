import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useUserInfo from "../../Hooks/userInfoHook";
import { LoginPresenter } from "../../../presenter/authenicationPresenters/LoginPresenter";
import { AuthenticationView } from "../../../presenter/authenicationPresenters/AuthenticationPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const rememberMeRef = useRef(rememberMe);
  rememberMeRef.current = rememberMe;

  const listener: AuthenticationView = {
    navigate: navigate,
    updateUserInfo: updateUserInfo,
    displayErrorMessage: displayErrorMessage
  }

  const [presenter] = useState(new LoginPresenter(listener));

  const checkSubmitButtonStatus = (): boolean => {
    return presenter.checkSubmitButtonStatus(alias, password);
  };

  const doLogin = async () => {
    presenter.doAuthentication(alias!, password!, rememberMeRef.current, props.originalUrl);
  };

  const inputFieldGenerator = () => {
    return (
      <AuthenticationFields alias={ alias } password={ password } setAlias={ setAlias } setPassword={ setPassword }/>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      submit={doLogin}
    />
  );
};

export default Login;
