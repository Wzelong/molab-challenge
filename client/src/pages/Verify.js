import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  ArrowLeftOutlined,
  LoginOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import GlobalFonts from "../fonts/fonts";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Verify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(
          `http://mola-lab-challenge.com/api/user/verify?token=${token}`,
        );
      } catch (err) {
        setDisplayInvalidLink(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      navigate("/");
    }
  }, [token]);
  useEffect(() => {
    document.title = "Verify";
  }, []);

  const [newPassword, setNewpassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [warning, setDisplayWarning] = useState(null);
  const [displayInvalidLink, setDisplayInvalidLink] = useState(false);
  const handleBack = () => {
    navigate("/");
  };
  const handleChangePassword = async () => {
    setLoading(true);
    if (newPassword !== verifyPassword) {
      setDisplayWarning("Passwords do not match");
    } else if (newPassword.length < 8) {
      setDisplayWarning("Password must be at least 8 characters");
    } else {
      try {
        await axios.post(
          "http://mola-lab-challenge.com/api/user/set-password",
          {
            token,
            newPassword,
          },
        );
      } catch (err) {
        console.error(err.response.data);
      }
      setLoading(false);
      setDisplayWarning(null);
      setNewpassword("");
      setVerifyPassword("");
      navigate("/login");
    }
  };
  return (
    <>
      <GlobalFonts />
      <PasswordWrapper>
        {displayInvalidLink ? (
          <Title>Invalid or Expired Link</Title>
        ) : (
          <>
            <ArrowWrapper>
              <Arrow onClick={handleBack} />
            </ArrowWrapper>
            <PasswordInnerWrapper>
              <Title>Set Password</Title>
              {warning && <WarningMsg>{warning}</WarningMsg>}
              <Input
                type="password"
                placeholder="Password"
                value={newPassword}
                onChange={(e) => {
                  setNewpassword(e.target.value);
                }}
              />
              <Input
                type="password"
                placeholder="Verify Password"
                value={verifyPassword}
                onChange={(e) => {
                  setVerifyPassword(e.target.value);
                }}
              />
              {loading ? (
                <LoadingOutlined
                  style={{ fontSize: "1.5rem", marginTop: "25px" }}
                />
              ) : (
                <ChangePasswordButton onClick={handleChangePassword} />
              )}
            </PasswordInnerWrapper>
          </>
        )}
      </PasswordWrapper>
    </>
  );
};

export default Verify;

const PasswordWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  @media (max-height: 700px) {
    height: 700px;
  }
  animation: fade-in 1s ease-in-out;
  opacity: 1;

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
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

const PasswordInnerWrapper = styled.div`
  height: 60%;
  width: 400px;
  border: 1.5px solid rgba(0, 0, 0, 0.5);
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

const PasswordButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  position: relative;
  width: 60%;
  height: 5%;
  padding: 18px;
  font-family: ArticleFont;
  font-size: 1.3rem;
  letter-spacing: 0.05em;
  margin-top: 25px;
  transition: all 0.25s ease-out;

  &:hover {
    background-color: rgba(0, 0, 0);
    color: #fff;
    cursor: pointer;
  }
`;

const Input = styled.input`
  border: 1.5px solid rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  position: relative;
  width: 60%;
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

const ChangePasswordButton = styled(LoginOutlined)`
  font-size: 1.5rem;
  color: #182457;
  transition: all 0.3s ease-out;
  display: block;
  margin-top: 20px;
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
