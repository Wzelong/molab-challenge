import { createGlobalStyle } from "styled-components";
import MainFont from "./Main.woff2";
import MainFontBold from "./MainBold.otf";
import ArticleFont from "./Article.ttf";

export default createGlobalStyle`
    @font-face {
        font-family: "MainFont";
        src: local("MainFont"), url(${MainFont}) format("woff2");
        font-weight: 400;
        font-style: normal;
    }
    @font-face {
        font-family: "MainFontBold";
        src: local("MainFontBold"), url(${MainFontBold}) format('opentype');
        font-weight: bold;
        font-style: normal;
    }
    @font-face {
        font-family: "ArticleFont";
        src: local("ArticleFont"), url(${ArticleFont}) format('truetype');
        font-weight: 400;
        font-style: normal;
    }
`;
