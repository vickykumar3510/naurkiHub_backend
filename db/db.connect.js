const mongoose = require("mongoose")
require("dotenv").config()

const mongoUri = process.env.MONGODB

const connectDB = async() => {
    try{
        //Ab await mongoose ke saath isliye likha, kyunki mongoose.connect internet pe database se baat karta hai, jisme time lagta hai. Woh ek promise return karta hai, matlab “main baad mein result dunga”. Agar await na likho, to agli line, jo “Successfully connected” print karti hai, turant chal jayegi, chahe connection abhi bana hi na ho, aur errors catch block mein pakde hi nahi jayenge.
        //Await sirf unhi cheezon ke saath lagta hai jo promise return karti hain, aur database ka connect, save, find, sab aise hi hain.
        //IMPORTANT - If a line doesn’t go to the database, an API, or anything else that returns a promise, write it as a normal line, no await needed (like in index.js we used await in APIs because that line are going to database to get something). AND await only us line of code and uske baad k return ki line ya try and catch ko rokta hai baki poore app ko nahi. baki poora app chlta rehta h. jaha jaha asyn await, sirf uski return rokte h jb tk promise ka result nhi a jata
        await mongoose.connect(mongoUri)
        console.log("Successfully connected to database")

    }catch(error){
        console.log("Error while connecting to database", error.message)
    }
}

module.exports = {connectDB}