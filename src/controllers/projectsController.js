const db = require("../config/db");

exports.getProjects = (req, res) => {
	db.query("SELECT * FROM projects", (err, results) => {
		if (err) throw err;
		res.json(results);
	});
};

exports.getProjectById = (req, res) => {
	const { id } = req.params;
	db.query("SELECT * FROM projects WHERE id = ?", [id], (err, results) => {
		if (err) throw err;
		res.json(results[0]);
	});
};
