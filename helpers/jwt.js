const jwt = require("jsonwebtoken");

function signToken(obj) {
	const tokenKey = process.env.TOKEN_KEY;
	return jwt.sign(obj, tokenKey);
}

function verifyToken(token) {
	const tokenKey = process.env.TOKEN_KEY;
	return jwt.verify(token, tokenKey);
}

module.exports = {
	signToken,
	verifyToken
}
