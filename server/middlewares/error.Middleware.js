// 🔹 Custom Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  // যদি response status 200 থাকে, আমরা 500 বানাই
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message, // error message
    // Development mode এ stack trace দেখাও, production এ hide
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;
