const {client, dbName} = require("../config");

async function Connect(req, res, next) {
	try {
		await client.connect();
		const db = await client.db(dbName);
		const collections = await db.listCollection.toArray();
		if(
			collections.includes("Sellers") &&
			collections.includes("Customers") &&
			collections.includes("Chats") &&
			collections.includes("ChatBots")
		) {
			req.sellerCollection = db.collection("Sellers");
			req.customerCollection = db.collection("Customer");
			req.chatCollection = db.collection("Chats");
			req.chatBotCollection = db.collection("ChatBots");
			next();
		} else {
			throw new Error();
		}
	} catch(err) {
		res.status(500).json({status: "error", message: "Collection not found!. Please run `npm run db:migrate` on your computer!"});
	}
}

module.exports = Connect;
