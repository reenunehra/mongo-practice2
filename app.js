const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/users");
const userTodoData = require('./routes/todoTask')

const app = express();
const cors = require('cors');


const port = 5000;

mongoose.connect("mongodb://localhost:27017/myDatabase", {
  useNewUrlParser: true,
});
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/v2', userRoutes);
app.use('/api/v2', userTodoData);


app.listen(port, (req, res) => {
  console.log(`server running on port ${port}`);
});
