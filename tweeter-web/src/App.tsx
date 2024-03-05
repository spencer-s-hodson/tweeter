import "./App.css";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfo from "./components/Hooks/userInfoHook";
import { UserItemView } from "./presenter/itemPresenters/userItemPresenters/UserItemPresenter";
import { FollowingPresenter } from "./presenter/itemPresenters/userItemPresenters/FollowingPresenter";
import { FollowersPresenter } from "./presenter/itemPresenters/userItemPresenters/FollowersPresenter";
import { StatusItemView } from "./presenter/itemPresenters/statusItemPresenter/StatusItemPresenter";
import { FeedPresenter } from "./presenter/itemPresenters/statusItemPresenter/FeedPresenter";
import { StoryPresenter } from "./presenter/itemPresenters/statusItemPresenter/StoryPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />

        <Route path="feed" element={<ItemScroller key={1} renderFunction={(item) => <StatusItem item={item} />} presenterGenerator={(view: StatusItemView) => new FeedPresenter(view)} />} />
        <Route path="story" element={<ItemScroller key={2} renderFunction={(item) => <StatusItem item={item} />} presenterGenerator={(view: StatusItemView) => new StoryPresenter(view)} />} />

        <Route path="following" element={<ItemScroller key={3} renderFunction={(user) => <UserItem value={user} />} presenterGenerator={(view: UserItemView) => new FollowingPresenter(view)} />} />
        <Route path="followers" element={<ItemScroller key={4} renderFunction={(user) => <UserItem value={user} />} presenterGenerator={(view: UserItemView) => new FollowersPresenter(view)} />} />

        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
