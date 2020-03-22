const { CustomerModel, SellerModel, ChatModel } = require("../models");
const { hashPassword, comparePassword, signToken, slugGenerator } = require("../helpers");

class CustomerController {
	static async login(req, res, next) {
		const collection = req.customerCollection;
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
			const responses = await CustomerModel.login(collection, email);
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
		const collection = req.customerCollection;
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
		const time = String(Date.now());
		const tempSlug = `${name} ${time}`;
		const slug = slugGenerator(tempSlug);
		const links = [];
		const obj = {
			name,
			email,
			password,
			image_url,
			slug,
			links
		}
		if (validation.length > 0) {
			res.status(400).json({ message: validation.join(", "), status: "error" });
		} else {
			const responses = await CustomerModel.create(collection, obj);
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
						customer: responses.ops[0]
					}
				});
			}
		}
	}
	static async updateAccount(req, res, next) {
		const collection = req.customerCollection;
		const slug = req.loggedCustomerSlug;
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
		if (validation.length > 0) {
			res.status(400).json({ message: validation.join(", "), status: "error" });
		} else {
			const customer = await CustomerModel.findOne(collection, slug);
			if (!customer) {
				res.status(404).json({
					message: "User not found!",
					status: "error"
				});
			} else {
				customer.name = name;
				customer.email = email;
				customer.password = password;
				customer.image_url = image_url;
				await CustomerModel.update(collection, slug, customer);
				res.status(200).json({
					message: "Successful update account!",
					status: "success",
					payload: {
						customer
					}
				});
			}
		}
	}
	static async dashboard(req, res, next) {
		const collection = req.customerCollection;
		const collection2 = req.sellerCollection;
		const slug = req.loggedCustomerSlug;
		const responses = await CustomerModel.findOne(collection, slug);
		if (!responses) {
			res.status(404).json({
				message: "User not found!",
				status: "error"
			});
		} else {
			const sellers = await SellerModel.findAll(collection2);
			res.status(200).json({
				message: "Successful access dashboard!",
				status: "success",
				payload: {
					customer: responses,
					sellers
				}
			});
		}
	}
	static async createLink(req, res, next) {
		const collection = req.customerCollection;
		const collection2 = req.sellerCollection;
		const collection3 = req.chatCollection;
		const customerSlug = req.loggedCustomerSlug;
		const sellerSlug = req.body.sellerSlug;
		const socketLink = `/${sellerSlug}/${customerSlug}`;
		const customer = await CustomerModel.findOne(collection, customerSlug);
		const seller = await SellerModel.findOne(collection2, sellerSlug);
		const created_at = new Date();
		if (!customer || !seller) {
			res.status(404).json({
				message: "Data not found!",
				status: "error"
			});
		} else {
			const id = `link_${Date.now()}`;
			customer.links.unshift({
				id,
				link: socketLink,
				seller: seller.name,
				customer: customer.name,
				last_chat: "",
				read: false,
				created_at
			});
			seller.links.unshift({
				id,
				link: socketLink,
				seller: seller.name,
				customer: customer.name,
				last_chat: "",
				read: false,
				created_at
			});
			await CustomerModel.update(collection, customerSlug, customer)
			await SellerModel.update(collection2, sellerSlug, seller);

			const obj = {
				id,
				link: socketLink,
				seller_slug: sellerSlug,
				customer_slug: customerSlug,
				chats: [],
				created_at
			}
			await ChatModel.create(collection3, obj);
			res.status(200).json({
				message: "Succesful add new chat!",
				status: "success",
				payload: {
					link: obj
				}
			});
		}
	}
	static async updateLinkReadStatus(req, res, next) {
		const collection = req.customerCollection;
		const slug = req.loggedCustomerSlug;
		const id = req.params.id;
		const customer = await CustomerModel.findOne(collection, slug);
		if (!customer) {
			res.status(404).json({
				message: "User not found!",
				status: "error"
			});
		} else {
			let flag = false;
			customer.links.forEach(el => {
				if (el.id == id) {
					el.read = !el.read;
					flag = true;
				}
			});
			if (!flag) {
				res.status(404).json({
					message: "Data not found!",
					status: "error"
				});
			} else {
				await CustomerModel.update(collection, slug, customer);
				res.status(200).json({
					message: "Succesful update read status!",
					status: "success"
				});
			}
		}
	}
	static async destroyLink(req, res, next) {
		const collection = req.customerCollection;
		const slug = req.loggedCustomerSlug;
		const id = req.params.id;
		const customer = await CustomerModel.findOne(collection, slug);
		if (!customer) {
			res.status(404).json({
				message: "User not found!",
				status: "error"
			});
		} else {
			const linksTemp = [];
			let flag = false;
			customer.links.forEach(el => {
				if (el.id != id) {
					linksTemp.push(el);
				} else {
					flag = true;
				}
			});
			if (!flag) {
				res.status(404).json({
					message: "Data not found!",
					status: "error"
				});
			} else {
				customer.links = linksTemp;
				await CustomerModel.update(collection, slug, customer);
				res.status(200).json({
					message: "Succesful delete chat!",
					status: "success"
				});
			}
		}
	}
}

module.exports = CustomerController;
