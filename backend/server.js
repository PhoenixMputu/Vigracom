const express = require("express");
const config = require("dotenv/config");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const http = require("http");
const passport = require("passport");

const app = express();

app.use(express.join());
app.use(passport.initialize());

app.use(cors());