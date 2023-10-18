const LoggerMiddleware = (req, res, next) => {
  console.log(
    `Method: ${req.method} | URL: ${req.url} | Body: ${JSON.stringify(
      req.body
    )}`
  );

  next();
};

module.exports = { LoggerMiddleware };
