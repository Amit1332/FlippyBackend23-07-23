const ErrorHandler = require("../utils/errorhander");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resource not found. invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //mongoose Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid try again`;
    err = new ErrorHandler(message, 400);
  }

  // JWT expire error
  if (err.name === "TokenExpireError") {
    const message = `Json web token is Expire try again`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "ERR_HTTP_HEADERS_SENT") {
    const message = `ERR_HTTP_HEADERS_SENT reslove successfully`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.stack,
  });
};
