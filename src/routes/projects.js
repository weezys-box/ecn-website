const express = require("express");
const router = express.Router();
const projectsController = require("../controllers/projectsController");

router.get("/", projectsController.getProjects);
router.get("/:id", projectsController.getProjectById);

module.exports = router;
