import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  createJobController,
  deleteJobController,
  getAllJobsController,
  jobStatsController,
  updateJobController,
} from "../controllers/jobsController.js";

const router = express.Router();

// routes
// CREATE JOBS ||  POST
router.post("/create-job", userAuth, createJobController);

// GET ALL JOBS || GET
router.get("/get-jobs", userAuth, getAllJobsController);

// UPDATE JOBS || PUT || PATCH
router.patch("/update-job/:id", userAuth, updateJobController);

// DELETE JOBS || DELETE
router.delete("/delete-job/:id", userAuth, deleteJobController);

// JOBS STATS FILTER || GET
router.get("/job-stats", userAuth, jobStatsController);




export default router;
