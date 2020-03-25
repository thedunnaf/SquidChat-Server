const { SellerModel } = require("../models");
const {
	hashPassword,
	comparePassword,
	signToken,
	slugGenerator
} = require("../helpers");
const { Tokenizer, Stemmer } = require("sastrawijs");
const tokenizer = new Tokenizer;
const stemmer = new Stemmer;

class SellerController {
	static async login(req, res, next) {
		const collection = req.sellerCollection;
		const validation = [];
		if (req.body.email === "") {
			validation.push("Please fill `Email`!");
		}
		const email = req.body.email;
		if (req.body.password === "") {
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
		if (req.body.name === "") {
			validation.push("Please fill `Name`!");
		}
		const name = req.body.name;
		if (req.body.email === "") {
			validation.push("Please fill `Email`!");
		}
		const email = req.body.email;
		if (req.body.password === "") {
			validation.push("Please fill `Password`!");
		}
		const password = hashPassword(req.body.password);
		let image_url
		if (req.body.image_url === "") {
			image_url = "https://www.ppt-backgrounds.net/thumbs/question-marks-black-a-white-backgrounds.jpg";
		} else {
			image_url = req.body.image_url;
		}
		if (req.body.phone_number === "") {
			validation.push("Please fill `Phone Number`!");
		}
		const phone_number = req.body.phone_number;
		if (req.body.seller_category === "") {
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
		// if (!responses) {
		// 	res.status(404).json({
		// 		message: "User not found!",
		// 		status: "error"
		// 	});
		// } else {
		// }
		res.status(200).json({
			message: "Successful access dashboard!",
			status: "success",
			payload: {
				seller: responses
			}
		});
	}
	static async updateAccount(req, res, next) {
		const collection = req.sellerCollection;
		const slug = req.loggedSellerSlug;
		const validation = [];
		if (req.body.name === "") {
			validation.push("Please fill `Name`!");
		}
		const name = req.body.name;
		if (req.body.email === "") {
			validation.push("Please fill `Email`!");
		}
		const email = req.body.email;
		if (req.body.password === "") {
			validation.push("Please fill `Password`!");
		}
		const password = hashPassword(req.body.password);
		let image_url
		if (req.body.image_url === "") {
			image_url = "https://www.ppt-backgrounds.net/thumbs/question-marks-black-a-white-backgrounds.jpg";
		} else {
			image_url = req.body.image_url;
		}
		if (req.body.phone_number === "") {
			validation.push("Please fill `Phone Number`!");
		}
		const phone_number = req.body.phone_number;
		if (req.body.seller_category === "") {
			validation.push("Please Choose `Seller Category`!");
		}
		const seller_category = req.body.seller_category;
		if (validation.length > 0) {
			res.status(400).json({ message: validation.join(", "), status: "error" });
		} else {
			const seller = await SellerModel.findOne(collection, slug);
			// if (!seller) {
			// 	res.status(404).json({
			// 		message: "User not found!",
			// 		status: "error"
			// 	});
			// } else {
			// }
			seller.name = name;
			seller.email = email;
			seller.password = password;
			seller.image_url = image_url;
			seller.phone_number = phone_number;
			seller.seller_category = seller_category;
			await SellerModel.update(collection, slug, seller);
			res.status(200).json({
				message: "Successful update account!",
				status: "success",
				payload: {
					seller
				}
			});
		}
	}
	// static async updateLinkReadStatus(req, res, next) {
	// 	const collection = req.sellerCollection;
	// 	const slug = req.loggedSellerSlug;
	// 	const id = req.params.id;
	// 	const seller = await SellerModel.findOne(collection, slug);
	// 	// if (!seller) {
	// 	// 	res.status(404).json({
	// 	// 		message: "User not found!",
	// 	// 		status: "error"
	// 	// 	});
	// 	// } else {
	// 	// }
	// 	let flag = false;
	// 	seller.links.forEach(el => {
	// 		if (el.id == id) {
	// 			el.read = !el.read;
	// 			flag = true;
	// 		}
	// 	});
	// 	if (!flag) {
	// 		res.status(404).json({
	// 			message: "Data not found!",
	// 			status: "error"
	// 		});
	// 	} else {
	// 		await SellerModel.update(collection, slug, seller);
	// 		res.status(200).json({
	// 			message: "Succesful update read status!",
	// 			status: "success"
	// 		});
	// 	}
	// }
	// static async destroyLink(req, res, next) {
	// 	const collection = req.sellerCollection;
	// 	const slug = req.loggedSellerSlug;
	// 	const id = req.params.id;
	// 	const seller = await SellerModel.findOne(collection, slug);
	// 	// if (!seller) {
	// 	// 	res.status(404).json({
	// 	// 		message: "User not found!",
	// 	// 		status: "error"
	// 	// 	});
	// 	// } else {
	// 	// }
	// 	const linksTemp = [];
	// 	let flag = false;
	// 	seller.links.forEach(el => {
	// 		if (el.id !== id) {
	// 			linksTemp.push(el);
	// 		} else {
	// 			flag = true;
	// 		}
	// 	});
	// 	if (!flag) {
	// 		res.status(404).json({
	// 			message: "Data not found!",
	// 			status: "error"
	// 		});
	// 	} else {
	// 		seller.links = linksTemp;
	// 		await SellerModel.update(collection, slug, seller);
	// 		res.status(200).json({
	// 			message: "Succesful delete chat!",
	// 			status: "success"
	// 		});
	// 	}
	// }
	static async createChatBot(req, res, next) {
		const collection = req.sellerCollection;
		const slug = req.loggedSellerSlug;
		const validation = [];
		const id = `chatbot_${Date.now()}`;
		if (!req.body.question || req.body.question === "") {
			validation.push("Please choose `Question`!");
		}
		const question = req.body.question;
		const tokenized = tokenizer.tokenize(question);
		const key = [];
		tokenized.forEach(el => {
			key.push(stemmer.stem(el));
		});
		if (!req.body.answer || req.body.answer === "") {
			validation.push("Please choose `Answer`!");
		}
		const answer = req.body.answer;
		const created_at = new Date();
		const obj = {
			id, question, key, answer, created_at
		}
		if (validation.length > 0) {
			res.status(400).json({
				message: validation.join(", "),
				status: "error"
			});
		} else {

			const seller = await SellerModel.findOne(collection, slug);
			// if (!seller) {
			// 	res.status(404).json({
			// 		message: "User not found!",
			// 		status: "error",
			// 	});
			// } else {
			// }
			seller.chat_bots.unshift(obj);
			await SellerModel.update(collection, slug, seller);
			res.status(200).json({
				message: "Create chat bot sucessful!",
				status: "success",
				payload: {
					chat_bot: {
						id,
						question,
						key,
						answer,
						created_at
					}

				}
			});
		}
	}
	static async updateChatBot(req, res, next) {
		const collection = req.sellerCollection;
		const slug = req.loggedSellerSlug;
		const id = req.params.id;
		const validation = [];
		if (!req.body.question || req.body.question === "") {
			validation.push("Please choose `Question`!");
		}
		const question = req.body.question;
		const tokenized = tokenizer.tokenize(question);
		const key = [];
		tokenized.forEach(el => {
			key.push(stemmer.stem(el));
		});
		if (!req.body.answer || req.body.answer === "") {
			validation.push("Please choose `Answer`!");
		}
		const answer = req.body.answer;
		if (validation.length > 0) {
			res.status(400).json({
				message: validation.join(", "),
				status: "error"
			});
		} else {
			const seller = await SellerModel.findOne(collection, slug);
			// if (!seller) {
			// 	res.status(404).json({
			// 		message: "User not found!",
			// 		status: "error",
			// 	});
			// } else {
			// }
			seller.chat_bots.forEach(el => {
				if (el.id === id) {
					el.question = question;
					el.answer = answer;
					el.key = key;
				}
			});
			await SellerModel.update(collection, slug, seller);
			res.status(200).json({
				message: "Update chat bot sucessful!",
				status: "success",
				payload: {
					chat_bot: {
						id,
						question,
						key,
						answer,
					}
				}
			});
		}
	}
	static async destroyChatBot(req, res, next) {
		const collection = req.sellerCollection;
		const slug = req.loggedSellerSlug;
		const id = req.params.id;
		const seller = await SellerModel.findOne(collection, slug);
		// if (!seller) {
		// 	res.status(404).json({
		// 		message: "User not found!",
		// 		status: "error",
		// 	});
		// } else {
		// }
		const sellerTemp = [];
		seller.chat_bots.forEach(el => {
			if (el.id !== id) {
				sellerTemp.push(el);
			}
		});
		seller.chat_bots = sellerTemp;
		await SellerModel.update(collection, slug, seller);
		res.status(200).json({
			message: "Destroy chat bot sucessful!",
			status: "success"
		});
	}
	static async createCollection(req, res, next) {
		const collection = req.sellerCollection;
		const slug = req.loggedSellerSlug;
		const id = `collection_${Date.now()}`;
		if (req.body.collection_name === "" || !req.body.collection_name) {
			console.log('nice================')
			res.status(400).json({
				message: "Please fill `Collection Name`!",
				status: "error",
			});
		} else {
			const collection_name = req.body.collection_name;
			const fields = [];
			const created_at = new Date();
			const obj = {
				id,
				collection_name,
				fields,
				created_at
			};
			const seller = await SellerModel.findOne(collection, slug);
			// if (!seller) {
			// 	res.status(404).json({
			// 		message: "User not found!",
			// 		status: "error"
			// 	});
			// } else {
			// }
			seller.collections.push(obj);
			await SellerModel.update(collection, slug, seller);
			res.status(201).json({
				message: "Success create collection!",
				status: "success",
				payload: {
					collection: obj
				}
			});
		}
	}
	static async updateCollection(req, res, next) {
		const collection = req.sellerCollection;
		const slug = req.loggedSellerSlug;
		const id = req.params.id;
		if (req.body.collection_name === "" || !req.body.collection_name) {
			res.status(400).json({
				message: "Please fill `Collection Name`!",
				status: "error",
			});
		} else {
			const collection_name = req.body.collection_name;
			const seller = await SellerModel.findOne(collection, slug);
			// if (!seller) {
			// 	res.status(404).json({
			// 		message: "User not found!",
			// 		status: "error"
			// 	});
			// } else {
			// }
			let collectionTemp;
			seller.collections.forEach(el => {
				if (el.id === id) {
					collectionTemp = el;
					el.collection_name = collection_name
				}
			});
			await SellerModel.update(collection, slug, seller);
			res.status(200).json({
				message: "Success update collection!",
				status: "success",
				payload: {
					collection: collectionTemp
				}
			});
		}
	}
	static async destroyCollection(req, res, next) {
		const collection = req.sellerCollection;
		const slug = req.loggedSellerSlug;
		const id = req.params.id;
		const seller = await SellerModel.findOne(collection, slug);
		// if (!seller) {
		// 	res.status(404).json({
		// 		message: "User not found!",
		// 		status: "error"
		// 	});
		// } else {
		// }
		const collectionsTemp = [];
		seller.collections.forEach(el => {
			if (el.id !== id) {
				collectionsTemp.push(el);
			}
		});
		seller.collections = collectionsTemp;
		await SellerModel.update(collection, slug, seller);
		res.status(200).json({
			message: "Success delete collection!",
			status: "success"
		});
	}
	static async createField(req, res, next) {
		const collection = req.sellerCollection;
		const slug = req.loggedSellerSlug;
		const id_collection = req.params.id_collection;
		const id = `field_${Date.now()}`;
		const field_name = req.body.field_name;
		const value = req.body.value;
		const obj = {
			id,
			field_name,
			value
		}
		const seller = await SellerModel.findOne(collection, slug);
		// if (!seller) {
		// 	res.status(404).json({
		// 		message: "User not found!",
		// 		status: "error"
		// 	});
		// } else {
		// }
		let flag = false;
		seller.collections.forEach(el => {
			if (el.id === id_collection) {
				el.fields.push(obj);
				flag = true;
			}
		});
		if (!flag) {
			res.status(404).json({
				message: "Data not found!",
				status: "error"
			});
		} else {
			await SellerModel.update(collection, slug, seller);
			res.status(201).json({
				message: "Success create field!",
				status: "success",
				payload: {
					field: obj
				}
			});
		}
	}
	static async updateField(req, res, next) {
		const collection = req.sellerCollection;
		const slug = req.loggedSellerSlug;
		const id_collection = req.params.id_collection;
		const id_field = req.params.id_field;
		const field_name = req.body.field_name;
		const value = req.body.value;
		const seller = await SellerModel.findOne(collection, slug);
		// if (!seller) {
		// 	res.status(404).json({
		// 		message: "User not found!",
		// 		status: "error"
		// 	});
		// } else {
		// }
		let flag = false;
		let fieldTemp;
		seller.collections.forEach(el => {
			if (el.id === id_collection) {
				el.fields.forEach(el2 => {
					if (el2.id === id_field) {
						fieldTemp = el2;
						el2.field_name = field_name;
						el2.value = value;
						flag = true;
					}
				});
			}
		});
		if (!flag) {
			res.status(404).json({
				message: "Data not found!",
				status: "error"
			});
		} else {
			await SellerModel.update(collection, slug, seller);
			res.status(200).json({
				message: "Success update field!",
				status: "success",
				payload: {
					field: fieldTemp
				}
			});
		}
	}
	static async destroyField(req, res, next) {
		const collection = req.sellerCollection;
		const slug = req.loggedSellerSlug;
		const id_collection = req.params.id_collection;
		const id_field = req.params.id_field;
		const seller = await SellerModel.findOne(collection, slug);
		// if (!seller) {
		// 	res.status(404).json({
		// 		message: "User not found!",
		// 		status: "error"
		// 	});
		// } else {
		// }
		const fieldTemp = [];
		let index;
		seller.collections.forEach((el, i) => {
			if (el.id === id_collection) {
				index = i;
				el.fields.forEach(el2 => {
					if (el2.id !== id_field) {
						fieldTemp.push(el2);
					}
				});
			}
		});
		if (fieldTemp.length === seller.collections[index].fields.length) {
			res.status(404).json({
				message: "Data not found!",
				status: "error"
			});
		} else {
			seller.collections[index].fields = fieldTemp;
			await SellerModel.update(collection, slug, seller);
			res.status(200).json({
				message: "Success delete field!",
				status: "success",
			});
		}
	}
}

module.exports = SellerController;
