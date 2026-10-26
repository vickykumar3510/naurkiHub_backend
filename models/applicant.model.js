const mongoose = require("mongoose")

const applicantSchema = new mongoose.Schema({
    //applicant ke andar jo user field hai, usme jo ID store hoti hai, woh exactly wahi hoti hai jo User collection mein us user ke document ka _id hai. Isi match ki wajah se populate kaam karta hai. Mongoose applicant ke user field ki ID leta hai, User collection mein wahi _id dhoondhta hai, aur us user ka data wapas laata hai.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    profilePhoto: {
        type: String
    },
    bio: {
        type: String
    },
    experience: {
        type: String
    },
    resume: {
        type: String
    },
    skills: {
        type: [String]
    },
    education: {
        type: String,
        enum: ["Undergraduate", "Postgraduate"]
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Applicant", applicantSchema)