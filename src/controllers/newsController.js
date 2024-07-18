const db = require("../config/db");
const { format } = require("date-fns");
let date = new Date();
const path = require("path");

exports.getNews = (req, res) => {
	db.query("SELECT * FROM news", (err, results) => {
		if (err) throw err;
		console.log(typeof results);
		// results.forEach((el) => console.log(el));
		const newsBlog = results.map((news) => {
			return {
				title: news.title,
				content: news.content,
				id: news.id,
				date_created: format(news.created_at, "MM/dd/yyyy"),
			};
		});
		res.json(newsBlog);
		// res.render("news", { newsBlog });
	});
};

exports.getNewsById = (req, res) => {
	const { id } = req.params;
	console.log(typeof req.params.id);
	// const rootDir = path.join(
	// 	"C:",
	// 	"Users",
	// 	"hp",
	// 	"Documents",
	// 	"energy commission backend - Copy"
	// );

	const filePath = path.join(__dirname, "news-view.html");

	console.log(filePath);

	db.query("SELECT * FROM news WHERE id = ?", [id], (err, results) => {
		if (err) throw err;

		const data = results[0];
		res.setHeader("data", JSON.stringify(data));
		res.sendFile(filePath);

		// res.json(results[0]);
	});
};
