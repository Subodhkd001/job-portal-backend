// error middleware || next function

const errorMiddleware = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({
    success: false,
    message: "Something went wrong",
    err
  });
};

export default errorMiddleware;
