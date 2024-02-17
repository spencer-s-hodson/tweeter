import "./UserInfo.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../Hooks/userInfoHook";
import { UserInfoPresenter } from "../../presenter/UserInfoPresenter";
import UserInfoView from "../../presenter/UserInfoPresenter";

const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeesCount, setFolloweesCount] = useState(-1);
  const [followersCount, setFollowersCount] = useState(-1);
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();

  const { currentUser, authToken, displayedUser, setDisplayedUser } =
    useUserInfo();

  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }

  useEffect(() => {
    setIsFollowerStatus(authToken!, currentUser!, displayedUser!);
    setNumbFollowees(authToken!, displayedUser!);
    setNumbFollowers(authToken!, displayedUser!);
  });


  const listener: UserInfoView = {
    displayErrorMessage: displayErrorMessage,
    displayInfoMessage: displayInfoMessage,
    clearLastInfoMessage: clearLastInfoMessage,
    setIsFollower: setIsFollower,
    setFolloweesCount: setFolloweesCount,
    setFollowersCount: setFollowersCount,
    setDisplayedUser: setDisplayedUser
  };


  const [presenter] = useState(new UserInfoPresenter(listener));


  const setIsFollowerStatus = async (authToken: AuthToken, currentUser: User, displayedUser: User) => {
    presenter.setIsFollowerStatus(authToken, currentUser, displayedUser);
  };

  const setNumbFollowees = async (authToken: AuthToken, displayedUser: User) => {
    presenter.setNumbFollowees(authToken, displayedUser);
  };

  const setNumbFollowers = async (authToken: AuthToken, displayedUser: User) => {
    presenter.setNumbFollowers(authToken, displayedUser);
  };

  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    presenter.switchToLoggedInUser(currentUser!)
  };

  const followDisplayedUser = async (event: React.MouseEvent, authToken: AuthToken, userToFollow: User): Promise<void> => {
    event.preventDefault();
    presenter.followDisplayedUser(authToken, userToFollow);
  };

  const unfollowDisplayedUser = async (event: React.MouseEvent, authToken: AuthToken, displayedUser: User): Promise<void> => {
    event.preventDefault();
    presenter.unfollowDisplayedUser(authToken, displayedUser);
    
  };

  return (
    <>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {displayedUser !== currentUser && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={""}
                    onClick={(event) => switchToLoggedInUser(event)}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {followeesCount > -1 && followersCount > -1 && (
                <div>
                  Following: {followeesCount} Followers: {followersCount}
                </div>
              )}
            </div>
            <form>
              {displayedUser !== currentUser && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      onClick={(event) => unfollowDisplayedUser(event, authToken!, displayedUser!)}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      onClick={(event) => followDisplayedUser(event, authToken!, displayedUser!)}  // this might be wrong
                    >
                      Follow
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
