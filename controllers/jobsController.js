import jobsModel from "../models/jobsModel.js";
import mongoose from 'mongoose';
import moment from "moment";
import { query } from "express";

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
    const {status, workType, search, sort} = req.query
    // conditions for searching filters
    const queryObject = {
      createdBy:req.user.userId,
    }
    // logic filters
    if(status && status!=='all'){
      queryObject.status = status
    }

    if(workType && workType!=='all'){
      queryObject.workType = workType
    }

    if(search){
      queryObject.position = {$regex:search, $options:'i'};
    }

   

    const queryResult = jobsModel.find(queryObject);

     // sorting
     if(sort == "latest"){
      queryResult = queryResult.sort('-createdAt')
    }
     if(sort == "oldest"){
      queryResult = queryResult.sort('createdAt')
    }
    if(sort == "a-z"){
      queryResult = queryResult.sort('position')
    }
    if(sort == "z-a"){
      queryResult = queryResult.sort('-position')
    }

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    queryResult = queryResult.skip(skip).limit(limit);

    // jobs count
    const totalJobs = await jobsModel.countDocuments(queryResult) 
    const numOfPages = Math.ceil(totalJobs / limit)

    // get all jobs
    const jobs = await queryResult;

    // const jobs = await jobsModel.find({ createdBy: req.user.userId });
    res.status(200).json({
      totalJobs,
      jobs,
      numOfPages
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


// ======= JOBS STATS AND FILTER ===========

export const jobStatsController = async (req, res, next) => {
  const stats = await jobsModel.aggregate([
    // search by user jobs
    {
      $match:{
        // ismee hame batana padta hai iske basis par query perform karna hai
        createdBy:new mongoose.Types.ObjectId(req.user.userId)
      }
    },
    {
      $group:{
        _id: "$status", // group by status
        count:{$sum:1} // count of jobs
      },
    }
  ])
  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  }; 
  
  // monthly yearly status
  let monthlyApllication = await jobsModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group:{
        _id:{
          year:{$year:"$createdAt"}, // year
          month:{$month:"$createdAt"}, // month
        },
        count:{$sum:1} // count of jobs
      }
    }
  ])

  monthlyApllication = monthlyApllication.map((item)=>{
    const {_id:{year,month},count} = item;
    const date = moment().month(month-1).year(year).format("MMM Y");
    return {date,count}
  }).reverse();

  res.status(200).json({ totalJobs: stats.length, defaultStats, monthlyApllication});
}

// aggregate will be the function of arrays which will contain multiple queries
