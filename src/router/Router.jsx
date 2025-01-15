import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/pages/Login";
import Signup from "../components/pages/Signup";
import ForgotPassword from "../components/pages/ForgotPassword";
import ResetPassword from "../components/pages/ResetPassword";
import PageNotFound from "../components/pages/PageNotFound";
import Home from "../components/pages/Home";
import Profile from "../components/pages/Profile";
import UserProfile from "../components/pages/UserProfile";
import CreatePost from "../components/pages/CreatePost";
import SubscribedUserPosts from "../components/pages/SubscribedUserPosts";
import { isAuthenticated } from "./utils";
import ProtectedRoute from "./ProtectedRoute";
import "../App.css";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated() ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated() ? <Navigate to="/" replace /> : <Signup />}
      />
      <Route
        path="/password/forgot"
        element={
          isAuthenticated() ? <Navigate to="/" replace /> : <ForgotPassword />
        }
      />
      <Route
        path="/reset/:token"
        element={
          isAuthenticated() ? <Navigate to="/" replace /> : <ResetPassword />
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:userid"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        }
      />
      <Route
        path="/myfollowingpost"
        element={
          <ProtectedRoute>
            <SubscribedUserPosts />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default AppRoutes;
