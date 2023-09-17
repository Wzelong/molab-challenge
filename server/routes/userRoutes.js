const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.post("/signup", UserController.signup);
router.get("/verify", UserController.verify);
router.post("/set-password", UserController.setPassword);
router.post("/reset-password", UserController.resetPassword);
router.post("/login", UserController.login);
router.post("/delete-account", UserController.deleteAccount);
router.get("/all-users", UserController.getAllUsers);
router.post("admin-manage", UserController.adminManage);

module.exports = router;
