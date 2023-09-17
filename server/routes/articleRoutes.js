const express = require("express");
const router = express.Router();
const ArticleController = require("../controllers/ArticleController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/get-articles", ArticleController.getArticles);
router.post("/upload", upload.single("file"), ArticleController.uploadArticles);

module.exports = router;
