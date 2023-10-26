const express = require("express");
require("dotenv").config();

//file imports
const db = require("./config/db");
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");

const app = express();
const PORT = process.env.PORT;

//middlewares
app.use(express.json());

//routes
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

app.listen(PORT, () => {
  console.log("Server running at port: ", PORT);
});
