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

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [displayChangePassword, setDisplayChangePassword] = useState(false);
  const [displayDeleteAccount, setDisplayDeleteAccount] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [warning, setDisplayWarning] = useState(null);
  const handleBack = () => {
    if (displayChangePassword) {
      setDisplayChangePassword(false);
      setDisplayDeleteAccount(false);
      setNewPassword("");
      setVerifyPassword("");
      setDisplayWarning(null);
    } else {
      navigate("/");
    }
  };
  const handleChangePassword = async () => {
    if (newPassword !== verifyPassword) {
      setDisplayWarning("Passwords do not match");
    } else if (newPassword.length < 8) {
      setDisplayWarning("Password must be at least 8 characters");
    } else {
      setLoading(true);
      try {
        await axios.post("http://mola-lab-challenge.com/reset-password", {
          user,
          newPassword,
        });
        localStorage.removeItem("user");
        localStorage.removeItem("isAdmin");
        window.location.reload(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleAccountDeletion = async () => {
    console.log(user);
    try {
      setLoading(true);
      await axios.post("http://mola-lab-challenge.com/delete-account", {
        user,
      });
      localStorage.removeItem("user");
      localStorage.removeItem("isAdmin");
      window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <GlobalFonts />
      <ProfileWrapper>
        <ArrowWrapper>
          <Arrow onClick={handleBack} />
        </ArrowWrapper>
        <ProfileInnerWrapper>
          <Title>Profile</Title>
          {loading ? (
            <LoadingOutlined
              style={{ fontSize: "1.5rem", marginTop: "25px" }}
            />
          ) : displayChangePassword ? (
            <>
              {warning && <WarningMsg>{warning}</WarningMsg>}
              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
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
              <ChangePasswordButton onClick={handleChangePassword} />
            </>
          ) : (
            <>
              <ProfileButton onClick={() => setDisplayChangePassword(true)}>
                Change Password
              </ProfileButton>
              {displayDeleteAccount ? (
                <ConfirmWrapper>
                  <ConfirmButton onClick={handleAccountDeletion}>
                    Confirm
                  </ConfirmButton>
                  <ConfirmButton onClick={() => setDisplayDeleteAccount(false)}>
                    Cancel
                  </ConfirmButton>
                </ConfirmWrapper>
              ) : (
                <ProfileButton onClick={() => setDisplayDeleteAccount(true)}>
                  Delete Account
                </ProfileButton>
              )}
            </>
          )}
        </ProfileInnerWrapper>
      </ProfileWrapper>
    </>
  );
};

export default Profile;

const ProfileWrapper = styled.div`
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

const ProfileInnerWrapper = styled.div`
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

const ProfileButton = styled.div`
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
  font-size: 1.1rem;
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

const ConfirmWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: relative;
  width: 60%;
  height: 5%;
  padding: 18px;
  margin-top: 25px;
`;

const ConfirmButton = styled.div`
  position: relative;
  width: 30%;
  height: 100%;
  border: 2px solid rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: ArticleFont;
  font-size: 1.2rem;
  letter-spacing: 0.05em;
  padding: 10px;
  transition: all 0.25s ease-out;

  &:hover {
    background-color: rgba(0, 0, 0);
    color: #fff;
    cursor: pointer;
  }
`;
