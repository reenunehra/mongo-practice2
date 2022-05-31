const express = require("express");
const router = express.Router();

const controller = require("../controller/todoTask");


router.post("/addtask/:id", controller.addToDoTask);


module.exports = router;
