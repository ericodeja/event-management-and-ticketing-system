// Proper error handler with 4 arguments
export default function errorHandler(err, req, res, next) {
  console.error("Error:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
}
