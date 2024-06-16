import express from 'express'
import { loginController, registerController } from '../controllers/authController.js';

import rateLimit from 'express-rate-limit';

// ip limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per 'window' (here, per 15 minutes)
    standardHeaders: true, // return rate limit info in the RateLimit-* headers
    legacyHeaders: false, // disable the X-RateLimit-* headers
});

// router object
const router = express.Router()

// routes

/***
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: Object
 *      required:
 *         - name
 *         - email
 *         - password
 *         -location
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: User name
 *         email:
 *           type: string
 *           description: User email
 *         password:
 *           type: string
 *           description: User password
 *       
 */
 











// REGISTER || POST
router.post("/register",limiter, registerController )

// LOGIN || POST
router.post("/login",limiter, loginController)

// export
export default router;