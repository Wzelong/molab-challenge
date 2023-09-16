import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import GlobalFonts from "./fonts/fonts";
import styled, { createGlobalStyle } from "styled-components";
import { useUserContext } from "./contexts/UserContext";

const Wrapper = ({ children }) => {
  const { user, isAdmin } = useUserContext();
  const [nav, setNav] = useState([]);
  useEffect(() => {
    if (!user) {
      setNav(["Sign up", "Login"]);
    } else if (isAdmin) {
      setNav(["Admin", "Profile", "Logout"]);
    } else {
      setNav(["Profile", "Logout"]);
    }
  }, [user, isAdmin]);
  return (
    <>
      <GlobalFonts />
      <GlobalStyle />
      <Header navButtons={nav} />
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </>
  );
};

export default Wrapper;

const ChildrenWrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  top: 85px;
  @media (max-width: 800px) {
    top: 60px;
  }
`;

const GlobalStyle = createGlobalStyle`
  :where(.css-dev-only-do-not-override-18iikkb).ant-select-dropdown .ant-select-item {
    font-size: 1.3rem;
  }
  .rc-virtual-list-scrollbar {
    width: 3px !important;
  }
  :where(.css-dev-only-do-not-override-18iikkb).ant-select-dropdown .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background-color: transparent;
    color: #c63201;
  }
`;
