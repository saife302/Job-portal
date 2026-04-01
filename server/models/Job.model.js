import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    level: {
        type: String,
        enum: ['Beginner Level', 'Intermediate Level', 'Senior Level'],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    visible: {
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const Job = mongoose.model('Job', jobSchema);
export default Job;