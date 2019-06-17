require("dotenv").config();
const { send } = require("micro");
const login = require("./login");
const profile = require("./profile");
const register = require("./register");
const countries = require("./countries");
const corridors = require("./corridors");
const registerValidation = require("./register-validation");
const accountOverview = require("./account-overview");

const dev = async (req, res) => {
  switch (req.url) {
    case "/api/profile.js":
      await profile(req, res);
      break;
    case "/api/login.js":
      await login(req, res);
      break;
    case "/api/register.js":
      await register(req, res);
      break;
    case "/api/countries.js":
      await countries(req, res);
      break;
    case "/api/corridors.js":
      await corridors(req, res);
      break;
    case "/api/register-validation.js":
      await registerValidation(req, res);
      break;
    case "/api/account-overview.js":
      await accountOverview(req, res);
      break;

    default:
      send(res, 404, "404. Not found.");
      break;
  }
};

module.exports = dev;
