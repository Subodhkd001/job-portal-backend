// Package imports
import dotenv from "dotenv"
import express from "express";
import cors from "cors"
import morgan from "morgan";
import "express-async-errors";
// file imports
import connectDB from "./config/db.js";

// routes import
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import errorMiddleware from "./middlewares/errorMiddleware.js";
import userRouter from "./routes/userRoutes.js"
import jobsRoutes from "./routes/jobsRoutes.js"

// config
dotenv.config();

// mongodb connection
connectDB();

// rest object
const app = express();


// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors())
app.use(morgan("dev"))

// routes
app.use("/api/v1/test", testRoutes)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/job", jobsRoutes)

// validation middleware
app.use(errorMiddleware);


// port
const PORT=process.env.PORT || 8080;

// listen
app.listen(PORT, () =>{
    console.log(`Node server running in ${process.env.DEV_MODE} mode on port ${PORT}`)
})

