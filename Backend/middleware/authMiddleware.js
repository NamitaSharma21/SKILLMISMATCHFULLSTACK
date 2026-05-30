const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "No token, authorization denied",
      });
    }

    const decoded = jwt.verify(token, "secretkey");

    req.user = decoded; // contains user id

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token invalid",
    });
  }
};

module.exports = authMiddleware;