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

// Generate APA citation in HTML format
function generateApaCitationHTML(entry) {
  let authorsOrEditors = "";
  const entryTags = entry.entryTags;
  if (entryTags.author) {
    authorsOrEditors = entryTags.author;
  } else if (entryTags.editor) {
    const eds = entryTags.editor.length > 1 ? "(Eds.)" : "(Ed.)";
    authorsOrEditors = `${entryTags.editor} ${eds}`;
  }

  switch (entry.entryType.toLowerCase()) {
  case "article":
    return `${authorsOrEditors} (${entryTags.year}). <em>${entryTags.title}</em>. <em>${entryTags.journal}, ${entryTags.volume}</em>(${entryTags.number}), ${entryTags.pages}.`;
  case "book":
    return `${authorsOrEditors} (${entryTags.year}). <em>${entryTags.title}</em>. ${entryTags.publisher}.`;
  case "inproceedings":
  case "proceedings":
    return `${authorsOrEditors} (${entryTags.year}). ${entryTags.title}. In <em>${entryTags.booktitle ? entryTags.booktitle : entryTags.title}</em>. ${entryTags.address ? entryTags.address + ". " : ""}${entryTags.publisher}.`;
  default:
    return "Unknown entry type.";
  }
}

exports.uploadArticles = async (req, res) => {
  const fileBuffer = req.file.buffer.toString();
  const parsed = bibtexParser.toJSON(fileBuffer);
  const articles = [];

  for (const key in parsed) {
    // eslint-disable-next-line no-prototype-builtins
    if (parsed.hasOwnProperty(key)) {
      const entry = parsed[key];
      const year = parseInt(entry.entryTags.year, 10) || "";
      const title = entry.entryTags.title || "";
      const citation = generateApaCitationHTML(entry);

      let type = "";
      // Determine the type based on available fields
      if (entry.entryType === "inproceedings") {
        type = "Proceeding";
      } else if (entry.entryTags.journal) {
        if (entry.entryTags.journal.toLowerCase().includes("preprint")) {
          type = "Preprint";
        } else {
          type = "Journal Article";
        }
      } else if (entry.entryType === "article") {
        type = "Preprint";
      } else if (entry.entryTags.publisher && entry.entryTags.booktitle) {
        type = "Book Chapter";
      } else if (entry.entryTags.publisher && !entry.entryTags.booktitle) {
        type = "Book";
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
