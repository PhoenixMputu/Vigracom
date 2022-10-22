const User = require("../models/user");

module.exports.getAllUsers = async (request, response) => {
  const users = await User.find({ pseudo: { $ne: request.params.pseudo } });
  return response.status(200).send({
    type: "Success",
    message: "Users",
    users: users,
  });
};
