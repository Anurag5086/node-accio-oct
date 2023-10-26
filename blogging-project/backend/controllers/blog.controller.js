const Joi = require("joi");
const Blog = require("../models/Blog");

const createBlog = async (req, res) => {
  const isValid = Joi.object({
    title: Joi.string().required(),
    textBody: Joi.string().min(30).max(1000).required(),
  }).validate(req.body);

  if (isValid.error) {
    return res.status(400).send({
      status: 400,
      message: "Invalid Input",
      data: isValid.error,
    });
  }

  const { title, textBody } = req.body;

  const blogObj = new Blog({
    title,
    textBody,
    creationDateTime: new Date(),
    username: req.locals.username,
    userId: req.locals.userId,
  });

  try {
    await blogObj.save();

    res.status(201).send({
      status: 201,
      message: "Blog created successfully",
    });
  } catch (err) {
    return res.status(400).send({
      status: 400,
      message: "Failed to create a blog",
      data: err,
    });
  }
};

const getUserBlogs = async (req, res) => {
  const userId = req.locals.userId;
  const page = Number(req.query.page) || 1;
  const LIMIT = 10;

  let blogData;

  try {
    blogData = await Blog.find({ userId })
      .sort({ creationDateTime: -1 })
      .skip((page - 1) * LIMIT)
      .limit(LIMIT);
  } catch (err) {
    return res.status(400).send({
      status: 400,
      message: "Failed to fetch user blogs",
      data: err,
    });
  }

  res.status(200).send({
    status: 200,
    message: "Fetched user blogs successfully",
    data: blogData,
  });
};

const deleteBlog = async (req, res) => {
  const userId = req.locals.userId;
  const blogId = req.params.blogid;

  let blogData;

  try {
    blogData = await Blog.findById(blogId);

    if (!blogData) {
      return res.status(404).send({
        status: 404,
        message: "Blog dosen't exist!",
      });
    }

    if (blogData.userId != userId) {
      return res.status(401).send({
        status: 401,
        message:
          "Unauthorized to delete the blog. You are not the owner of the blog.",
      });
    }
  } catch (err) {
    return res.status(400).send({
      status: 400,
      message: "Failed to fetch blog",
      data: err,
    });
  }

  try {
    await Blog.findByIdAndDelete(blogId);

    return res.status(200).send({
      status: 200,
      message: "Blog Deleted Successfully",
    });
  } catch (err) {
    return res.status(400).send({
      status: 400,
      message: "Failed to delete blog",
      data: err,
    });
  }
};

module.exports = { createBlog, getUserBlogs, deleteBlog };
