const express = require("express");
const router = express.Router();

const controller = require("../controller/users");

// router.get("/users", controller.getUsersData);
router.post("/users", controller.addUsersData);
// router.put("/users", controller.updateUsersData);
// router.patch("/users", controller.modifyUsersData);
// router.delete("/users", controller.removeUsersData);

module.exports = router;
