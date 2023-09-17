const User = require("../models/UserModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET="e4d902c0c8a48a0f08a3bea0e40a964b3852758303ad64d1fbb2cb63e6123456";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "molapublications@gmail.com",
    pass: "jamwzgbehnazrrve",
  },
});

exports.signup = async (req, res) => {
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

  const verificationLink = `http://mola-lab-challenge.com/verify?token=${token}`;

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
};

exports.verify = async (req, res) => {
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
};

exports.setPassword = async (req, res) => {
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
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ status: "error", message: "Invalid email or password" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ status: "error", message: "Invalid email or password" });
  }

  res.status(200).json({ status: "success", isAdmin: user.admin });
};

exports.deleteAccount = async (req, res) => {
  const { user } = req.body;

  const userObj = await User.findOne({ email: user });
  if (!userObj) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }

  await User.findOneAndDelete({ email: user });

  return res.status(200).json({ status: "success" });
};

exports.resetPassword = async (req, res) => {
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
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "email admin");  // Only fetch email and admin fields
    return res.status(200).json({ status: "success", users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "An error occurred while fetching users" });
  }
};

exports.adminManage = async (req, res) => {
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
};
