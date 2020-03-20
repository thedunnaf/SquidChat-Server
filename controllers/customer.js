const { CustomerModel } = require("../models");
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
	static async dashboard(req, res, next) {
		const collection = req.customerCollection;
		const slug = req.loggedCustomerSlug;
		const responses = await CustomerModel.findOne(collection, slug);
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
					customer: responses
				}
			});
		}
	}
	static createLink(req, res, next) {

	}
	static destroyLink(req, res, next) {

	}
}

module.exports = CustomerController;
