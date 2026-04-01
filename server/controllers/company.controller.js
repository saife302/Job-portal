import Company from '../models/Company.model.js'
import bcrypt, { genSalt } from 'bcrypt'
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import generateToken from '../utils/generateToken.js';
import Job from '../models/Job.model.js';

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

}






const postJob= async(req,res)=>{
    try {
    const { title, description, location, salary, level, category } = req.body;

    // if (!title || !description || !location || !salary || !level || !category) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "All fields are required"
    //   });
    // }

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

}
const getCompanyPostedJobs = async(req,res)=>{

}
const changeJobApplicationsStatus = async(req,res)=>{

}
const changeVisibility = async(req,res)=>{

}

export { registerCompany, loginCompany, getCompanyData,postJob, getCompanyJobApplicants,getCompanyPostedJobs, changeJobApplicationsStatus,changeVisibility }