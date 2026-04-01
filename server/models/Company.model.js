import mongoose from 'mongoose'

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    image: {
        type: String,
        default: ''
    }
}, { timestamps: true })

const Company = mongoose.model('Company', companySchema);
export default Company;