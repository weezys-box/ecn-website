const express = require("express");
const app = express();
const path = require("path");
const { format } = require("date-fns");
// import { truncateHtmls } from "../utils";

// app.set("view engine", "ejs");

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "..", "public")));

// Middleware to serve static files from the 'node_modules' directory
app.use(
	"/node_modules",
	express.static(path.join(__dirname, "../node_modules"))
);
// server CSS static files

// app.use(express.static("public"));

// Use JSON parser for incoming requests
app.use(express.json());

// Routes
const indexRouter = require("./routes/index");
const projectsRouter = require("./routes/projects");
const reportsRouter = require("./routes/reports");
const newsRouter = require("./routes/news");

app.use("/", indexRouter);
app.use("/projects", projectsRouter);
app.use("/reports", reportsRouter);
app.use("/news", newsRouter);

console.log(path.join(__dirname, "..", "public"));

module.exports = app;
