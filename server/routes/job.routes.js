import express from 'express';
import {  getJobById, getJobs } from '../controllers/job.controller.js';

const router = express.Router();

//route to get all job data
router.get('/', getJobs);


//route to get job by Id
router.get('/:id', getJobById)



export default router;