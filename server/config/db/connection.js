
const mongoose = require("mongoose");

const connectDB = async(uri)=>{
    try {
         await mongoose.connect(uri);
         console.log("Connect to database successfully")
    } catch (error) {
        console.log("failed to connect DB");
        throw new Error(error)
    }
}


const disconnectDB = async(uri)=>{
     try {
        await mongoose.disconnect(uri);
        console.log("MongoDB Disconnect Safly")
     } catch (error) {
         throw new Error(error)
     }
}

module.exports = {connectDB, disconnectDB}