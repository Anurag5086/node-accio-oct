// ES5
const express = require("express");

// // ES6
// import express from "express";

const app = express();

app.get("/hello-world", (req, res) => {
  res.send("Hello from other side");
});

app.listen(8000, () => {
  console.log("Server running at port:", 8000);
});
