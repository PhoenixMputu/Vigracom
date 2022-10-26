const User = require("../models/user");

module.exports.getAllUsers = async (request, response) => {
  const users = await User.find({ pseudo: { $ne: request.params.pseudo } });
  return response.status(200).send({
    type: "Success",
    message: "Users",
    users: users,
  });
};

module.exports.getMe = async (request, response) => {
  const user = await User.findOne({ pseudo: request.params.pseudo });
  return response.status(200).send({
    type: "Success",
    message: "User",
    user: user,
  });
};
