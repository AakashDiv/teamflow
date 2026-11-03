
const CustomApiError = require("../utils/customApiError")

const errorHandleer = async(error, req, res , next)=>{
             if(error instanceof CustomApiError){
                   return res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    status:error.statusCode
                   })   
              }

               console.log("unexpected error", error)
 
                return res.status(500).json({
                    success: false,
                    message: "Something Went Wrong"
                })
}

module.exports = errorHandleer