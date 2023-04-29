const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Admin = require("../models/admin");

const requireAuthGuest = async (req, res, next) => {
  //verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id }).select("-password");
    // check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ error: "Access Forbidden" });
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Session timed out. Please login again." });
    }
    res.status(401).json({ error: "Request is not authorized" });
  }
};

const requireAuthResident = async (req, res, next) => {
  //verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id }).select("-password");
    // check if user role is resident
    if (user.role !== "resident") {
      return res.status(403).json({ error: "Access Forbidden" });
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Session timed out. Please login again." });
    }
    res.status(401).json({ error: "Request is not authorized" });
  }
};

const requireAuthAdmin = async (req, res, next) => {
  //verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findOne({ _id }).select("_id");
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Session timed out. Please login again." });
    }
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = { requireAuthGuest, requireAuthResident, requireAuthAdmin };
