const slugify = require("slugify");

function slugGenerator(str) {
    return slugify(str, "_");
}

module.exports = slugGenerator;