import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import { UserProvider } from "./contexts/UserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserProvider>
    <Router />
  </UserProvider>,
);
