const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");
const bibtexParser = require("@orcid/bibtex-parse-js");
const multer = require("multer");
const e = require("express");
const path = require("path");
const MONGO_URI = "mongodb+srv://zelongw:WZLwy2023@cluster0.zwnrvyv.mongodb.net/?retryWrites=true&w=majority";
const JWT_SECRET="e4d902c0c8a48a0f08a3bea0e40a964b3852758303ad64d1fbb2cb63e6123456";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.log(err);
  }
};
connectDB();

const app = express();

app.use(express.static(path.join(__dirname, "/build")));
app.use(cors());
app.use(bodyParser.json());

const UserSchema = new mongoose.Schema({
  email: String,
  password: String ,
  verified: Boolean,
  admin: Boolean,
});

const User = mongoose.model("User", UserSchema);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "molapublications@gmail.com",
    pass: "jamwzgbehnazrrve",
  },
});

app.post("/signup", async (req, res) => {
  const { email } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser.verified) {
    return res.status(400).send("Email already registered and verified");
  }

  let user;
  if (existingUser) {
    user = existingUser;
  } else {
    user = new User({ email, verified: false });
    await user.save();
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: "1h"
  });

  const verificationLink = `http://localhost:3000/verify?token=${token}`;

  const mailOptions = {
    from: "molapublications@gmail.com",
    to: email,
    subject: "Verify your email",
    text: `Click this link to verify your email: ${verificationLink}. The link will expire in 1 hour.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send("Error sending email");
    } else {
      res.status(200).send("Verification email sent");
    }
  });
});


app.get("/verify", async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ status: "error", message: "Invalid request, no token provided." });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found." });
    }
    if (user.verified) {
      return res.status(400).json({ status: "error", message: "User already verified." });
    }
    return res.status(200).json({ status: "success", message: "Valid token" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Invalid or expired token" });
  }
});

app.post("/set-password", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ status: "error", message: "Missing required fields" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.userId) {
      return res.status(400).json({ status: "error", message: "Invalid token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      { _id: decoded.userId }, 
      { 
        password: hashedPassword,
        verified: true,
        admin: false,
      }
    );

    return res.status(200).json({ status: "success", message: "Password set successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "error", message: "An error occurred" });
  }
});

app.post("/reset-password", async (req, res) => {
  const { user, newPassword } = req.body;
  try {
    const userObj = await User.findOne({ email: user });
    if (!userObj) {
      return res.status(401).json({ status: "error", message: "Invalid email or password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      {email: user}, 
      { 
        password: hashedPassword,
      }
    );

    return res.status(200).json({ status: "success", message: "Password set successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "error", message: "An error occurred" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ status: "error", message: "Invalid email or password" });
  }

  // Compare the password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ status: "error", message: "Invalid email or password" });
  }

  res.status(200).json({ status: "success", isAdmin: user.admin });
});

app.post("/delete-account", async (req, res) => {
  const { user } = req.body;

  const userObj = await User.findOne({ email: user });
  if (!userObj) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }

  await User.findOneAndDelete({ email: user });

  return res.status(200).json({ status: "success" });
});

app.get("/all-users", async (req, res) => {
  try {
    const users = await User.find({}, "email admin");  // Only fetch email and admin fields
    return res.status(200).json({ status: "success", users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "An error occurred while fetching users" });
  }
});

app.post("/admin-manage", async (req, res) => {
  const { email } = req.body;
  try {
    const userObj = await User.findOne({ email: email });
    if (!userObj) {
      return res.status(401).json({ status: "error", message: "Invalid email or password" });
    }

    await User.findOneAndUpdate(
      { email: email }, 
      { 
        admin: !userObj.admin,
      }
    );

    return res.status(200).json({ status: "success", message: "Password set successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "error", message: "An error occurred" });
  }
});

const ArticleSchema = new mongoose.Schema({
  title: String,
  citation: String,
  bib: String,
  year: Number,
  type: String,
  topic: String,
});

const Article = mongoose.model("Article", ArticleSchema);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find({});
    return res.status(200).json({ status: "success", articles });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "An error occurred while fetching articles" });
  }
});

app.post("/upload", upload.single("file"), async (req, res) => {
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
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
