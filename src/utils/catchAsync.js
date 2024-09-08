const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) =>
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message })
  );
};
export { catchAsync };
