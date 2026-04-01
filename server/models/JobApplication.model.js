import mongoose from 'mongoose'

const jobApplicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    resume: {
        type: String,   // Cloudinary URL 
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const JobApplication =  mongoose.model('JobApplication', jobApplicationSchema);
export default JobApplication;