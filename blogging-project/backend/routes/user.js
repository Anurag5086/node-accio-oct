const express = require("express");
const { registerUser, loginUser } = require("../controllers/user.controller");
const app = express();

app.post("/register", registerUser);
app.post("/login", loginUser);

module.exports = app;
