const express = require("express");
const {
  createBlog,
  getUserBlogs,
  deleteBlog,
} = require("../controllers/blog.controller");
const { isAuth } = require("../middlewares/AuthMiddleware");
const app = express();

app.post("/create-blog", isAuth, createBlog);
app.get("/get-user-blogs", isAuth, getUserBlogs);
app.delete("/delete-blog/:blogid", isAuth, deleteBlog);

module.exports = app;
