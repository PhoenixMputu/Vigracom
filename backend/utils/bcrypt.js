const bcrypt = require("bcrypt");

module.exports.encrypt = async (textPassword) => await bcrypt.hash(textPassword, 10);

module.exports.compare = (textPassword, hashedPassword) => bcrypt.compare(textPassword, hashedPassword);