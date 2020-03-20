const { verifyToken } = require("../helpers");
const { SellerModel, CustomerModel } = require("../models");

async function AuthenticationSeller(req, res, next) {
	try {
		const token = req.headers.token;
		const verify = verifyToken(token);
		if (!verify) {
			res.status(401).json({
				message: "Token invalid!",
				status: "error"
			});
		} else {
			const collection = req.sellerCollection;
			const slug = verify.slug;
			let found;
			found = await SellerModel.findOne(collection, slug);
			if (!found) {
				res.status(404).json({
					message: "User not found!",
					status: "error"
				});
			} else {
				req.loggedSellerSlug = found.slug;
				next();
			}
		}
	} catch (err) {
		res.status(401).json({
			message: "Token invalid!",
			status: "error"
		});
	}
}

async function AuthenticationCustomer(req, res, next) {
	try {
		const token = req.headers.token;
		const verify = verifyToken(token);
		if (!verify) {
			res.status(401).json({
				message: "Token invalid!",
				status: "error"
			});
		} else {
			const collection = req.customerCollection;
			const slug = verify.slug;
			let found;
			found = await CustomerModel.findOne(collection, slug);
			if (!found) {
				res.status(404).json({
					message: "User not found!",
					status: "error"
				});
			} else {
				req.loggedCustomerSlug = found.slug;
				next();
			}
		}
	} catch (err) {
		res.status(401).json({
			message: "Token invalid!",
			status: "error"
		});
	}
}

function AuthorizationCustomer(req, res, next) {

}

function AuthorizationSeller(req, res, next) {

}

module.exports = {
	AuthenticationSeller,
	AuthenticationCustomer,
	AuthorizationCustomer,
	AuthorizationSeller
}
