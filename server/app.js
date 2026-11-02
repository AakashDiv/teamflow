
require("dotenv").config()
const express = require("express");

const app = express();

const connectDB = require('./config/db/connection');
const { default: mongoose } = require("mongoose");

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

const server = async(URI)=>{
      try {
        if(!URI){
            throw new Error("mongose URI missing")
        }
          await connectDB(URI)

       const serverInstance = app.listen(PORT, ()=>{
              console.log(`server running http://localhost:${PORT}`)
          })


          const shutdown = (async()=>{
               console.log("Shutting down server..")
               serverInstance.close(async()=>{
                    await connectDB.disconnect();
                    process.exit(0)
               })
          })

          process.on("SIGTERM", shutdown)
          process.on("SIGINT", shutdown)



      } catch (error) {
         console.log("failed to start server", error);
         process.exit(1);
      }
}

server();