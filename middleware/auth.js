const AllUser = require("../models/alluser")
const jwt  = require("jsonwebtoken")
const ErrorHander = require("../utils/errorhander")
const catchAsyncError = require("../middleware/catchAsyncError")

// user Authentication
exports.isAuthenticatedUser = catchAsyncError(async(req,res,next)=>{
    const token =req.cookies.flippyseven_user_token;
    if(!token){
        return next(new ErrorHander("please login first", 401))
    }
    const decodedata = jwt.verify(token,process.env.JWT_SECRET)
    req.user = await AllUser.findById(decodedata.id)
    next()
})


// Admin Authentication
exports.isAuthenticatedAdmin = catchAsyncError(async(req,res,next)=>{
    const admintoken =req.cookies.flippyseven_admin_token;   
    if(!admintoken){
        return next(new ErrorHander("please login first", 401))
    }
    const decodedata = jwt.verify(admintoken,process.env.JWT_SECRET_ADMIN)
    req.admin = await AllUser.findById(decodedata.id)
    next()
})





// Supplier Authentication 

exports.isAuthenticatedSupplier = catchAsyncError(async(req,res,next)=>{
    const suppliertoken =req.cookies.flippyseven_supplier_token;   
    if(!suppliertoken){
        return next(new ErrorHander("please login first", 401))
    }
    const decodedata = jwt.verify(suppliertoken,process.env.JWT_SECRET_SUPPLIER)
    req.supplier = await AllUser.findById(decodedata.id)
    next()
})




exports.authorizeRoles = (...roles) =>{
    return (req,res,next) =>{
        if(!roles.includes(req.admin.role)){
            return next(new ErrorHander(`Role:${req.admin.role} is not allowed for this resources`,403))
        }
        next();
    }
   
}

