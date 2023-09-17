import React, { useState } from "react";
import styled from "styled-components";
import {
  ArrowLeftOutlined,
  LoginOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import GlobalFonts from "../fonts/fonts";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../contexts/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setIsAdmin } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayWarning, setDisplayWarning] = useState(false);

  const validateEmail = (e) => {
    setDisplayWarning(false);
    const input = e.target.value;
    setEmail(input);
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (pattern.test(input)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };

  const validatePassword = (e) => {
    setDisplayWarning(false);
    const input = e.target.value;
    setPassword(input);
    if (input.length > 0) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  };

  const validateLogin = async () => {
    if (emailValid && passwordValid) {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://mola-lab-challenge.com/login",
          {
            email,
            password,
          },
        );
        setLoading(false);
        setUser(email);
        setIsAdmin(response.data.isAdmin);
        setEmail("");
        setPassword("");
        navigate("/");
      } catch (error) {
        setDisplayWarning(true);
        setLoading(false);
      }
    }
  };
  return (
    <>
      <GlobalFonts />
      <LoginWrapper>
        <ArrowWrapper>
          <Arrow onClick={() => navigate("/")} />
        </ArrowWrapper>
        <LoginInnerWrapper>
          <Title>MOLA Lab</Title>
          <Title
            style={{
              color: "#c63201",
              fontSize: "1.8rem",
              fontFamily: "MainFontBold",
            }}
          >
            Login
          </Title>
          {displayWarning && (
            <WarningMsg>Incorrect email or password</WarningMsg>
          )}
          <Input
            type="text"
            placeholder="Email"
            value={email}
            onChange={validateEmail}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={validatePassword}
          />
          {loading ? (
            <LoadingOutlined
              style={{ fontSize: "1.5rem", marginTop: "25px" }}
            />
          ) : (
            <LoginButton
              $isvalid={emailValid && passwordValid}
              onClick={validateLogin}
            />
          )}
        </LoginInnerWrapper>
      </LoginWrapper>
    </>
  );
};

export default Login;

const LoginWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  @media (max-height: 700px) {
    height: 700px;
  }
`;

const ArrowWrapper = styled.div`
  width: 400px;
  height: auto;
  margin-bottom: 15px;
  @media (max-width: 450px) {
    width: 85%;
  }
`;

const Arrow = styled(ArrowLeftOutlined)`
  font-size: 1.5rem;
  color: rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease-out;

  &:hover {
    color: #c63201;
    cursor: pointer;
  }
`;

const LoginInnerWrapper = styled.div`
  height: 60%;
  width: 400px;
  border: 1.5px solid rgba(0, 0, 0, 0.25);
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  @media (max-width: 450px) {
    width: 90%;
    border: none;
  }
`;

const Title = styled.div`
  font-size: 2rem;
  font-family: MainFont;
  font-weight: 400;
  color: #182457;
  transition: all 0.3s ease-out;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
`;

const Input = styled.input`
  border: 1.5px solid rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  position: relative;
  width: 70%;
  height: 5%;
  padding: 20px;
  margin-left: 10px;
  font-family: ArticleFont;
  font-size: 1.3rem;
  letter-spacing: 0.05em;
  line-height: 1.8;
  outline-color: black;
  margin-top: 20px;
  display: ${(props) => (props.$displayverify ? "none" : "block")};
`;

const LoginButton = styled(LoginOutlined)`
  font-size: 1.5rem;
  color: #182457;
  transition: all 0.3s ease-out;
  margin-top: 20px;
  display: ${(props) =>
    props.$isvalid ? (props.$displayverify ? "none" : "block") : "none"};
  &:hover {
    color: #c63201;
    cursor: pointer;
  }
`;

const WarningMsg = styled.div`
  font-size: 1.5rem;
  font-family: MainFont;
  color: #c63201;
  margin-top: 20px;
`;
