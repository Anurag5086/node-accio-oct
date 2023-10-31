const Joi = require("joi");
const Blog = require("../models/Blog");
const Follow = require("../models/Follow");

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
    blogData = await Blog.find({ userId, isDeleted: false })
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
    // await Blog.findByIdAndDelete(blogId);
    const blogObj = {
      isDeleted: true,
      deletionDateTime: Date.now(),
    };
    await Blog.findByIdAndUpdate(blogId, blogObj);

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

// PUT - Edit blog
const editBlog = async (req, res) => {
  const isValid = Joi.object({
    blogId: Joi.string().required(),
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

  const { blogId, title, textBody } = req.body;
  const userId = req.locals.userId;

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

  const creationDateTime = blogData.creationDateTime;
  const currentTime = Date.now();

  const diff = (currentTime - creationDateTime) / (1000 * 60);

  if (diff > 30) {
    return res.status(400).send({
      status: 400,
      message: "Not allowed to edit blogs after 30 minutes",
    });
  }

  const blogObj = {
    title,
    textBody,
  };

  try {
    await Blog.findByIdAndUpdate(blogId, blogObj);

    return res.status(200).send({
      status: 200,
      message: "Blog updated successfully",
    });
  } catch (err) {
    return res.status(400).send({
      status: 400,
      message: "Failed to update blog",
      data: err,
    });
  }
};

const getHomepageBlogs = async (req, res) => {
  const currentUserId = req.locals.userId;

  let followingList;
  try {
    followingList = await Follow.find({ currentUserId });
  } catch (err) {
    return res.status(400).send({
      status: 400,
      message: "Failed to fetch following users list",
      data: err,
    });
  }

  let followingUserIds = [];
  followingList.forEach((followObj) => {
    followingUserIds.push(followObj.followingUserId);
  });

  try {
    const homepageBlogs = await Blog.find({
      userId: { $in: followingUserIds },
      isDeleted: false,
    }).sort({ creationDateTime: -1 });

    res.status(200).send({
      status: 200,
      message: "Fetched homepage blogs successfully",
      data: homepageBlogs,
    });
  } catch (err) {
    return res.status(400).send({
      status: 400,
      message: "Failed to fetch homepage blogs",
      data: err,
    });
  }
};

module.exports = {
  createBlog,
  getUserBlogs,
  deleteBlog,
  editBlog,
  getHomepageBlogs,
};
