// const truncateHtml = require("truncate-html");
// const format = require("date-fns");

// formatDate function

function formatDate(dateString) {
	const date = new Date(dateString);
	return date.format("MMMM D, yyyy");
}

// truncate html function

function truncateHtmls(html) {
	return truncateHtml(html, { length: 100 });
}

module.exports = {
	truncateHtmls,
	formatDate,
};
