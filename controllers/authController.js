import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // client se aane wala data destructure kara gaya hai
    // validation
    if (!name) {
      next("Name is required");
    }
    if (!email) {
      next("Email is required");
    }
    if (!password) {
      next("Password is required and greaater than 6 character");
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      next("Email already exists please login");
    }

    const user = await userModel.create({ name, email, password });

    // token
    const token = user.createJWT();

    res.status(201).send({
      success: true,
      message: "User created successfully",
      user: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    next("Please provide all fields");
  }
  // find user by email
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    next("Invalid Username or password");
  }
  user.password = undefined;
  // compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    next("Invalid Username or password");
  }

  const token = user.createJWT();

  res.status(200).send({
    success: true,
    message: "User login successfully",
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
    },
    token,
  });
};
