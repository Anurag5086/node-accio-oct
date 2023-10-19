const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Todo = require("./models/TodoSchema");
const { LoggerMiddleware } = require("./middlewares/LoggerMiddleware");
const User = require("./models/UserSchema");
const { isAuth } = require("./middlewares/AuthMiddleware");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(LoggerMiddleware);

const PORT = process.env.PORT;
const SALT_ROUNDS = 12;

// POST - Register User
app.post("/register", async (req, res) => {
  const userBody = req.body;

  const hashedPassword = await bcrypt.hash(userBody.password, SALT_ROUNDS);

  const userObj = new User({
    name: userBody.name,
    username: userBody.username,
    password: hashedPassword,
    email: userBody.email,
  });

  try {
    await userObj.save();

    res.status(201).send({
      status: 201,
      message: "User registered successfully!",
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to register user!",
      data: err,
    });
  }
});

// POST - Login User
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  let userData;

  try {
    userData = await User.findOne({ username });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "User fetching failed!",
      data: err,
    });
  }

  let isPasswordSame = await bcrypt.compare(password, userData.password);

  if (!isPasswordSame) {
    return res.status(400).send({
      status: 400,
      message: "Password is incorrect!",
    });
  } else {
    let payload = {
      name: userData.name,
      username: userData.username,
      email: userData.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

    res.status(200).send({
      status: 200,
      message: "Successfully logged in!",
      data: token,
    });
  }
});

// POST - Create a Todo
app.post("/todo", isAuth, async (req, res) => {
  const { title, isCompleted, username } = req.body;

  if (title.length == 0 || isCompleted == null || username.length == 0) {
    return res.status(400).send({
      status: 400,
      message: "Please enter the values in correct format!",
    });
  }

  try {
    const todoObj = new Todo({
      title,
      isCompleted,
      username,
      dateTime: new Date(),
    });

    await todoObj.save();

    res.status(201).send({
      status: 201,
      message: "Todo created successfully!",
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Todo creation failed!",
      data: err,
    });
  }
});

// GET - Get all todos for a username
// /todos/anurag23
app.get("/todos/:username", isAuth, async (req, res) => {
  const username = req.params.username;
  const page = Number(req.query.page) || 1;
  const LIMIT = 5;

  try {
    const todoList = await Todo.find({ username })
      .sort({ dateTime: 1 })
      .skip((page - 1) * LIMIT)
      .limit(LIMIT);

    res.status(200).send({
      status: 200,
      message: "Fetched all todos for a username successfully!",
      data: todoList,
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to fetch all todos for a username!",
      data: err,
    });
  }
});

// GET - Get a single Todo
app.get("/todo/:id", isAuth, (req, res) => {
  const todoId = req.params.id;

  Todo.findById(todoId)
    .then((todoData) => {
      res.status(200).send({
        status: 200,
        message: "Fetched a todo successfully!",
        data: todoData,
      });
    })
    .catch((err) => {
      res.status(400).send({
        status: 400,
        message: "Failed to fetch a single todo using id!",
        data: err,
      });
    });
});

// DELETE - Delete a todo based on id
app.delete("/todo/:id", isAuth, async (req, res) => {
  const todoId = req.params.id;

  try {
    await Todo.findByIdAndDelete(todoId);

    res.status(200).send({
      status: 200,
      message: "Deleted a todo successfully!",
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to delete a todo based on id!",
      data: err,
    });
  }
});

// PATCH - Update a todo
app.patch("/todo", isAuth, async (req, res) => {
  const { id, title, isCompleted } = req.body;

  try {
    await Todo.findByIdAndUpdate(id, { title, isCompleted });

    res.status(200).send({
      status: 200,
      message: "Updated a todo successfully!",
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to update a todo based on id!",
      data: err,
    });
  }
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB is connected!"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log("Server is running at:", PORT);
});
