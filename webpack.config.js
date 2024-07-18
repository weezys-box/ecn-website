const path = require("path");

module.exports = {
	mode: "development",
	entry: "./public/js/index.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "esm-loader",
					options: {
						babel: true, // Enable Babel for ES6 syntax support
					},
				},
			},
		],
	},
};
