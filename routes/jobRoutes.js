import express from 'express'
import userAuth from '../middlewares/authMiddleware'

const router = express.Router()

// routes
// CREATE JOBS ||  POST
router.post('/', userAuth, createJobController)

// GET ALL JOBS || GET

export default router;