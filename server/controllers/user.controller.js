import User from '../models/user.model.js'
import JobApplication from '../models/JobApplication.model.js';
import Job from '../models/Job.model.js';
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'



//get user data
export const getUserData = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



//apply for a job
export const applyForJob =async(req,res)=>{
  try {
    const { jobId } = req.body;
    const userId = req.user._id;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required"
      });
    }

    
    const alreadyApplied = await JobApplication.findOne({ jobId, userId });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "Already applied to this job"
      });
    }

    const jobData = await Job.findById(jobId);

    if(!jobData){
      return res.json({success:false, message:"job not found"})
    }

     const application = await JobApplication.create({
       companyId: jobData.companyId,
       userId,
       jobId,
       date: Date.now()
    });

    res.status(201).json({
      success: true,
      message: "Applied successfully",
      application
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}





//get user applied applications
export const getUserJobApplications = async(req,res)=>{
  try {
        const userId = req.user._id; 

        const applications = await JobApplication.find({ userId })
            .populate('jobId', 'title description location salary level category')
            .populate('companyId', 'name email image ')
            .sort({ date: -1 })
            .exec();

            if(!applications){
              return res.json({success:false, message:'No job application found'})
            }

        res.status(200).json({ success: true, applications });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


//update user resume
export const updateUserResume = async(req,res)=>{
         const userId = req.user._id;
         const resumeFile = req.file;

  if (!resumeFile) {
    return res.status(400).json({
      success: false,
      message: "No resume file provided"
    });
  }

  try {
    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const resumeUpload = await cloudinary.uploader.upload(resumeFile.path, {
      resource_type: 'raw',
      folder: 'resumes'
    });

    userData.resume = resumeUpload.secure_url;

    await userData.save();

    fs.unlinkSync(resumeFile.path);

    return res.json({
      success: true,
      message: "Resume Updated",
      user: {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        resume: userData.resume
      }
    });

  } catch (error) {
    console.error("Error in updateUserResume:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }

}




// update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name } = req.body;
    const profilePicFile = req.file;

   
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    
    if (name) {
      userData.name = name;
    }

 
    if (profilePicFile) {
   
      const imageUpload = await cloudinary.uploader.upload(profilePicFile.path, {
        folder: 'user_profiles' 
      });
      
      userData.profilePic = imageUpload.secure_url;
      
      fs.unlinkSync(profilePicFile.path);
    }
    await userData.save();


    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user: {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        profilePic: userData.profilePic,
        resume: userData.resume
      }
    });

  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};