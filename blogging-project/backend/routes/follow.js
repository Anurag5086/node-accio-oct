const express = require("express");
const { isAuth } = require("../middlewares/AuthMiddleware");
const {
  unfollowUser,
  followUser,
} = require("../controllers/follow.controller");
const app = express();

app.post("/follow-user", isAuth, followUser);
app.post("/unfollow-user", isAuth, unfollowUser);

module.exports = app;
