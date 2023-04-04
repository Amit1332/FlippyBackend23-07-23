const app= require('./app')
const DatabaseConn = require("./config/database")
const cloudinary = require("cloudinary");






const dotenv =require("dotenv")
dotenv.config({path:"./config/config.env"})
const PORT = process.env.PORT

DatabaseConn()
    

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const server = app.listen(PORT, ()=>{
    console.log("connection succesfull")
}) 

 
