if(process.env.NODE_ENV == "development") {
	require("dotenv").config();
}
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const Routers = require("./routes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/", Routers);

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
