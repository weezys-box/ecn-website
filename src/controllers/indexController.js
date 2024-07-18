exports.home = (req, res) => {
	db.query("SELECT * FROM reports", (err, results) => {
		if (err) throw err;
		console.log("mohammed");
		// res.renders("index");
		res.json(results);
	});
	// res.render("index");
};
