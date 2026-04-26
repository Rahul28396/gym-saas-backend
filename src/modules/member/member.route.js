const express = require('express');
const router = express.Router();

const {
  getMembersController,
  createMemberController,
  getMemberByIdController,
  updateMemberController,
  deleteMemberController,
} = require("./member.controller");

router.get("/", getMembersController);

router.post("/", createMemberController);

router.get("/:id", getMemberByIdController);

router.put("/:id", updateMemberController);

router.delete("/:id", deleteMemberController);

module.exports = router