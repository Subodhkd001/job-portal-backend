// Package imports
import dotenv from "dotenv"
import express from "express";
import cors from "cors"
import morgan from "morgan";

// file imports
import connectDB from "./config/db.js";
import testRoutes from "./routes/testRoutes.js";

// config
dotenv.config();

// if .env is in some another file
// dotenv.config({
//     path: "./config.env"
// });

// mongodb connection
connectDB();

// rest object
const app = express();

// port
const PORT=process.env.PORT || 8080;

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors())
app.use(morgan("dev"))

// routes
app.use("/api/v1/test", testRoutes)

// listen
app.listen(PORT, () =>{
    console.log(`Node server running in ${process.env.DEV_MODE} mode on port ${PORT}`)
})

