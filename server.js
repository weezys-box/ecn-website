const app = require("./src/app2");

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
