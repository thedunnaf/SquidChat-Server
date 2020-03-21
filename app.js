if (process.env.NODE_ENV == "development") {
	require("dotenv").config();
}
const express = require("express");
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const port = 3000;
const cors = require("cors");
const Routers = require("./routes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
	req.io = io;
	next();
});

app.use("/", Routers);

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

// module.exports = app
