
require("dotenv").config()
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");


const app = express();
app.use(morgan('dev'));

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173']

const corsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credential: true,
}

app.use(cors());

const {connectDB, disconnectDB} = require('./config/db/connection');
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");

const ApiResponse = require("./utils/ApiResponse");
const CustomApiError = require('./utils/customApiError');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler')


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));


//Health Check Server
app.get('/api/v1/health', (req, res)=>{
       try {
        const healthData = {
              status: "UP",
              timestamp: new Date().toISOString()
        }

        return  res.status(200).json(new ApiResponse(200, healthData, "Server is healthy"))
       } catch (error) {
          throw new(CustomApiError(404, 'Api not working'))
       }
})

// Test centralized error handling
app.get('/api/v1/test-error', (req, res, next)=>{
        try {
            throw next (new CustomApiError(401, 'test error handler'))
        } catch (error) {
            throw new Error(error)
        }
})

app.use(notFound);
app.use(errorHandler)

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
                    await disconnectDB(URI);
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

server(MONGO_URI);