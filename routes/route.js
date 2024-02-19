const express = require("express");
const router = express();
const USER = require("../controller/user");

router.get("/", USER.getAllUsers);
router.get("/:id", USER.getUserById);
router.post("/create", USER.createUser);
router.put("/:id", USER.updateUser);
router.delete("/:id", USER.deleteUser);
module.exports = router;
