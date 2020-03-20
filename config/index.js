const MongoClient = require("mongodb").MongoClient;

const url = `mongodb://${process.env.USERNAME}:${process.env.PASSWORD}@localhost:27017/?authMechanism=DEFAULT`;
const dbName = "SquidChat";
const client = new MongoClient(
	url,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
);

module.exports = {
	client, dbName
}
