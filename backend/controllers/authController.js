const User = require("../models/user");
const bcrypt = require("../utils/bcrypt");
const jsonwebtoken = require("jsonwebtoken");
// const cloudinary = require("../utils/cloudinary");

const secret = process.env.JWT_SECRET;

module.exports.register = async (request, response) => {
  const { pseudo, password, avatar } = request.body;
  if (!pseudo || !password) {
    return response.status(415).json({
      type: "Erreur",
      message: "Veuillez saisir un format valide",
    });
  }
//   if (avatar) {
//     cloudinary.v2.uploader.upload(
//       "avatar",
//       { upload_preset: "phoenix" },
//       (error, result) => {
//         console.log(result, error);
//       }
//     );
//   }
  const existsPseudo = await User.findOne({ pseudo: pseudo });
  if (existsPseudo) {
    return response.status(415).json({
      type: "Erreur",
      message: "Le pseudo ou l'email existe déjà",
    });
  }

  const cryptedPassword = await bcrypt.encrypt(password);
  const user = await User.create({
    pseudo: pseudo,
    password: cryptedPassword,
    avatar: avatar,
  });

  if (user) {
    const payload = {
      id: user._id,
      pseudo: user.pseudo,
    };
    const token = jsonwebtoken.sign(payload, secret, { expiresIn: "1d" });
    return response.status(201).json({
      type: "Success",
      message: "Successfull",
      user: {
        id: user._id,
        pseudo: user.pseudo,
        avatar: user.avatar,
        token: `Bearer ${token}`,
      },
    });
  }
};

module.exports.login = async (request, response) => {
  const { pseudo, password } = request.body;
  if (!pseudo || !password)
    return response.status(400).json({
      type: "Erreur",
      message: "Le mot de passe et l'adresse email sont obligatoires !",
    });

  const foundUser = await User.findOne({ pseudo: pseudo });

  if (!foundUser)
    return response.json({
      type: "Erreur",
      message: "L'email que vous avez entré est incorrect",
    });

  const cryptedPassword = foundUser.password;
  const match = await bcrypt.compare(password, cryptedPassword);
  if (!match)
    return response.json({
      type: "Erreur",
      message: "Le mot de passe entré est incorrecte",
    });

  const payload = {
    email: foundUser.email,
    id: foundUser.id,
  };

  const token = jsonwebtoken.sign(payload, secret, { expiresIn: "1d" });

  return response.send({
    type: "Success",
    message: "Utilisateur est connecté !",
    user: {
      id: foundUser._id,
      pseudo: foundUser.pseudo,
      avatar: foundUser.avatar,
      token: `Bearer ${token}`,
    },
  });
};