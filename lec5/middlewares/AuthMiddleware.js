const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  try {
    const token = req.headers["x-acciojob"];

    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!verified) {
      return res.status(401).send({
        status: 401,
        message: "User not authenticated! Please login!",
      });
    }

    next();
  } catch (err) {
    res.status(401).send({
      status: 401,
      message: "User not Authenticated! Please login!!",
      data: err,
    });
  }
};

module.exports = { isAuth };
