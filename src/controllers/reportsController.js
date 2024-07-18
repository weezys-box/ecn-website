const db = require("../config/db");

exports.getReports = (req, res) => {
	db.query("SELECT * FROM reports", (err, results) => {
		if (err) throw err;
		res.json(results);
		// res.json(results);
	});
};

exports.getReportById = (req, res) => {
	const { id } = req.params;
	db.query("SELECT * FROM reports WHERE id = ?", [id], (err, results) => {
		if (err) throw err;
		const data = results[0];
		res.json(data);
		// res.json(results[0]);
	});
};
