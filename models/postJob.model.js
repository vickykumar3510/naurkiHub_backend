const mongoose  = require("mongoose")

const postJobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recruiter",
        required: true,
    },
    employmentType: {
        type: String,
        enum: ["Part-Time", "Full-Time"],
        required: true
    },
    salary: {
        type: Number,
        min: 1,
        required: true
    },
    experience: {
        type: Number,
        min: 0,
        required: true
    },
    responsibilities: {
        type: String
    },
    requiredSkills: {
        type: [String],
        required: true
    },
    jobType: {
        type: String,
        enum: ["Remote", "Onsite", "Hybrid"]
    },
    location: {
        type: String,
        enum: ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi (NCT)", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"]
    },
    applicationDeadline: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["Active", "Archived"],
        default: "Active"
    }
},{
    timestamps: true
})

module.exports = mongoose.model("PostJob", postJobSchema)