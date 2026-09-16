const express = require("express");
const protect = require("../../middlewares/auth");
const controller = require("./users.controller");
const limiters = require("./users.limiter");
const route = express.Router();

route.get("/search", protect, limiters.searchUsersLimiter, controller.searchUsers);

module.exports = route;
