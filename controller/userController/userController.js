const catchAsyncError = require("../../middleware/catchAsyncError");
const { find } = require("../../models/alluser");
const AllUser = require("../../models/alluser");
const User = require("../../models/userModel/userSchema");

const ErrorHander = require("../../utils/errorhander");
const sendToken = require("../../utils/jwtToken");




// create user
exports.createUserAccount = catchAsyncError(async (req, res, next) => {

  const user  = await AllUser.findOne({phone:req.body.phone})
  if(user){
   user.name= req.body.name
   user.email= req.body.email
   user.password= req.body.password

  }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              

await user.save() 
  res.status(200).json({
    success:true,
    user
  })
   
});









// login or signup user user 

exports.loginuser = catchAsyncError(async (req, res, next) => {
  const {name,email, phone,otp_mobile } = req.body;

const user  = await AllUser.findOne({phone:phone}).select(
  "+otp_mobile"
)


if(user){
  if(user.role==="user"){
   
      const isOtpMatched = await user.verifyOtp(otp_mobile);
  
      if (!isOtpMatched) {
        return next(new ErrorHander("otp does not match"));
      }
  
      sendToken(user, 201, res);
}
}
else{
  const user =await AllUser.create({ 
    phone,
    otp_mobile,
     });
      
        sendToken(user, 200, res);
}



 
});





// logout user\
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("flippyseven_user_token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "logged out succesfully",
  });
});


// user profile

exports.getUserDetails =catchAsyncError (async (req,res,next)=>{
    const user = await AllUser.findById(req.user.id)

  res.status(200).json({
    success:true,
    user
})


   
})


// update user password
exports.updatePassword = catchAsyncError(async (req,res,next)=>{
    const user = await AllUser.findById(req.user.id).select("+password")
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    if(!isPasswordMatched){
 return next(new ErrorHander("Old Password is not correct",400))
    }
if(req.body.newPassword !== req.body.confirmPassword){
    return next(new ErrorHander("password does not match",400))
}
user.password = req.body.newPassword
await user.save()
sendToken(user,200,res)

})

exports.updateProfile =catchAsyncError( async(req,res,next)=>{
    const newUserData = {
        name : req.body.name,
        email : req.body.email,
        phone : req.body.phone
    }
    
    const user = await AllUser.findByIdAndUpdate(req.user.id,newUserData, {new:true,runValidators:true})
    
    res.status(200).json({
        success:true,
        user
    })
})







// addresss----------------------------------------



// mangage address or add new address
exports.manageAddress= catchAsyncError(async (req, res, next) => {
  const useralldetails = await User.findOne({userProfile:req.user.id})


const userAddress = {
  userProfile:req.user.id,
 address:[
  {
    address_line:req.body.address_line,
  email_address: req.body.email_address,
  phone:req.body.phone,
  country:req.body.country,
  state:req.body.country,
  city:req.body.city,
  zip_code:req.body.zip_code
  }
 ]

}


if(useralldetails){
  const new_address = await User.findOneAndUpdate(
    { userProfile:req.user.id },
    { $push: { address: userAddress.address[0] } },
    { new: true, runValidators: true }
  );
  res.status(201).json({
    success: true,
    new_address,
  });
}
else{
  const userDetails = await User.create(userAddress)

  res.status(200).json({
    success:true,
    userDetails

  })
}


});





// update manage address
exports.updateManageAddress = catchAsyncError(async (req,res,next)=>{
    const user = await User.findOne( {userProfile:req.user.id })
  if(user){
    user.address.forEach((elem)=>{
      if(elem._id==req.params.id){
         elem.address_line = req.body.address_line
         elem.email_address = req.body.email_address
         elem.phone =req.body.phone
         elem.country=req.body.country
         elem.state=req.body.state
         elem.city=req.body.city
         elem.zip_code=req.body.zip_code

      } 
  
     
      })
      await user.save()
   
         res.status(200).json({
           success:true,
           user
         })
       
  }
    

})



// delete address
exports.deleteManageAddress = catchAsyncError(async (req,res,next)=>{
    const getUser = await User.findOneAndUpdate(
      {userProfile:req.user.id },
      { $pull: { address: {_id:req.params.id}} },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success:true,
    })
    

})










// bank ---------------------

// Add Bank Details
exports.addBankDetails  = catchAsyncError(async(req,res,next)=>{
  const useralldetails = await User.findOne({userProfile:req.user.id})
  const userBankDetails = {
    userProfile:req.user.id,
   bank_details:[
    {
      acc_holder_name:req.body.acc_holder_name,
      acc_number: req.body.acc_number,
      ifsc_code:req.body.ifsc_code,
   
    }
   ]
  
  }

  if(useralldetails){
    const new_bank_details = await User.findOneAndUpdate(
      { userProfile:req.user.id },
      { $push: { bank_details: userBankDetails.bank_details[0] } },
      { new: true, runValidators: true }
    );
    res.status(201).json({
      success: true,
      new_bank_details,
    });
  }
  else{
    const userBankAccountDetails = await User.create(userBankDetails)
  
    res.status(200).json({
      success:true,
      userBankAccountDetails
  
    })
  }


})



// update bank details
exports.updateBankDetails = catchAsyncError(async (req,res,next)=>{
  const user = await User.findOne( {userProfile:req.user.id })
if(user){
  user.bank_details.forEach((elem)=>{
    if(elem._id==req.params.id){
       elem.acc_holder_name = req.body.acc_holder_name
       elem.acc_number = req.body.acc_number
       elem.ifsc_code =req.body.ifsc_code
       

    } 

   
    })
    await user.save()
 
       res.status(200).json({
         success:true,
         user
       })
     
}
  

})



// delete bank details
exports.deleteBankDetails = catchAsyncError(async (req,res,next)=>{
  const getAndDeleteBank = await User.findOneAndUpdate(
    {userProfile:req.user.id },
    { $pull: { bank_details: {_id:req.params.id}} },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success:true,
  })
  

})




// get all Bank Account , manange address
exports.getAllUserDetails = catchAsyncError(async (req,res,next)=>{
const allUserDetails = await User.findOne({userProfile:req.user.id})
res.status(200).json({
  success:true,
  allUserDetails
})
})























