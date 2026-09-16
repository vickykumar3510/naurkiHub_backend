const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userFullName:{
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true,
        unique: true,
    },
    userPassword: {
        type: String,
        required: true,
    },
    userRole: {
        type: String,
        enum: ["Applicant", "Recruiter"],
        required: true,
    }
},{
    timestamps: true
})

module.exports = mongoose.model("User", userSchema)