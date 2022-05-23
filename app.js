const express = require("express");
const mongoose = require("mongoose");

const userTodoRoutes = require("./routes/users");
const app = express();
const port = 5000;

mongoose.connect("mongodb://localhost:27017/myDatabase", {
  useNewUrlParser: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/v2', userTodoRoutes );

app.listen(port, (req, res) => {
  console.log(`server running on port ${port}`);
});
