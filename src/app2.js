const { exec } = require("child_process");
const express = require("express");
const { json } = require("express/lib/response");
const app = express();
const path = require("path");
const truncate = require("truncate-html");
const { format } = require("date-fns");
const nodemailer = require("nodemailer");
// import { truncateHtmls } from "../utils";

// utility functions

function formatText(text) {
	// Fix any encoding issues (optional but recommended)
	text = text.replace(/\?/g, "'");

	// Split text into paragraphs using double newlines
	let paragraphs = text.split(/\n\s*\n/).map((para) => {
		// Replace single newlines inside paragraphs with <p> but only when necessary
		para = para.replace(/(\w)\n(\w)/g, "$1 $2"); // Convert improper line breaks to spaces
		para = para.replace(/([.!?])\s*\n/g, "$1</p><p>"); // Replace line breaks after punctuation with paragraph tags

		// Ensure each paragraph is wrapped in <p> tags
		return `<p>${para}</p>`;
	});

	// Join the paragraphs back together
	return paragraphs.join("");
}

// db connection

const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const connection = mysql.createConnection({
	// host: process.env.DB_HOST,
	// user: process.env.DB_USER,
	// password: process.env.DB_PASS,
	// database: process.env.DB_NAME,
	// MY RENDER DETAILS STARTS FROM HERE...
	host: "autorack.proxy.rlwy.net",
	user: "root",
	password: "zZjnkqRiXnXFANbamWrwojaZjcGDhlOl", // replace with the actual password
	database: "railway",
	port: 19250,
	connectTimeout: 10000, // Adjust timeout if necessary
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

//using postgres here - willchange my database schema from mysql to postgresql

// app.get('/test', async (req, res) => {
// 	try {
// 	  const result = await pool.query('SELECT * FROM mytable');
// 	  res.json(result.rows);
// 	} catch (err) {
// 	  console.error(err);
// 	  res.status(500).send('Error connecting to database');
// 	}
//   });

app.get("/", (req, res) => {
	connection.query("SELECT * FROM reports ", (err, results) => {
		if (err) throw err;

		connection.query(
			"SELECT * FROM news ORDER BY published_at DESC LIMIT 3 ",
			(err, news) => {
				if (err) throw err;

				const trimNews = news.map((trim) => {
					let trimmed_news = trim.title.trim();
					let news_title = trimmed_news
						.replace(/-/g, "_") // Replace hyphens with underscores
						.replace(/,/g, "_") // Replace commas with double underscores
						.replace(/'/g, "_") // Replace apostrophes with underscores
						.replace(/[^\w\s]/g, "") // Remove other special characters
						.replace(/\s+/g, "_");
					return {
						title: trim.title,
						content: truncate(trim.content, 100),
						published_at: trim.published_at,
						image_1: "../scraped_news_images/" + news_title + "/image_1.jpg",
						image_2: "../scraped_news_images/" + news_title + "/image_2.jpg",
						image_3: "/scraped_news_images/" + news_title + "/image_3.jpg",
						id: trim.id,
					};
				});

				res.render("index", { results, trimNews });
			}
		);
	});
});

app.get("/news", (req, res) => {
	connection.query(
		"SELECT * FROM news order by published_at DESC ",
		(err, results) => {
			if (err) throw err;
			console.log("mohammed");
			// console.log(results);
			const newsBlog = results.map((news) => {
				return {
					title: news.title,
					content: truncate(news.content, 500),
					id: news.id,
					date_created: format(news.published_at, "MMMM dd, yyyy"),
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
		let caption_1 = result[0].caption_1;
		let caption_2 = result[0].caption_2;
		let caption_3 = result[0].caption_3;
		let caption_4 = result[0].caption_4;
		let caption_5 = result[0].caption_5;
		let caption_6 = result[0].caption_6;
		let captions = {
			caption_1,
			caption_2,
			caption_3,
			caption_4,
			caption_5,
			caption_6,
		};
		let news_data = result[0].content.slice(0, -167);
		console.log(news_data);
		let dir_title = data.title;
		let formattedTitle = dir_title
			.replace(/[^a-zA-Z0-9_]+/g, "_")
			.replace(/_+/g, "_"); // Collapse multiple underscores into a single "_";

		const formatDate = format(result[0].published_at, "MMMM dd, yyyy");
		const img1_exist = function img1() {
			if (result[0].image_1) {
				return (
					"../scraped_news_images/" +
					result[0].image_1.slice(19, -11) +
					"/image1.jpg"
				);
			} else return null;
		};

		const img2_exist = function img1() {
			if (result[0].image_2) {
				return (
					"../scraped_news_images/" +
					result[0].image_1.slice(19, -11) +
					"/image1.jpg"
				);
			} else return null;
		};

		const img3_exist = function img1() {
			if (result[0].image_3) {
				return (
					"../scraped_news_images/" +
					result[0].image_1.slice(19, -11) +
					"/image1.jpg"
				);
			} else return null;
		};
		const images_data = {
			img1: img1_exist(),
			img2: img2_exist(),
			img3: img3_exist(),
		};

		// results.forEach((el) => console.log(el));

		// let formated_news = news_data.split("\n\n").map(line => `<p>${line}</p>`).join("");

		let formated_news = formatText(news_data);
		res.render("news-view", {
			news_data,
			data,
			images_data,
			formatDate,
			formattedTitle,
			formated_news,
			captions,
		});
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

app.get("/paper-downloads/:id", (req, res) => {
	let id = req.params.id;
	id = parseInt(id);

	connection.query(`SELECT * FROM papers where id = ${id} `, (err, result) => {
		if (err) throw err;
		console.log(result);
		let fileName = result[0].title + ".pdf";
		// results.forEach((el) => console.log(el));

		const file = path.join(__dirname, "..", "public", "papers", fileName);
		res.download(file, (err) => {
			if (err) {
				console.error("File download error:", err);
				res.status(500).send("Error downloading file.");
			}
		});
	});
});

app.get("/contact", (req, res) => {
	res.render("contact");
});

// Journal search functionality

app.get("/searchres", async (req, res) => {
	const searchQuery = req.query.query;

	if (!searchQuery) {
		return res.status(400).send("Search query is required");
	}

	// SQL query to search in title, description, and authors columns
	const sql = `
        SELECT * 
        FROM reports 
        WHERE 
            title LIKE ? 
    `;

	// Wildcard search term for SQL
	const searchTerm = `%${searchQuery}%`;

	// Execute the query
	connection.query(
		sql,
		[searchTerm, searchTerm, searchTerm],
		(err, results) => {
			if (err) {
				console.error("Error executing query:", err);
				return res
					.status(500)
					.send("An error occurred while searching the database");
			}

			// Return the results as JSON
			res.json(results);
		}
	);
});

app.get("/papers", (req, res) => {
	connection.query(
		"SELECT * FROM papers order by created_at DESC ",
		(err, results) => {
			if (err) throw err;
			console.log("mohammed");
			// console.log(results);
			const papers = results.map((paper) => {
				return {
					title: paper.title,
					url_path_to_first_page: paper.url_path,
					download_path: paper.download_path,
					created_at: paper.created_at,
				};
			});

			// console.log(url_path);

			res.render("papers", { papers });
			// res.send(papers);
		}
	);
});

app.get("/misionandvision", (req, res) => {
	res.render("misionandvision");
});

app.get("/technical_advisory", (req, res) => {
	res.render("technical_advisory");
});

app.get("/organizational_structure", (req, res) => {
	res.render("organizational_structure");
});

app.get("/carousel-test", (req, res) => {
	connection.query("SELECT * FROM reports ", (err, results) => {
		if (err) throw err;
		console.log(results);
		res.render("carousel-test", { reports: results });
	});
});

app.get("/management", (req, res) => {
	res.render("management");
});

console.log(path.join(__dirname, "..", "public"));

module.exports = app;
