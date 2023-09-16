import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Wrapper from "./Wrapper";
import Publications from "./pages/Publications";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Verify from "./pages/Verify";
import { useUserContext } from "./contexts/UserContext";

const Router = () => {
  const { user, isAdmin } = useUserContext();
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route, accessible to all */}
        <Route
          path="/"
          element={
            <Wrapper>
              <Publications />
            </Wrapper>
          }
        />

        {/* Routes accessible when user is null */}
        {!user && (
          <>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<Verify />} />
          </>
        )}

        {/* Routes accessible when user is not null */}
        {user && (
          <>
            <Route path="/profile" element={<Profile />} />
            {/* Admin route, accessible when isAdmin is true */}
            {isAdmin && <Route path="/admin" element={<Admin />} />}
          </>
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route render={() => <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
