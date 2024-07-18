const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsController");

router.get("/", reportsController.getReports);
// router.get("/:id", reportsController.getReportById);

module.exports = router;
