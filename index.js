const express = require("express")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const bcrypt = require("bcryptjs")
const cors = require("cors")
require("dotenv").config()
const {connectDB} = require("./db/db.connect")
const User = require("./models/user.model")
const Applicant = require("./models/applicant.model")
const Recruiter = require("./models/recruiter.model")
const PostJob = require("./models/postJob.model")

const app = express()
connectDB()

app.use(cors())
app.use(express.json())

const JWT_SECRET = process.env.JWT_SECRET


//checking api
app.get("/", (req, res) => {
    res.send("naurkiHub API is working")
})

//JWT middleware
function verifyJWT(req, res, next){
    const authHeader = req.headers['authorization']

    if(!authHeader){
        return res.status(401).json({message: "No token provided"})
    }

    const token = authHeader.split(' ')[1]

    if(!token){
        return res.status(401).json({message: "Malformed token"})
    }

    try{
        const decodedToken = jwt.verify(token, JWT_SECRET)
        req.user = decodedToken

        next()

    }catch(error){
        return res.status(401).json({message: "Invalid token"})
    }
}

//get list of all users
async function getAllUsers(){
    try{
        const user = await User.find()
        return user

    }catch(error){
        throw error
    }
}

app.get("/user", async(req, res) => {
    try{
        const users = await getAllUsers()
        if(users.length !== 0){
            return res.status(200).json(users)
        } else{
            return res.status(404).json({message: "No user found."})
        }

    }catch(error){
        return res.status(500).json({message: "Server error while fetching all the users"})
    }
})

//delete user - make sure when we deleting the user then we have created id on the basis of role as well so we have to delete that as well

//
//recruiter part
//
//create a job
async function postJob(item){
    try{
        const job = await new PostJob(item)
        return job.save()
    }catch(error){
        throw error
    }
}

app.post("/job", verifyJWT, async(req, res) => {
try{
    if(req.user.userRole !== "Recruiter"){
        return res.status(403).json({message: "Only recuriter can post jobs."})
    }

    const recruiter = await Recruiter.findOne({user: req.user.id})
    if(!recruiter){
        return res.status(400).json({message: "Recruiter profile not found."})
    }

    const newJob = await postJob({...req.body, postedBy: recruiter._id})
    if(newJob){
        return res.status(201).json({message: "New job created", newJob})
    } else {
        return res.status(400).json({message: "No job details provided"})
    }
    
}catch(error){
    return res.status(500).json({message: "Internet error while creating a job", error: error.message})
}
})

//edit job


//get all jobs that he created
async function getRecruiterJobs(recuriterId){
    try{
        const jobs = await PostJob.find({postedBy: recuriterId})
        return jobs

    }catch(error){
        throw error
    }
}

app.get("/recruiter/job", verifyJWT, async(req, res) => {
    try{

        if(req.user.userRole !== "Recruiter"){
            return res.status(403).json({message: "Only recruiter can view their jobs"})
        }

        const recruiter = await Recruiter.findOne({user: req.user.id})
        if(!recruiter){
            return res.status(400).json({message: "Recruiter profile not found."})
        }

        const getJob = await getRecruiterJobs(recruiter._id)
        if(getJob.length !== 0){
            return res.status(200).json(getJob)
        } else {
            return res.status(404).json({message: "No job found."})
        }

    }catch(error){
        return res.status(500).json({message: "Server issue while getting the jobs", error: error.message})
    }
})


//
//applicant part
//
//get all the jobs of the entire app
async function getAllJob(){
    try{
        const job = await PostJob.find().populate({
            path: "postedBy",
            populate: {
                path: "user",
                select: "userEmail"
            }
        })
        return job

    }catch(error){
        throw error
    }
}

app.get("/job", async(req, res) => {
    try{
        const jobs = await getAllJob()
        if(jobs.length !== 0){
            return res.status(200).json(jobs)
        } else {
            return res.status(404).json({message: "No job found."})
        }
        
    }catch(error){
        return res.status(500).json({message: "Server error while fetching jobs", error: error.message})
    }
})


//
//signup
async function userSignup(userFullName, userEmail, userPassword, userRole){
    try{
        const email = userEmail.trim().toLowerCase()

        const existingUser = await User.findOne({userEmail: email})

        if(existingUser){
            throw new Error("User already exists.")
        }

        const hashedPassword = await bcrypt.hash(userPassword, 10)

        const user = new User({
            userFullName,
            userEmail: email,
            userPassword: hashedPassword,
            userRole
        })

        const newUser = await user.save()

        if(newUser.userRole === "Recruiter"){
            await Recruiter.create({user: user._id})
        } else if (newUser.userRole === "Applicant"){
            await Applicant.create({user: user._id})
        }
        return user
    }catch(error){
        throw error
    }
}

app.post("/signup", async(req, res) => {
    try{
        const {userFullName, userEmail, userPassword, userRole} = req.body
        const newUser = await userSignup(userFullName, userEmail, userPassword, userRole)

        return res.status(201).json({message: "User has been signup successfully", newUser : {
            id: newUser._id,
            userFullName: newUser.userFullName,
            userEmail: newUser.userEmail,
            userRole: newUser.userRole
        }})

    }catch(error){
        return res.status(500).json({message: "Server error while signup", error: error.message})
    }
})


//login
async function userLogin(userEmail, userPassword){
    try{
        const email = userEmail.trim().toLowerCase()
        const user = await User.findOne({userEmail: email})

        if(!user){
            throw new Error("Email not registered.")
        }

        const isMatch = await bcrypt.compare(userPassword, user.userPassword)
        
        if(!isMatch){
            throw new Error("Invalid password")
        }

        const token = jwt.sign({id: user._id, userRole: user.userRole}, JWT_SECRET, {expiresIn: '24h'})

        return{
            token,
            user: {
                id: user._id,
                userFullName: user.userFullName,
                userEmail: user.userEmail,
                userRole: user.userRole
            }
        }
    }catch(error){
        throw error
    }
}

app.post("/login", async(req, res) => {
    try{
        const {userEmail, userPassword} = req.body
        const login = await userLogin(userEmail, userPassword) 
        return res.status(200).json({message: "Login successfully", token: login.token, user: login.user})
        
    }catch(error){
        return res.status(500).json({message: "Error while login", error: error.message})
    }
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on the PORT, ${PORT}`)
})