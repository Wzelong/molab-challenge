const express = require("express");
const router = express.Router();
const ArticleController = require("../controllers/ArticleController");

router.get("/get-articles", ArticleController.getArticles);
router.post("/upload", ArticleController.uploadArticles);