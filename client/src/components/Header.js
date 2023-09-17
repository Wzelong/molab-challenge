import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { useUserContext } from "../contexts/UserContext";

const Header = (props) => {
  const navigate = useNavigate();
  const [plusIconClicked, setPlusIconClicked] = useState(false);
  const [visible, setVisible] = useState(true);
  let lastScrollTop = 0;
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop]);

  return (
    <>
      <HeaderWrapper visible={plusIconClicked ? true : visible}>
        <TitleWrapper onClick={() => navigate("/")}>
          <MainTitle id="main-title">Morality and Language Lab</MainTitle>
          <SubTitle>University of Southern California</SubTitle>
        </TitleWrapper>
        <NavWrapper>
          <NavButton onClick={() => navigate("/")}>Publications</NavButton>
          {props.navButtons.map((name, index) => (
            <NavButton
              key={index}
              onClick={() => {
                if (name === "Logout") {
                  localStorage.clear();
                  window.location.reload(true);
                } else {
                  navigate(`/${name.replace(/ /g, "").toLowerCase()}`);
                }
              }}
            >
              {name}
            </NavButton>
          ))}
          <PlusIcon
            iconclicked={plusIconClicked.toString()}
            onClick={() => setPlusIconClicked(!plusIconClicked)}
          />
        </NavWrapper>
      </HeaderWrapper>
      <NavPopUpWrapper iconclicked={plusIconClicked.toString()}>
        <NavPopUpItem
          onClick={() => {
            navigate("/");
            setPlusIconClicked(false);
          }}
        >
          Publications
        </NavPopUpItem>
        {props.navButtons.map((name, index) => (
          <NavPopUpItem
            key={index}
            onClick={() => {
              if (name === "Logout") {
                localStorage.clear();
                setPlusIconClicked(false);
                window.location.reload(true);
              } else {
                navigate(`/${name.replace(/ /g, "").toLowerCase()}`);
                setPlusIconClicked(false);
              }
            }}
          >
            {name}
          </NavPopUpItem>
        ))}
      </NavPopUpWrapper>
    </>
  );
};

export default Header;

const HeaderWrapper = styled.div`
  position: sticky;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 85px;
  background-color: rgba(255, 255, 255, 0.8);
  justify-content: space-between;
  z-index: 150;
  transition: all 0.3s ease-out;
  pointer-events: ${(props) => (props.visible == false ? "none" : "auto")};
  opacity: ${(props) => (props.visible == false ? "0" : "1")};
  @media (max-width: 800px) {
    height: 60px;
  }
`;

const TitleWrapper = styled.div`
  position: relative;
  height: 100%;
  width: auto;
  display: inline-flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  left: 4vw;
  cursor: pointer;
  :hover #main-title {
    color: #c63201;
  }
  @media (max-width: 800px) {
    left: 2vw;
  }
`;

const MainTitle = styled.div`
  font-size: calc(1.7vw + 1rem);
  font-family: MainFont;
  font-weight: 400;
  color: #182457;
  transition: all 0.3s ease-out;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
`;

const SubTitle = styled.div`
  font-family: MainFontBold;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  font-size: 1rem;
  color: #c63201;
  margin-top: -3px;
  transition: all 0.3s ease-in-out;

  @media (max-width: 800px) {
    display: none;
  }
`;

const NavWrapper = styled.div`
  position: relative;
  height: 80%;
  width: auto;
  display: inline-flex;
  align-items: center;
  justify-content: space-evenly;
  right: 4vw;
  gap: 40px;

  @media (max-width: 800px) {
    height: 100%;
  }
`;

const NavButton = styled.div`
  position: relative;
  display: inline-block;
  font-family: MainFontBold;
  letter-spacing: 0.08rem;
  text-transform: uppercase;
  font-size: 0.9rem;
  color: #182457;
  transition: all 0.5s ease-in-out;

  &::before {
    content: "";
    position: absolute;
    bottom: -3px;
    left: 50%;
    width: 0;
    height: 1.2px;
    background-color: #c63201;
    transition: all 0.3s ease-in-out;
  }

  &:hover {
    color: #c63201;
    cursor: pointer;
    &::before {
      width: 100%;
      left: 0;
    }
  }

  @media (max-width: 800px) {
    display: none;
  }
`;

const PlusIcon = styled(PlusOutlined)`
  font-size: 28px;
  color: #182457;
  display: none;
  transition: all 0.25s ease-out;
  transform: ${(props) =>
    props.iconclicked == "false" ? "rotate(0)" : "rotate(45deg)"};
  @media (max-width: 800px) {
    display: inline-block;
  }

  &:hover {
    color: #c63201;
    cursor: pointer;
  }
`;

const NavPopUpWrapper = styled.div`
  position: fixed;
  top: 0px;
  height: 100vh;
  width: 100vw;
  background-color: rgba(255, 255, 255, 0.8);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 5%;
  pointer-events: ${(props) =>
    props.iconclicked == "false" ? "none" : "auto"};
  opacity: ${(props) => (props.iconclicked == "false" ? "0" : "1")};
  transform: ${(props) =>
    props.iconclicked == "false" ? "translateY(2%)" : "translateY(0)"};
  transition: all 0.3s ease-out;
  z-index: 100;

  @media (min-width: 800px) {
    display: none;
  }
`;

const NavPopUpItem = styled.div`
  position: relative;
  display: inline-block;
  font-family: MainFontBold;
  letter-spacing: 0.08rem;
  text-transform: uppercase;
  font-size: 9vw;
  color: #182457;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  transition: color 0.2s ease-out;
  &:hover {
    color: #c63201;
    cursor: pointer;
  }
`;
