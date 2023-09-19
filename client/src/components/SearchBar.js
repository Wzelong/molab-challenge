import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SearchOutlined, CloseCircleFilled } from "@ant-design/icons";

/** A search bar component to handle search logic.
 * @param {Object} props.reset - Parent component's state to reset the search bar.
 * @param {Function} props.setReset - Parent component's setState function to reset the search bar.
 * @param {Object} props.style - Style of the search bar.
 * @param {Function} props.setSearchInput - Parent component's setState function to set the search input (Used when user type-in).
 */
const SearchBar = (props) => {
  const [inputValue, setInputValue] = useState("");

  // Reset the search bar when the parent component's reset state is true
  useEffect(() => {
    if (props.reset) {
      setInputValue("");
      props.setReset(false);
    }
  }, [props.reset]);

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
            right: "12px",
            position: "absolute",
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
`;

const Input = styled.input`
  border: none;
  position: relative;
  width: 75%;
  height: 60%;
  margin-left: 10px;
  font-family: ArticleFont;
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  line-height: 1.8;
  outline: none;
`;
