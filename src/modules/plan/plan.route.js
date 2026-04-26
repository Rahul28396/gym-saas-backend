const express = require('express');
const router = express.Router();

const {
  getPlansController,
  createPlanController,
  getPlanController,
  updatePlanController,
  deletePlanController,
} = require("./plan.controller");

router.get("/", getPlansController);

router.post("/", createPlanController);

router.get("/:id", getPlanController);

router.put("/:id", updatePlanController);

router.delete("/:id", deletePlanController);

module.exports = router