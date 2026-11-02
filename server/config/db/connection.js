
const mongoose = require("mongoose");

const connectDB = async(uri)=>{
    try {
         await mongoose.connect(uri);
         console.log("Connect to database successfully")
    } catch (error) {
        console.log("failed to connect DB");
        throw error
    }
}

module.exports = connectDB