import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  ArrowLeftOutlined,
  UsergroupAddOutlined,
  UsergroupDeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Pagination } from "antd";
import GlobalFonts from "../fonts/fonts";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import axios from "axios";

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [listLength, setListLength] = useState(1);
  const [minIndex, setMinIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(8);
  const [searchInput, setSearchInput] = useState("");
  const handlePageChange = (page) => {
    setMinIndex((page - 1) * 8);
    setMaxIndex(page * 8);
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        "http://mola-lab-challenge.com/all-users",
      );
      setUsers(response.data.users);
      setListLength(response.data.users.length);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
    document.title = "Admin";
  }, []);

  const handleAdminManage = async (email) => {
    try {
      const response = await axios.post(
        "http://mola-lab-challenge.com/admin-manage",
        {
          email,
        },
      );
      if (response.data.status === "success") {
        await fetchUser();
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log(searchInput);
  return (
    <>
      <GlobalFonts />
      <AdminWrapper>
        <ArrowWrapper>
          <Arrow onClick={() => navigate("/")} />
        </ArrowWrapper>
        <AdminInnerWrapper>
          <Title>Admin</Title>
          <SearchBar
            style={{ border: "none", marginTop: "0px", marginBottom: "0px" }}
            setSearchInput={setSearchInput}
          />
          <UserList>
            {users
              .filter((user) => {
                // If searchInput is empty, skip filtering and return all users
                if (searchInput.length == 0) return true;

                // Otherwise, only include users that match the search term
                return user.email
                  .toLowerCase()
                  .includes(searchInput.toLowerCase());
              })
              .map((user, index) => {
                if (index >= minIndex && index < maxIndex) {
                  return (
                    <ListItem key={index}>
                      <div style={{ color: user.admin ? "#c63201" : "black" }}>
                        {user.email}
                      </div>
                      {user.email === "admin@mola.lab" ? null : (
                        <div className="manage" style={{ display: "none" }}>
                          {user.admin ? (
                            <UsergroupDeleteOutlined
                              style={{ fontSize: "1.3rem" }}
                              onClick={() => handleAdminManage(user.email)}
                            />
                          ) : (
                            <UsergroupAddOutlined
                              style={{ fontSize: "1.3rem" }}
                              onClick={() => handleAdminManage(user.email)}
                            />
                          )}
                        </div>
                      )}
                    </ListItem>
                  );
                }
              })}
          </UserList>
          <Pagination
            simple
            defaultCurrent={1}
            pageSize={8}
            onChange={handlePageChange}
            total={listLength}
          />
        </AdminInnerWrapper>
      </AdminWrapper>
    </>
  );
};

export default Admin;

const AdminWrapper = styled.div`
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

const AdminInnerWrapper = styled.div`
  height: 550px;
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

const UserList = styled.ul`
  position: relative;
  width: 80%;
  height: 60%;
  margin: 0 auto;
  list-style-type: none;
  margin: 0;
  margin-bottom: 10px;
  padding: 0;
  list-style-type: none;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - 20px);
  height: auto;
  font-size: 1.2rem;
  font-family: MainFont;
  color: #182457;
  margin: 0;
  padding: 5px;
  transition: all 0.2s ease-out;

  &:hover {
    .manage {
      display: block !important;
    }
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
  }

  .manage {
    transition: all 0.2s ease-out;
    :hover {
      color: #c63201;
    }
  }
`;
