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
    res.status(201).send({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    next(error); 
  }
};
