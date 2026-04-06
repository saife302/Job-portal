import Company from '../models/Company.model.js'
import bcrypt, { genSalt } from 'bcrypt'
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import generateToken from '../utils/generateToken.js';
import Job from '../models/Job.model.js';
import JobApplication from '../models/JobApplication.model.js';
import nodemailer from 'nodemailer';
import { sendMail } from '../utils/mailer.js';
import fs from 'fs';


// Register a new compeny
const registerCompany = async (req, res) => {
    const { name, email, password } = req.body;

    const imageFile = req.file;

    if(!name || !email || !password){
        return res.status(400).json({success: false, message: "Missing details"});
    }

    try {
        const existingCompany = await Company.findOne({ email })
        if (existingCompany) {
            return res.status(400).json({ success: false, message: 'Email already registered' })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path);

        const company = await Company.create({
            name,
            email,
            password: hashedPassword,
            image: imageUpload.secure_url
        })

        res.status(201).json({
            success: true,
            message: 'Company registered successfully',
            token: generateToken(company._id),
            company: {
                id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            }
        })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}





const loginCompany = async (req, res) => {
    const { email, password } = req.body

    try {
        const company = await Company.findOne({ email })
        if (!company) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' })
        }

        const isMatch = await bcrypt.compare(password, company.password)
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' })
        }

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token:generateToken(company._id),
            company: {
                id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            }
        })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getCompanyData = async (req, res) => {
    try {
        const company = req.company;

        const jobsPosted = await Job.countDocuments({ companyId: company._id });
        const applicants = await JobApplication.countDocuments({ companyId: company._id });
        const hired = await JobApplication.countDocuments({ companyId: company._id, status: 'Accepted' });

        const companyData = {
            _id: company._id,
            name: company.name,
            email: company.email,
            image: company.image,
            jobsPosted,       
            applicants,       
            hired             
        };

        res.status(200).json({ success: true, company: companyData });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}






const postJob= async(req,res)=>{
    try {
    const { title, description, location, salary, level, category } = req.body;

    if (!title || !description || !location || !salary || !level || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const job = new Job({
      title,
      description,
      location,
      salary,
      level,
      category,
      companyId: req.company._id 
    });

    await job.save();

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }

};






const getCompanyJobApplicants = async(req,res)=>{
    try {
        const companyId = req.company._id;

        const applications = await JobApplication.find({ companyId })
            .populate('userId', 'name email profilePic resume')
            .populate('jobId', 'title location level salary')
            .sort({ date: -1 });

        res.status(200).json({ success: true, applications });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}


const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.company._id;

    
    const jobs = await Job.aggregate([
      { $match: { companyId: companyId } },
      {
        $lookup: {
          from: "jobapplications",
          localField: "_id",
          foreignField: "jobId",
          as: "applicantsList"
        }
      },
      {
        $addFields: {
          applicants: { $size: "$applicantsList" } 
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json({ success: true, jobsData: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}




const changeJobApplicationsStatus = async(req,res)=>{
    try {
        const { applicationId, status } = req.body;

        if (!applicationId || !status) {
            return res.status(400).json({ success: false, message: "Application ID and status are required" });
        }

        const validStatuses = ['Pending', 'Accepted', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        const application = await JobApplication.findById(applicationId);

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        // Make sure only the company that owns the job can change status
        if (application.companyId.toString() !== req.company._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        application.status = status;
        await application.save();

        res.status(200).json({
            success: true,
            message: `Application ${status}`,
            application
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const changeVisibility = async(req,res)=>{
    try {
    const { id } = req.body;

   
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const companyId = req.company._id;

   
    const job = await Job.findById(id);

   
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

   
    if (companyId.toString() !== job.companyId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

   
    job.visible = !job.visible;

   
    await job.save();

    res.status(200).json({
      success: true,
      message: "Job visibility updated",
      job,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}




const scheduleInterview = async (req, res) => {
    try {
        const { applicationId, date, time } = req.body;
        const companyId = req.company._id;

        const application = await JobApplication.findById(applicationId)
            .populate('userId', 'name email')
            .populate('jobId', 'title');

        if (!application || application.companyId.toString() !== companyId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized or application not found" });
        }

        const interviewLink = `${process.env.CLIENT_URL}/interview/${applicationId}`;
        const interviewDateTime = new Date(`${date}T${time}`);

        application.status = 'Interview Scheduled';
        application.interviewDate = interviewDateTime;
        application.interviewLink = interviewLink;
        await application.save();

        await sendMail({
            to: application.userId.email,
            subject: `Interview Scheduled: ${application.jobId.title}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #2563eb; margin-bottom: 20px;">Interview Invitation</h2>
                    <p style="color: #333; font-size: 16px;">Hi <strong>${application.userId.name}</strong>,</p>
                    <p style="color: #475569; font-size: 15px; line-height: 1.5;">
                        Good news! Your application for the <strong>${application.jobId.title}</strong> position has progressed, and we would like to invite you to a video interview.
                    </p>
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2563eb;">
                        <p style="margin: 0 0 10px 0; color: #333; font-size: 15px;"><strong>Date & Time:</strong><br/> ${interviewDateTime.toLocaleString()}</p>
                        <p style="margin: 0; color: #333; font-size: 15px;"><strong>Video Link:</strong><br/> 
                            <a href="${interviewLink}" style="color: #ffffff; background-color: #2563eb; padding: 8px 15px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 5px;">Join the Meeting</a>
                        </p>
                    </div>
                    <p style="color: #475569; font-size: 15px;">Please try to join 5 minutes early. We look forward to speaking with you!</p>
                    <p style="color: #94a3b8; font-size: 14px; margin-top: 30px;">Best regards,<br/>The Hiring Team</p>
                </div>
            `
        });

        res.status(200).json({
            success: true,
            message: 'Interview scheduled & email sent successfully!',
            application
        });

    } catch (error) {
        console.error("Scheduling Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to schedule interview"
        });
    }
};

// Update Company Profile 
const updateCompanyProfile = async (req, res) => {
    try {
        const companyId = req.company._id;
        const { name } = req.body;
        const imageFile = req.file;

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }

       
        if (name) {
            company.name = name;
        }

        
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                folder: 'company_logos'
            });
            company.image = imageUpload.secure_url;
            
           
            fs.unlinkSync(imageFile.path);
        }

        await company.save();

        res.status(200).json({
            success: true,
            message: "Company profile updated successfully",
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            }
        });

    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}




const deleteJob = async (req, res) => {
    try {
        const { jobId } = req.body; 
        const companyId = req.company._id; 

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ 
                success: false, 
                message: 'Job not found' 
            });
        }

        
        if (job.companyId.toString() !== companyId.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: 'Unauthorized: You can only delete your own job postings' 
            });
        }

        
        await Job.findByIdAndDelete(jobId);

        res.status(200).json({ 
            success: true, 
            message: 'Job deleted successfully' 
        });

    } catch (error) {
        console.error("Delete Job Error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}



export { registerCompany, loginCompany, getCompanyData,postJob, getCompanyJobApplicants,getCompanyPostedJobs, changeJobApplicationsStatus,changeVisibility, scheduleInterview, updateCompanyProfile, deleteJob }