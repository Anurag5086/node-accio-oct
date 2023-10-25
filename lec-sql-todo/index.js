const express = require("express");
const mysql = require("mysql");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
});

db.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log("DB Connected!");
  }
});

// POST - Create a todo
app.post("/todo", (req, res) => {
  const { title, isCompleted, username } = req.body;

  const date = new Date();
  const finalDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  let query = `INSERT INTO todos(title, is_completed, username, date) values('${title}', ${isCompleted}, '${username}', '${finalDate}')`;
  db.query(query, (err, result) => {
    if (err) throw err;
    res.status(201).send("Todo created successfully!");
  });
});

// GET - Get all todos for a username
app.get("/todos/:username", (req, res) => {
  const username = req.params.username;

  let query = `select * from todos where username='${username}'`;
  db.query(query, (err, result) => {
    if (err) throw err;

    res.status(200).send({
      status: 200,
      message: "Todos fetched succesfully for the username!",
      data: result,
    });
  });
});

// DELETE - Delete a todo
app.delete("/todo/:id", (req, res) => {
  const todoId = req.params.id;

  let query = `delete from todos where id=${todoId}`;

  db.query(query, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.status(200).send("Todo deleted successfully");
  });
});

// PUT - Update a todo
app.put("/todo", (req, res) => {
  const { id, title, isCompleted } = req.body;

  let query = `update todos set title='${title}', is_completed=${isCompleted} where id=${id}`;

  db.query(query, (err, result) => {
    if (err) throw err;
    res.status(200).send("Todo updated succesfully");
  });
});

app.listen(PORT, () => {
  console.log("Server is running at port:", PORT);
});
