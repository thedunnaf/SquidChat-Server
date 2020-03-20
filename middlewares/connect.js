const { client, dbName } = require("../config");

async function Connect(req, res, next) {
	try {
		await client.connect();
		const db = await client.db(dbName);
		const collections = await db.listCollections().toArray();
		let count = 0;
		collections.forEach(el => {
			if (
				el.name == "Sellers" ||
				el.name == "Customers" ||
				el.name == "Chats"
			) {
				count++;
			}
		});
		if (count === 3) {
			req.sellerCollection = db.collection("Sellers");
			req.customerCollection = db.collection("Customers");
			req.chatCollection = db.collection("Chats");
			next();
		} else {
			throw new Error();
		}
	} catch (err) {
		res.status(500).json({ status: "error", message: "Collection not found!. Please run `npm run db:migrate` on your computer!" });
	}
}

module.exports = Connect;
