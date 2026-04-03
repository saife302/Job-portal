import express from 'express';
import upload from '../config/multer.js';
import { applyForJob, getUserData, getUserJobApplications, updateUserResume, updateProfile } from '../controllers/user.controller.js';
import { userAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

//get user data
router.get('/user',userAuth,getUserData);

//apply for job
router.post('/apply',userAuth,applyForJob);

//get applied job data
router.get('/applications',userAuth, getUserJobApplications);

//update user profile
router.post('/update-resume',userAuth, upload.single('resume'),updateUserResume);

//update user profile
router.post('/update-profile', userAuth, upload.single('profilePic'), updateProfile);

export default router;
