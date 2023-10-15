const express = require("express");
const fs = require("fs");

const PORT = 8001;

const app = express();

app.use(express.json());

// GET - Get todo based on ID
app.get("/todo/:id", (req, res) => {
  try {
    const todoId = req.params.id;

    const fileData = JSON.parse(fs.readFileSync("./database.json").toString());

    let todoWithId = fileData.todos.filter((todo) => todo.id == todoId);

    res.status(200).send({
      status: 200,
      message: "Todo with id fetched successfully!",
      data: todoWithId[0],
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to fetch a todo!",
      data: err,
    });
  }
});

// GET - Get all todos
app.get("/todos", (req, res) => {
  try {
    const fileData = JSON.parse(fs.readFileSync("./database.json").toString());

    res.status(200).send({
      status: 200,
      message: "Fetched all todos successfully!",
      data: fileData.todos,
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to fetch all todos!",
      data: err,
    });
  }
});

// POST - Create a todo
app.post("/todo", (req, res) => {
  try {
    const newTodo = {
      id: req.body.id,
      title: req.body.title,
      date: new Date(),
      isCompleted: req.body.isCompleted,
    };

    // Converting the file data from String Buffer -> String -> JSON
    let fileData = JSON.parse(fs.readFileSync("./database.json").toString());

    fileData.todos.push(newTodo);

    fs.writeFileSync("./database.json", JSON.stringify(fileData));

    res.status(201).send({
      status: 201,
      message: "Todo is successfully created!",
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to create a todo!",
      data: err,
    });
  }
});

// PUT - Update a todo
app.put("/todo", (req, res) => {
  try {
    const todoId = req.body.id;
    const updatedBody = req.body;

    let fileData = JSON.parse(fs.readFileSync("./database.json").toString());

    fileData.todos.forEach((todo, idx) => {
      if (todo.id == todoId) {
        fileData.todos[idx].title = updatedBody.title;
        fileData.todos[idx].isCompleted = updatedBody.isCompleted;
      }
    });

    fs.writeFileSync("./database.json", JSON.stringify(fileData));

    res.status(200).send({
      status: 200,
      message: "Todo is successfully updated!",
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to update a todo!",
      data: err,
    });
  }
});

// PATCH - Update a todo
app.patch("/todo", (req, res) => {
  try {
    const todoId = req.body.id;
    const updatedBody = req.body;

    let fileData = JSON.parse(fs.readFileSync("./database.json").toString());

    fileData.todos.forEach((todo, idx) => {
      if (todo.id == todoId) {
        if (req.body.title) {
          fileData.todos[idx].title = updatedBody.title;
        }

        if (req.body.isCompleted === true || req.body.isCompleted === false) {
          fileData.todos[idx].isCompleted = updatedBody.isCompleted;
        }
      }
    });

    fs.writeFileSync("./database.json", JSON.stringify(fileData));

    res.status(200).send({
      status: 200,
      message: "Todo is successfully updated!",
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to update a todo!",
    });
  }
});

// DELETE - Delete a todo based on ID
app.delete("/todo/:id", (req, res) => {
  try {
    const todoId = Number(req.params.id);

    let fileData = JSON.parse(fs.readFileSync("./database.json").toString());

    let listOfTodosAfterDeletion = fileData.todos.filter(
      (todo) => todo.id != todoId
    );

    fileData.todos = listOfTodosAfterDeletion;

    fs.writeFileSync("./database.json", JSON.stringify(fileData));
    res.status(200).send({
      status: 200,
      message: "Todo is deleted successfully!",
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to delete a todo",
      data: err,
    });
  }
});

app.listen(PORT, () => {
  console.log("Server running at port:", PORT);
});
