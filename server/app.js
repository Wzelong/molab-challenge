const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const MONGO_URI = "mongodb+srv://zelongw:WZLwy2023@cluster0.zwnrvyv.mongodb.net/?retryWrites=true&w=majority";

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

const userRoutes = require("./routes/userRoutes");
const articleRoutes = require("./routes/articleRoutes");

app.use("/api/user", userRoutes);
app.use("/api/article", articleRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
