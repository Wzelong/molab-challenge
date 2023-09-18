const Article = require("../models/ArticleModel");
const bibtexParser = require("@orcid/bibtex-parse-js");

exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find({});
    return res.status(200).json({ status: "success", articles });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "An error occurred while fetching articles" });
  }
};

exports.uploadArticles = async (req, res) => {
  const fileBuffer = req.file.buffer.toString();
  const parsed = bibtexParser.toJSON(fileBuffer);
  const articles = [];

  for (const key in parsed) {
    // eslint-disable-next-line no-prototype-builtins
    if (parsed.hasOwnProperty(key)) {
      const entry = parsed[key];
      const title = entry.entryTags.title || "";
      const year = parseInt(entry.entryTags.year, 10) || "";
      const authors = entry.entryTags.author || "";
      // Create citation: "author. (year). title. [additional info]"
      let citation = `${authors}. (${year}). ${title}`;

      let type = "";
      // Determine the type based on available fields
      if (entry.type === "inproceedings") {
        type = "Proceeding";
      } else if (entry.entryTags.journal) {
        if (entry.entryTags.journal.toLowerCase().includes("preprint")) {
          type = "Preprint";
        } else {
          type = "Journal Article";
        }
      } else if (entry.entryTags.publisher && entry.entryTags.booktitle) {
        type = "Book Chapter";
      } else if (entry.entryTags.publisher && !entry.entryTags.booktitle) {
        type = "Book";
      }
      // Append additional fields if they exist.
      let additionalInfo = Object.keys(entry.entryTags)
        .filter(field => !["title", "year", "author"].includes(field))
        .map(field => `${entry.entryTags[field]}`)
        .join(". ");

      if(additionalInfo) {
        citation += ` ${additionalInfo}.`;
      }

      const article = {
        title,
        citation,
        year,
        type,
      };

      articles.push(article);
    }
  }

  try {
    await Article.insertMany(articles);
    return res.status(200).json({ status: "success", message: "Articles uploaded successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "An error occurred while uploading articles" });
  }
};
