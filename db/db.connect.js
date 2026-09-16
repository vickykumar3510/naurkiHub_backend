const mongoose = require("mongoose")
require("dotenv").config()

const mongoUri = process.env.MONGODB

const connectDB = async() => {
    try{
        await mongoose
        .connect(mongoUri)
        console.log("Successfully connected to database")

    }catch(error){
        console.log("Error while connecting to database", error.message)
    }
}

module.exports = {connectDB}