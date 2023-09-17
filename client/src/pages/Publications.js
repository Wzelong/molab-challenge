import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Drawer, Select, Upload, message } from "antd";
import SearchBar from "../components/SearchBar";
import { UploadOutlined } from "@ant-design/icons";
import { useUserContext } from "../contexts/UserContext";
import axios from "axios";

/** Testing function */
const renderItems = (count) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push(
      <Item key={i}>
        <ArticleTitle>
          Hate Speech Classifiers Learn Normative Social Stereotypes
        </ArticleTitle>
        <ArticleAuthors>
          Davani, A. M., Atari, M., Kennedy, B., & Dehghani, M. (2023). Hate
          Speech Classifiers Learn Normative Social Stereotypes. Transactions of
          the Association for Computational Linguistics.
        </ArticleAuthors>
        <Bib>bib</Bib>
      </Item>,
    );
  }
  return items;
};

const Publications = () => {
  const [open, setOpen] = useState(false);
  const [articles, setArticles] = useState([{}]);
  const [searchInput, setSearchInput] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState("");
  const [topic, setTopic] = useState("");
  const updateWindowDimensions = () => {
    if (window.innerWidth > 500) {
      setOpen(false);
    }
  };

  useEffect(() => {
    updateWindowDimensions();
    window.addEventListener("resize", updateWindowDimensions);
    return () => {
      window.removeEventListener("resize", updateWindowDimensions);
    };
  }, []);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const fetchArticles = async () => {
    try {
      const response = await axios.get(
        "http://mola-lab-challenge.com/articles",
      );
      if (response.data.status === "success") {
        setArticles(response.data.articles);
      }
    } catch (error) {
      console.error("An error occurred while fetching articles:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);
  return (
    <BodyWrapper>
      <Title>Publications</Title>
      <ContentWrapper>
        <FilterButton onClick={showDrawer}>Filter</FilterButton>
        <Filter
          setSearchInput={setSearchInput}
          setYear={setYear}
          setType={setType}
          setTopic={setTopic}
          fetchArticles={fetchArticles}
          searchInput={searchInput}
        />
        <Content>
          <Table>
            {(() => {
              const filteredArticles = articles.filter((article) => {
                if (
                  searchInput.length === 0 &&
                  year.length === 0 &&
                  type.length === 0 &&
                  topic.length === 0
                )
                  return true;
                const matchesSearchInput =
                  searchInput.length === 0 ||
                  article.title
                    .toLowerCase()
                    .includes(searchInput.toLowerCase()) ||
                  article.citation
                    .toLowerCase()
                    .includes(searchInput.toLowerCase());

                const matchesYear =
                  year.length === 0 || article.year.toString() === year;
                const matchesType =
                  type.length === 0 ||
                  article.type.toLowerCase() === type.toLowerCase();
                const matchesTopic =
                  topic.length === 0 ||
                  article.topic.toLowerCase() === topic.toLowerCase();

                // Return true only if the article matches all conditions
                return (
                  matchesSearchInput &&
                  matchesYear &&
                  matchesType &&
                  matchesTopic
                );
              });

              if (filteredArticles.length === 0) {
                return (
                  <div
                    style={{
                      fontFamily: "ArticleFont",
                      fontSize: "1.2rem",
                      margin: "10px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    No Result
                  </div>
                );
              }

              return filteredArticles.map((article, index) => (
                <Item key={index}>
                  <ArticleTitle>{article.title}</ArticleTitle>
                  <ArticleAuthors>{article.citation}</ArticleAuthors>
                  {article.bib && (
                    <Bib onClick={() => window.open(article.bib)}>bib</Bib>
                  )}
                </Item>
              ));
            })()}
          </Table>
        </Content>
        <Drawer
          placement={"left"}
          closable={true}
          onClose={onClose}
          open={open}
          width={"80vw"}
        >
          <Filter
            formobile={true}
            setSearchInput={setSearchInput}
            setYear={setYear}
            setType={setType}
            setTopic={setTopic}
            fetchArticles={fetchArticles}
            searchInput={searchInput}
          />
        </Drawer>
      </ContentWrapper>
    </BodyWrapper>
  );
};

export default Publications;

const BodyWrapper = styled.div`
  width: 92%;
  height: auto;
  margin-bottom: 50px;
`;

const Title = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  margin-top: 35px;
  border-bottom: 1px solid #182457;
  padding-bottom: 5px;
  font-size: calc(1.4vw + 1.2rem);
  font-family: MainFont;
  font-weight: 400;
  color: #182457;
  transition: all 0.3s ease-out;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
`;

const ContentWrapper = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  margin-top: 2.5vw;
  display: inline-flex;

  @media (max-width: 700px) {
    flex-direction: column;
  }
  @media (max-height: 640px) {
    flex-direction: column;
  }
`;

const Content = styled.div`
  position: relative;
  width: calc(100% - 280px);
  height: auto;
  left: 280px;

  @media (max-width: 700px) {
    width: 100%;
    left: 0;
    margin-top: 30px;
  }
  @media (max-height: 640px) {
    width: 100%;
    left: 0;
    margin-top: 30px;
  }
`;

const Table = styled.ul`
  position: relative;
  width: 100%;
  height: auto;
  margin: 0 auto;
  list-style-type: none;
`;

const Item = styled.li`
  position: relative;
  width: 75%;
  margin-top: 20px;
`;

const ArticleTitle = styled.div`
  position: relative;
  font-size: calc(0.53vw + 1rem);
  font-family: ArticleFont;
  letter-spacing: 0.03em;
  width: fit-content;
  color: #1b708f;
  transition: all 0.3s ease-out;
  &:hover {
    color: #c63201;
    cursor: pointer;
  }
`;

const ArticleAuthors = styled.div`
  position: relative;
  font-size: calc(0.27vw + 0.8rem);
  letter-spacing: 0.03em;
  font-family: ArticleFont;
  width: fit-content;
  color: #323232;
  transition: all 0.3s ease-out;
  line-height: 1.8;
  margin-top: 5px;
`;

const Bib = styled.div`
  position: relative;
  font-size: calc(0.3vw + 0.7rem);
  font-family: ArticleFont;
  letter-spacing: 0.03em;
  width: fit-content;
  color: #3db5c5;
  transition: all 0.3s ease-out;
  margin-top: 5px;
  &:hover {
    color: #c63201;
    cursor: pointer;
  }
`;

const FilterButton = styled.div`
  display: none;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 50px;
  height: auto;
  font-size: calc(0.5vw + 0.8rem);
  font-family: ArticleFont;
  letter-spacing: 0.03em;
  color: #1b708f;
  margin-top: 20px;
  border: 1px solid #1b708f;
  border-radius: 5px;
  padding: 5px;
  transition: all 0.25s ease-out;
  &:hover {
    background-color: #1b708f;
    color: #fff;
    cursor: pointer;
  }
  @media (max-width: 500px) {
    display: flex;
  }
`;

const Filter = (props) => {
  const { isAdmin } = useUserContext();
  const [year, setYear] = useState(null);
  const changeYear = (value) => {
    if (value) {
      props.setYear(value);
      setYear(`Year: ${value}`);
    } else {
      props.setYear("");
      setYear(null);
    }
  };

  const [type, setType] = useState(null);
  const changeType = (value) => {
    if (value) {
      props.setType(value);
      setType(`Type: ${value}`);
    } else {
      props.setType("");
      setType(null);
    }
  };

  const [topic, setTopic] = useState(null);
  const changeTopic = (value) => {
    if (value) {
      props.setTopic(value);
      setTopic(`Topic: ${value}`);
    } else {
      props.setTopic("");
      setTopic(null);
    }
  };
  const [reset, setReset] = useState(false);
  const handleReset = () => {
    setReset(true);
    props.setYear("");
    props.setType("");
    props.setTopic("");
    props.setSearchInput("");
    setYear(null);
    setType(null);
    setTopic(null);
    props.fetchArticles();
  };

  const handleUpload = (info) => {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      props.fetchArticles();
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <FilterWrapper formobile={props.formobile}>
      {(year || type || topic || props.searchInput) && (
        <ResetButton onClick={handleReset}>Reset</ResetButton>
      )}
      <CustomSelect
        placeholder="Year: all"
        style={{ width: "100%" }}
        value={year}
        onChange={changeYear}
        options={years.map((year) => ({ value: year, label: year }))}
        allowClear
        dropdownStyle={dropdownStyleSheet}
      />
      <CustomSelect
        placeholder="Type: all"
        style={{ width: "100%" }}
        value={type}
        onChange={changeType}
        options={types.map((type) => ({ value: type, label: type }))}
        allowClear
        dropdownStyle={dropdownStyleSheet}
      />
      <CustomSelect
        placeholder="Topic: all"
        style={{ width: "100%" }}
        value={topic}
        onChange={changeTopic}
        options={topics.map((topic) => ({ value: topic, label: topic }))}
        allowClear
        dropdownStyle={dropdownStyleSheet}
      />
      <SearchBar
        setSearchInput={props.setSearchInput}
        reset={reset}
        setReset={setReset}
      />
      {isAdmin && (
        <Upload {...UploadProps} onChange={handleUpload}>
          <UploadButton>
            <UploadOutlined
              style={{ fontSize: "1.1rem", marginRight: "5px" }}
            />
            Upload publications
          </UploadButton>
        </Upload>
      )}
    </FilterWrapper>
  );
};

const UploadProps = {
  name: "file",
  action: "http://mola-lab-challenge.com/upload",
  accept: ".bib",
  headers: {
    authorization: "authorization-text",
  },
  multiple: true,
  showUploadList: false,
};

const topics = ["AI", "Hate", "Language", "Modeling", "Morality"];

const years = [
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
  "2015",
  "2014",
  "2012",
  "2011",
  "2010",
  "2009",
  "2008",
  "2007",
  "2006",
];

const types = [
  "Book",
  "Book Chapter",
  "Journal Article",
  "Preprint",
  "Proceeding",
];

const dropdownStyleSheet = {
  boxShadow: "none",
  color: "#182457",
  fontFamily: "ArticleFont",
  fontSize: "1.5rem",
  letterSpacing: "0.05em",
  lineHeight: "1.8",
};

const FilterWrapper = styled.div`
  position: fixed;
  width: 280px;
  height: auto;
  margin-top: 20px;

  @media (max-width: 700px) {
    position: relative;
    width: 100%;
  }
  @media (max-width: 500px) {
    display: ${(props) => (props.formobile ? "block" : "none")};
  }
  @media (max-height: 640px) {
    position: relative;
    width: 100%;
  }
`;

const CustomSelect = styled(Select)`
  :where(.css-dev-only-do-not-override-18iikkb).ant-select:not(
      .ant-select-customize-input
    )
    .ant-select-selector {
    border: none;
    border-bottom: 1px solid #182457 !important;
    border-radius: 0 !important;
    font-family: ArticleFont;
    font-size: 1.3rem;
    letter-spacing: 0.05em;
    line-height: 1.8;
    -webkit-font-smoothing: antialiased;
    display: flex;
    align-items: center;
    height: 60px;
    margin-bottom: 5px;

    &:hover {
      border: none;
    }
  }
  :where(.css-18iikkb).ant-select:not(.ant-select-customize-input)
    .ant-select-selector {
    border: none;
    border-bottom: 1px solid #182457 !important;
    border-radius: 0 !important;
    font-family: ArticleFont;
    font-size: 1.3rem;
    letter-spacing: 0.05em;
    line-height: 1.8;
    -webkit-font-smoothing: antialiased;
    display: flex;
    align-items: center;
    height: 60px;
    margin-bottom: 10px;
    box-shadow: none;
    outline: none;

    &:hover {
      border: none;
    }
  }

  :where(.css-dev-only-do-not-override-18iikkb).ant-select:not(
      .ant-select-disabled
    ):not(.ant-select-customize-input):not(.ant-pagination-size-changer)
    .ant-select-selector {
    box-shadow: none !important;
    outline: none !important;
  }

  :where(.css-18iikkb).ant-select:not(.ant-select-disabled):not(
      .ant-select-customize-input
    ):not(.ant-pagination-size-changer)
    .ant-select-selector {
    box-shadow: none !important;
    outline: none !important;
  }

  .ant-select-arrow {
    color: #182457;
  }

  .ant-select-selection-placeholder {
    color: #182457;
    font-family: ArticleFont;
    font-size: 1.3rem;
    letter-spacing: 0.05em;
    line-height: 1.8;
  }
`;

const ResetButton = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  border: 1px solid #182457;
  border-radius: 10px;
  padding-left: 20px;
  padding-right: 20px;
  height: 40px;
  margin-bottom: 10px;
  font-family: ArticleFont;
  font-size: 1rem;
  letter-spacing: 0.05em;
  line-height: 1.8;
  transition: all 0.25s ease-out;
  &:hover {
    background-color: rgba(0, 0, 0);
    color: #fff;
    cursor: pointer;
  }
`;

const UploadButton = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #182457;
  border-radius: 10px;
  padding-left: 20px;
  padding-right: 20px;
  height: 60px;
  margin-top: 20px;
  font-family: ArticleFont;
  font-size: 1rem;
  letter-spacing: 0.05em;
  line-height: 1.8;
  transition: all 0.25s ease-out;
  &:hover {
    background-color: rgba(0, 0, 0);
    color: #fff;
    cursor: pointer;
  }
`;
