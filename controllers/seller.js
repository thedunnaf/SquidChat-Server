const { SellerModel } = require("../models");
const {
	hashPassword,
	comparePassword,
	signToken,
	slugGenerator
} = require("../helpers");

class SellerController {
	static async login(req, res, next) {
		const collection = req.sellerCollection;
		const validation = [];
		if (req.body.email == "") {
			validation.push("Please fill `Email`!");
		}
		const email = req.body.email;
		if (req.body.password == "") {
			validation.push("Please fill `Password`!");
		}
		const password = req.body.password;
		if (validation.length > 0) {
			res.status(400).json({ message: validation.join(", "), status: "error" });
		} else {
			const responses = await SellerModel.login(collection, email);
			if (!responses) {
				res.status(404).json({ message: "User not found!", status: "error" })
			} else {
				if (!comparePassword(password, responses.password)) {
					res.status(403).json({ message: "Password not match!", status: "error" })
				} else {
					const obj = { slug: responses.slug };
					const token = signToken(obj);
					res.status(200).json(
						{
							message: "Login successful!",
							status: "success",
							payload: {
								token: token
							}
						})
				}
			}
		}
	}
	static async register(req, res, next) {
		const collection = req.sellerCollection;
		const validation = [];
		if (req.body.name == "") {
			validation.push("Please fill `Name`!");
		}
		const name = req.body.name;
		if (req.body.email == "") {
			validation.push("Please fill `Email`!");
		}
		const email = req.body.email;
		if (req.body.password == "") {
			validation.push("Please fill `Password`!");
		}
		const password = hashPassword(req.body.password);
		let image_url
		if (req.body.image_url == "") {
			image_url = "https://www.ppt-backgrounds.net/thumbs/question-marks-black-a-white-backgrounds.jpg";
		} else {
			image_url = req.body.image_url;
		}
		if (req.body.phone_number == "") {
			validation.push("Please fill `Phone Number`!");
		}
		const phone_number = req.body.phone_number;
		if (req.body.seller_category == "") {
			validation.push("Please Choose `Seller Category`!");
		}
		const seller_category = req.body.seller_category;
		const time = String(Date.now());
		const tempSlug = `${name} ${time}`;
		const slug = slugGenerator(tempSlug);
		const links = [];
		const collections = [];
		const chat_bots = [];
		const obj = {
			name,
			email,
			password,
			image_url,
			phone_number,
			seller_category,
			slug,
			links,
			collections,
			chat_bots,
		}
		if (validation.length > 0) {
			res.status(400).json({ message: validation.join(", "), status: "error" });
		} else {
			const responses = await SellerModel.create(collection, obj);
			if (!responses) {
				res.status(500).json({
					message: "Internal server error!",
					status: "error"
				});
			} else {
				res.status(201).json({
					message: "Register success!",
					status: "success",
					payload: {
						seller: responses.ops[0]
					}
				});
			}
		}
	}
	static async dashboard(req, res, next) {
		const collection = req.sellerCollection;
		const slug = req.loggedSellerSlug;
		const responses = await SellerModel.findOne(collection, slug);
		if (!responses) {
			res.status(404).json({
				message: "User not found!",
				status: "error"
			});
		} else {
			res.status(200).json({
				message: "Successful access dashboard!",
				status: "success",
				payload: {
					seller: responses
				}
			});
		}
	}
	static async createLink(req, res, next) {
		const collection = req.sellerCollection;

	}
	static async destroyLink(req, res, next) {
		const collection = req.sellerCollection;

	}
	static async createChatBot(req, res, next) {
		const collection = req.sellerCollection;

	}
	static async updateChatBot(req, res, next) {
		const collection = req.sellerCollection;

	}
	static async destroyChatBot(req, res, next) {
		const collection = req.sellerCollection;

	}
	static async createCollection(req, res, next) {
		const collection = req.sellerCollection;

	}
	static async updateCollection(req, res, next) {
		const collection = req.sellerCollection;

	}
	static async destroyCollection(req, res, next) {
		const collection = req.sellerCollection;

	}
}

module.exports = SellerController;
