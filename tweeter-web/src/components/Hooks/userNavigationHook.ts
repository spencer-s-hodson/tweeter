import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./userInfoHook";
import { useState } from "react";
import { UserNavigationHookPresenter, UserNavigationHookView } from "../../presenter/UserNavigationHookPresenter";

const useUserNavigation = () => {
  const { displayErrorMessage } = useToastListener();
  const { setDisplayedUser, currentUser, authToken } = useUserInfo();

  const listener: UserNavigationHookView = {
    setDisplayedUser: setDisplayedUser,
    displayErrorMessage: displayErrorMessage
  }

  const [presenter] = useState(new UserNavigationHookPresenter(listener));

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    presenter.navigateToUser(event, currentUser!, authToken!);
  };

  return navigateToUser;
};
export default useUserNavigation;
