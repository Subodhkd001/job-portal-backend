import jobsModel from "../models/jobsModel.js";

// ======== CREATE JOBS ========
export const createJobController = async (req, res, next) => {
  try {
    const { company, position } = req.body;
    if (!company || !position) {
      next("Provide all fields");
    }
    req.body.createdBy = req.user.userId;
    const job = await jobsModel.create(req.body);
    res.status(201).json({ job });
  } catch (error) {}
};

// ========= GET ALL JOBS =======
export const getAllJobsController = async (req, res, next) => {
  try {
    const jobs = await jobsModel.find({ createdBy: req.user.userId });
    res.status(200).json({
      totalJobs: jobs.length,
      jobs,
    });
  } catch (error) {}
};

// ========= UPDATE JOBS ========
export const updateJobController = async (req, res, next) => {
  const { id } = req.params;
  const { company, position } = req.body;

  // validation
  if (!company || !position) {
    next("Please Provide all fields");
  }

  // find job
  const job = await jobsModel.findOne({ _id: id });

  // validation
  if (!job) {
    next(`No job found with this id ${id}`);
  }
  if (!req.user.userId === job.createdBy.toString()) {
    return;
    next("You are not authorized to update this job");
  }
  const updatedJob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  // res
  res.status(200).json({ updatedJob });
};

// ======== DELETE JOB =======

export const deleteJobController = async (req, res, next) => {
  const { id } = req.params;
  // find job
  const job = await jobsModel.findOne({ _id: id });
  // validation
  if (!job) {
    next(`No job found with this id ${id}`);
  }
  if (!req.user.userId === job.createdBy.toString()) {
    // agar login user have not created
    // this job then he can't delete it
    next("You are not authorized to delete this job");
    return;
  }
  await job.deleteOne();
  res.status(200).json({ msg: "Job deleted successfully" });
};
