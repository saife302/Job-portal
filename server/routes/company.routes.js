import express from 'express';
import {changeJobApplicationsStatus, changeVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany} from '../controllers/company.controller.js';
import upload from '../config/multer.js';
import { companyAuth } from '../middleware/auth.middleware.js';


const router = express.Router();

//register company
router.post('/register',upload.single('image'), registerCompany);

//login company
router.post('/login', loginCompany);

//get company data
router.get('/company',companyAuth, getCompanyData);

//post a job
router.post('/post-job',companyAuth, postJob);

//Get applicants data of company
router.get('/applicants',companyAuth, getCompanyJobApplicants);

//get company job list
router.get('/list-jobs',companyAuth, getCompanyPostedJobs);

//change applications status
router.post('/change-status',companyAuth, changeJobApplicationsStatus);

// change applications  visibility
router.post('/change-visibility',companyAuth, changeVisibility);


export default router;
