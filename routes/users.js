const express = require("express");
const router = express.Router();

const controller = require("../controller/users");

router.get("/users", controller.getUsersData);
router.get("/usersIdAndStatus", controller.getUserID);
router.get("/gettasklist", controller.getTaskList);
router.get("/gettaskliststatus", controller.getTaskListStatus);

router.post("/adduser", controller.addUsersData);

router.put("/updateuser/:id", controller.updateUsersData);
router.put("/updatetask/:id", controller.updateTask);

router.patch("/modifytask/:id", controller.modifyUsersData);
router.patch("/modifyTodoTask/:id", controller.modifyTodoTask);

router.delete("/deleteUser/:id", controller.removeUsersData);

module.exports = router;
