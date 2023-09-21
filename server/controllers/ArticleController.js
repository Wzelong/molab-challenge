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
  if (entry.author) {
    authorsOrEditors = entry.author.join(", ");
  } else if (entry.editor) {
    const eds = entry.editor.length > 1 ? "(Eds.)" : "(Ed.)";
    authorsOrEditors = `${entry.editor.join(", ")} ${eds}`;
  }

  switch (entry.entryType.toLowerCase()) {
  case "article":
    return `${authorsOrEditors} (${entry.year}). <em>${entry.title}</em>. <em>${entry.journal}, ${entry.volume}</em>(${entry.number}), ${entry.pages}.`;
  case "book":
    return `${authorsOrEditors} (${entry.year}). <em>${entry.title}</em>. ${entry.publisher}.`;
  case "inproceedings":
  case "proceedings":
    return `${authorsOrEditors} (${entry.year}). ${entry.title}. In <em>${entry.booktitle ? entry.booktitle : entry.title}</em>. ${entry.address ? entry.address + ". " : ""}${entry.publisher}. ${entry.url ? `<a href="${entry.url}">${entry.url}</a>` : ""}`;
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
