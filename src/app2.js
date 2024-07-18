const { exec } = require("child_process");
const express = require("express");
const { json } = require("express/lib/response");
const app = express();
const path = require("path");
const truncate = require("truncate-html");
const { format } = require("date-fns");
// import { truncateHtmls } from "../utils";

// db connection

const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
});

connection.connect((err) => {
	if (err) throw err;
	console.log("Connected to the database");
});

// set view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

// serve materialize static file from node module
app.use(
	"/materialize-css",
	express.static(path.join(__dirname, "node_modules/materialize-css/dist"))
);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "..", "public")));

// Middleware to serve static files from the 'node_modules' directory
app.use(
	"/node_modules",
	express.static(path.join(__dirname, "../node_modules"))
);
// server CSS static files

// app.use(express.static("public"));
app.use(express.json());

// Use JSON parser for incoming requests

// fake posts

const posts = [
	{ id: 1, name: "mohammed", age: 30 },
	{ id: 2, name: "ayodeji", age: 30 },
];

app.get("/", (req, res) => {
	connection.query("SELECT * FROM reports ", (err, results) => {
		if (err) throw err;

		connection.query(
			"SELECT * FROM news ORDER BY created_at DESC LIMIT 3 ",
			(err, news) => {
				if (err) throw err;

				const trimNews = news.map((trim) => {
					return {
						title: trim.title,
						content: truncate(trim.content, 100),
						date_created: trim.date_created,
						image_url: trim.image_url,
					};
				});

				res.render("index", { results, trimNews });
			}
		);
	});
});

app.get("/news", (req, res) => {
	connection.query(
		"SELECT * FROM news order by created_at DESC ",
		(err, results) => {
			if (err) throw err;
			console.log("mohammed");
			// console.log(results);
			const newsBlog = results.map((news) => {
				return {
					title: news.title,
					content: news.content,
					id: news.id,
					date_created: format(news.created_at, "MMMM dd, yyyy"),
				};
			});
			// console.log(newsBlog);
			res.render("news", { newsBlog });
		}
	);
});

app.get("/news/:id", (req, res) => {
	let id = req.params.id;
	id = parseInt(id);

	connection.query(`SELECT * FROM news where id = ${id} `, (err, result) => {
		if (err) throw err;
		console.log(result);
		let data = result[0];
		// results.forEach((el) => console.log(el));

		res.render("news-view", { data });
	});
});

app.get("/reports", (req, res) => {
	res.render("reports");
});

app.get("/downloads/:id", (req, res) => {
	let id = req.params.id;
	id = parseInt(id);

	connection.query(`SELECT * FROM reports where id = ${id} `, (err, result) => {
		if (err) throw err;
		console.log(result);
		let fileName = result[0].title + ".pdf";
		// results.forEach((el) => console.log(el));

		const file = path.join(__dirname, "..", "public", "reports", fileName);
		res.download(file, (err) => {
			if (err) {
				console.error("File download error:", err);
				res.status(500).send("Error downloading file.");
			}
		});
	});
});

console.log(path.join(__dirname, "..", "public"));

module.exports = app;
