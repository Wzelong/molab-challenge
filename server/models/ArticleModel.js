const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  title: String,
  citation: String,
  bib: String,
  year: Number,
  type: String,
  topic: String,
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;