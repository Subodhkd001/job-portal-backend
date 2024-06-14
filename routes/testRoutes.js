import express from 'express'
import {testPostController} from '../controllers/testController.js'
import userAuth from '../middlewares/authMiddleware.js';

// Create a new Express router instance
// router object
const router = express.Router();


router.post("/test-post", userAuth, testPostController)

export default router;