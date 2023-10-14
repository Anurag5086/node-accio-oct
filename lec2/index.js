const express = require("express");
const app = express();

app.use(express.json());

app.post("/add", (req, res) => {
  const num1 = req.body.num1;
  const num2 = req.body.num2;

  const sum = num1 + num2;

  res.status(200).send({ sum });
});

app.get("/subtract/:num1/:num2", (req, res) => {
  const num1 = Number(req.params.num1);
  const num2 = Number(req.params.num2);

  const diff = num1 - num2;

  res.status(200).send({ diff });
});

app.get("/multiply", (req, res) => {
  const num1 = Number(req.query.num1);
  const num2 = Number(req.query.num2);

  const prod = num1 * num2;

  res.status(200).send({ prod });
});

app.post("/divide/:num1", (req, res) => {
  const num1 = Number(req.params.num1);
  const num2 = req.body.num2;

  if (num2 === 0) {
    return res.status(400).send({ message: "Denominator cannot be 0" });
  }

  const quotient = num1 / num2;

  res.status(200).send({ quotient });
});

app.listen(8001, () => {
  console.log("Server running at port:", 8001);
});
