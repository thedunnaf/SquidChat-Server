const {verifyToken} = require("../helpers/jwt");

function Authentication(req, res, next) {

}

function AuthorizationCustomer(req, res, next) {

}

function AuthorizationSeller(req, res, next) {

}

module.exports = {
	Authentication, 
	AuthorizationCustomer, 
	AuthorizationSeller
}
