const mongoose = require("mongoose")

const recruiterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    companyName: {
        type: String
    },
    companyLogo: {
        type: String
    },
    companyWebsite: {
        type: String
    },
    aboutCompany: {
        type: String
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Recruiter", recruiterSchema)