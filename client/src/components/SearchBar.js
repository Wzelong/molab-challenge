import React, { useState } from "react";
import styled from "styled-components";
import { SearchOutlined, CloseCircleFilled } from "@ant-design/icons";

const SearchBar = (props) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
    if (props.setSearchInput) {
      props.setSearchInput(e.target.value);
    }
  };

  const handleDelete = () => {
    setInputValue("");
    if (props.setSearchInput) {
      props.setSearchInput("");
    }
  };
  return (
    <SearchBarWrapper style={props.style}>
      <SearchOutlined style={{ fontSize: "1.2rem", color: "#182457" }} />
      <Input
        type="text"
        placeholder="Search"
        value={inputValue}
        onChange={handleChange}
      />
      {inputValue && (
        <CloseCircleFilled
          style={{
            fontSize: "0.75rem",
            color: "rgba(0, 0, 0, 0.25)",
            marginLeft: "12px",
            position: "relative",
          }}
          onClick={handleDelete}
        />
      )}
    </SearchBarWrapper>
  );
};

export default SearchBar;

const SearchBarWrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #182457;
  height: 60px;
  margin-bottom: 10px;
  margin-top: 10px;
`;

const Input = styled.input`
  border: none;
  position: relative;
  width: 75%;
  height: 60%;
  margin-left: 10px;
  font-family: ArticleFont;
  font-size: 1.3rem;
  letter-spacing: 0.05em;
  line-height: 1.8;
  outline: none;
`;
