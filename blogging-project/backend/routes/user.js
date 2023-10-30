const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
} = require("../controllers/user.controller");
const { isAuth } = require("../middlewares/AuthMiddleware");
const app = express();

app.post("/register", registerUser);
app.post("/login", loginUser);
app.get("/get-all-users", isAuth, getAllUsers);

module.exports = app;
