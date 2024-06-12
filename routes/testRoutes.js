import express from 'express'
import {testPostController} from '../controllers/testController.js'

// Create a new Express router instance
// router object
const router = express.Router();


router.post("/test-post", testPostController)

export default router;