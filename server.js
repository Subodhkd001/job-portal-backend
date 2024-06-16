// API documentation
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
// Package imports
import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan";
import "express-async-errors";

// security packages
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize"
// import expressLimit from 'express-rate-limit'

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

// Swagger API config
// Swagger API options
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Job Portal API",
            description: "Node Express JS Job Portal API",
        },
        servers: [
            {
                url: "http://localhost:8080", // if in production then change
            },
        ],
    },
    apis: ["./routes/*.js"],
};

const spec = swaggerJSDoc(options);


// rest object
const app = express();

// home route - Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

// middlewares
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
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

