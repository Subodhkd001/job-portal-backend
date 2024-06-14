import express from 'express'
import userAuth from '../middlewares/authMiddleware.js'
import { createJobController, getAllJobsController } from '../controllers/jobsController.js';

const router = express.Router()

// routes
// CREATE JOBS ||  POST
router.post('/create-job', userAuth, createJobController)

// GET ALL JOBS || GET
router.get('/get-jobs', userAuth, getAllJobsController)

export default router;