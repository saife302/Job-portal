import Company from '../models/Company.model.js'
import bcrypt, { genSalt } from 'bcrypt'
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import generateToken from '../utils/generateToken.js';
import Job from '../models/Job.model.js';
import JobApplication from '../models/JobApplication.model.js'


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

const getCompanyData = async(req,res)=>{
    try {
        const company = req.company;
        res.status(200).json({success:true, company});
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
const getCompanyPostedJobs = async(req,res)=>{
        try {
    const companyId = req.company._id;

    const jobs = await Job.find({ companyId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobsData: jobs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
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

export { registerCompany, loginCompany, getCompanyData,postJob, getCompanyJobApplicants,getCompanyPostedJobs, changeJobApplicationsStatus,changeVisibility }