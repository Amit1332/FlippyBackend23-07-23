const catchAsyncError = require("../../middleware/catchAsyncError");
const permanentDeleteSupplier = require("../../models/adminModel/permanentDeleteSupplierSchema");
const AllUser = require("../../models/alluser");
const Supplier = require("../../models/supplierModel/supplierSchema");
const ErrorHander = require("../../utils/errorhander");
const sendToken = require("../../utils/jwtToken");
const sendEmail = require("../../utils/sendEmail");
const sendSupplierToken = require("../../utils/supplierJwtToken");
const fast2sms = require('fast-two-sms')
const crypto  = require("crypto")



exports.sendOtpByNumber = catchAsyncError(async(req,res,next)=> {
 optRandomvalue = Math.floor(Math.random() * 1000000);
 const phone = req.body.phone
 console.log(phone);

const isExistPhone = await AllUser.findOne({phone})
if(isExistPhone){
  return next(new ErrorHander("Mobile Number is Already Registered", 401))
}
else{
var options = {authorization : process.env.FAST2SMS_API_KEY , message : `ShopBist# Verify Your Otp : ${optRandomvalue}` ,  numbers : [`${phone}`]}
const otpSend = await fast2sms.sendMessage(options)
const getSupplierByEmail = await AllUser.findOne({email:req.body.email})
if(getSupplierByEmail){
  getSupplierByEmail.phone = req.body.phone
  getSupplierByEmail.otp_mobile =optRandomvalue
  getSupplierByEmail.role ="supplier"
  getSupplierByEmail.otp_mobile_expiry = new Date(Date.now() + process.env.OTP_MOBILE_EXPIRE * 60 * 1000),
 await getSupplierByEmail.save()
}

else{
const supplier = await AllUser.create({
 phone:req.body.phone,
 otp_mobile :optRandomvalue,
 role :"supplier",
 otp_mobile_expiry : new Date(Date.now() + process.env.OTP_MOBILE_EXPIRE * 60 * 1000),
})
sendSupplierToken(supplier, 201, res);
}


res.status(200).json({
 success:true,
 isExistPhone,
 message: `Otp sent to ${req.body.phone} successfully`,
})  

}
 
})

exports.verifyNumber = catchAsyncError(async(req,res,next)=> {
  const supplier = await AllUser.findById(req.supplier.id).select("+otp_mobile")
    const otp_mobile = req.body.otp_mobile
    if (supplier.otp_mobile != otp_mobile || supplier.otp_mobile_expiry < Date.now() ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP or has been Expired" });
    }

    supplier.otp_mobile = null;
    supplier.otp_mobile_expiry  = null;

    await supplier.save();

res.status(200).json({
  succes:true,
  msg:"Account Verified"
}) 

})

exports.verifyEmail = catchAsyncError(async(req,res,next)=> {
  const supplier = await AllUser.findById(req.supplier.id).select("+otp_email")
  const otp_email = req.body.otp_email

  if (supplier.otp_email != otp_email || supplier.otp_email_expiry < Date.now()) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid OTP or has been Expired" });
  }
 
  supplier.otp_email = null;
  supplier.otp_email_expiry  = null;

  await supplier.save();

res.status(200).json({
succes:true,
msg:"Account Verified"
}) 



})


exports.sendOtpByEmail = catchAsyncError(async(req,res,next)=> {
  optRandomvalue = Math.floor(Math.random() * 1000000);
  const email = req.body.email
  console.log(email);
 const isExistEmail = await AllUser.findOne({email})
 if(isExistEmail){
  return next(new ErrorHander("Email is Already Registered", 401))
 }
 else{

const message = `Your Otp is :- \n\n  ${optRandomvalue} \n\nIf you have not requested this email then, please ignore it.`;
const getSupplierByPhone = await AllUser.findOne({phone:req.body.phone})
await sendEmail({
  email: req.body.email,
  subject: `shopBist Email Verification`,
  message,
});
if(getSupplierByPhone){
  getSupplierByPhone.email = req.body.email
  getSupplierByPhone.otp_email =optRandomvalue
  getSupplierByPhone.role ="supplier"
  getSupplierByPhone.otp_email_expiry = new Date(Date.now() + process.env.OTP_EMAIL_EXPIRE * 60 * 1000),
  await getSupplierByPhone.save()
}

else{
const supplier = await AllUser.create({
  email:req.body.email,
  otp_email :optRandomvalue,
  role :"supplier",
  otp_email_expiry : new Date(Date.now() + process.env.OTP_EMAIL_EXPIRE * 60 * 1000),
})
sendSupplierToken(supplier, 201, res);

}

 res.status(200).json({
  success:true,
  isExistEmail,
  message: `Email sent to ${req.body.email} successfully`,
})  

 }

})





// Supplier registration-------------------------------
exports.signupSupplier = catchAsyncError(async (req, res, next) => {
  const {email, phone, password } = req.body;
const deletedSupplier  =await permanentDeleteSupplier.find()
const supplierEmail = deletedSupplier.find(element => element.supplier.email===email)
const supplierPhone = deletedSupplier.find(element => element.supplier.phone===phone)

if(supplierEmail){

  return next(new ErrorHander("Your Supplier Account is Permanent Deleted ! Email Id ", 400))
}
else if(supplierPhone){
  return next(new ErrorHander("Your supplier Account is Permanent Deleted ! Phone No.", 400))

}
else{
   const supplier = await AllUser.findOne({ $or: [{ email }, { phone }] }).select("+password");

  
   supplier.password=password
   supplier.verified=true
   await supplier.save()

    sendSupplierToken(supplier, 200, res); 
}
     
   


});

// Supplier login -------------------------------
exports.supplierLogin = catchAsyncError(async (req, res, next) => {
    const { email, phone, password } = req.body;
  
    if (!password) {
      return next(new ErrorHander("please enter email or phone and passwrod", 400));
    } else if (email || phone) {
      const supplier = await AllUser.findOne({ $or: [{ email }, { phone }] }).select(
        "+password"
      );
      if(!supplier){
        return next(new ErrorHander("Invalid Supplier Credential",401))
      }
  
      if (supplier.role === "supplier") {
        if (!supplier) {
          return next(new ErrorHander("Invalid email or password", 401));
        }
  
        const isPasswordMatched = await supplier.comparePassword(password);
  
        if (!isPasswordMatched) {
          return next(new ErrorHander("password does not match"));
        }
  
        sendSupplierToken(supplier, 201, res);
      } else {
        return next(new ErrorHander("supplier does not exist"));
      }
    } else {
      return next(new ErrorHander("please enter all field", 401));
    }
  });


  //  supplier profile --------------------------

  exports.getSupplierDetails =catchAsyncError (async (req,res,next)=>{
    const supplier = await AllUser.findById(req.supplier.id)

      res.status(200).json({
        success:true,
        supplier
    })
  

   
})


// logout Supplier

exports.SupplierLogout = catchAsyncError(async (req, res, next) => {
  res.cookie("flippyseven_supplier_token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "logged out succesfully",
  });
});


// update Supplier password

exports.updateSupplierPassword = catchAsyncError(async (req,res,next)=>{
  const supplier = await AllUser.findById(req.supplier.id).select("+password")
  const isPasswordMatched = await supplier.comparePassword(req.body.oldPassword)
  if(!isPasswordMatched){
return next(new ErrorHander("Old Password isnot correct",400))
  }
if(req.body.newPassword !== req.body.confirmPassword){
  return next(new ErrorHander("password does not match",400))
}
supplier.password = req.body.newPassword
await supplier.save()
sendSupplierToken(supplier,200,res)

})







// Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const supplier = await AllUser.findOne({ email: req.body.email });

  if (!supplier) {
    return next(new ErrorHander("Supplier not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = supplier.getResetPasswordToken();

  await supplier.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: supplier.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${supplier.email} successfully`,
    });
  } catch (error) {
    supplier.resetPasswordToken = undefined;
    supplier.resetPasswordExpire = undefined;

    await supplier.save({ validateBeforeSave: false });

    return next(new ErrorHander(error.message, 500));
  }
});


// Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const supplier = await AllUser.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!supplier) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not password", 400));
  }

  supplier.password = req.body.password;
  supplier.resetPasswordToken = undefined;
  supplier.resetPasswordExpire = undefined;

  await supplier.save();

  sendSupplierToken(supplier, 200, res);
});








// update Supplier profile
exports.updateSupplierProfile =catchAsyncError( async(req,res,next)=>{
  const newSupplierData = {
      name : req.body.name,
      email : req.body.email,
      phone : req.body.phone
  }
  
  const supplier = await AllUser.findByIdAndUpdate(req.supplier.id,newSupplierData, {new:true,runValidators:true})
  
  res.status(200).json({
      success:true,
      supplier
  })
})






// register complete Supplier details   no use now
exports.registerAllSupplierdetails = catchAsyncError(async (req, res, next) => {
//   const supplieralldetails = await Supplier.findOne({supplierProfile:req.supplier.id})

// if(supplieralldetails){
//    return next (new ErrorHander("you have filled your details only you can update"))

// }
// else{
  const supplier = await Supplier.create({
    // supplierProfile:req.supplier.id,
    gst:req.body.gst, 
    pan:req.body.pan,
    pickup_address:{
      house_no:req.body.house_no, 
      street:req.body.street,
      landmark:req.body.landmark,
      postal_code:req.body.postal_code,
      city:req.body.city,
      state:req.body.state,
    },
    bank_details:{
      account_number:req.body.account_number,
      ifsc_code:req.body.ifsc_code
    },
    // supplier_details:{
    //   store_name:req.body.store_name,
    //   your_name:req.body.your_name
    // }

   
 
  });
  console.log(req.body);
  res.status(200).json({
    success:true,
    msg:"supplier details submitted",  
    supplier  
  })
// }



});







// update complete supplier details
exports.updateGstSupplierdetails = catchAsyncError(async (req, res, next) => {
  const updatesupplierdata= {
    supplierProfile:req.supplier.id,
    gst:req.body.gst,
    pan:req.body.pan, 
    pickup_address:{
      house_no:req.body.house_no, 
      street:req.body.street,
      landmark:req.body.landmark,
      postal_code:req.body.postal_code,
      city:req.body.city,
      state:req.body.state,
    },
    bank_details:{
      account_number:req.body.account_number,
      ifsc_code:req.body.ifsc_code
    },
    supplier_details:{
      store_name:req.body.store_name,
      your_name:req.body.your_name
    }
  }

  const  supplierDetails  = await Supplier.findOne({supplierProfile:req.supplier.id})
 if(supplierDetails){
  const updatedSupplierDetails = await Supplier.findOneAndUpdate({supplierProfile:req.supplier.id},updatesupplierdata, {new:true,runValidators:true})
  res.status(200).json({
    success:true,
    msg:"supplier details submitted",  
    supplierDetails ,
    updatedSupplierDetails
  })
 }
 else{
const addSupplierDetails = await Supplier.create(updatesupplierdata)
res.status(200).json({
  success:true,
  msg:"supplier details submitted",  
  addSupplierDetails
})
 }
  


});





// update  Supplier bank details
exports.updateSupplierBankdetails = catchAsyncError(async (req, res, next) => {
  const updatesupplierdata= {
    bank_details:{
      account_number:req.body.account_number,
      ifsc_code:req.body.ifsc_code
    },
   
  }

  const  supplierDetails  = await Supplier.findOne({supplierProfile:req.supplier.id})
  const updatedSupplierDetails = await Supplier.findOneAndUpdate({supplierProfile:req.supplier.id},updatesupplierdata, {new:true,runValidators:true})
  res.status(200).json({
    success:true,
    msg:"supplier details submitted",  
    supplierDetails ,
    updatedSupplierDetails
  })


});





// update  Supplier Address details
exports.updateSupplierAddressdetails = catchAsyncError(async (req, res, next) => {
  const updatesupplierdata= {
    pickup_address:{
      house_no:req.body.house_no, 
      street:req.body.street,
      landmark:req.body.landmark,
      postal_code:req.body.postal_code,
      city:req.body.city,
      state:req.body.state,
    },
   
  }

  const  supplierDetails  = await Supplier.findOne({supplierProfile:req.supplier.id})
  const updatedSupplierDetails = await Supplier.findOneAndUpdate({supplierProfile:req.supplier.id},updatesupplierdata, {new:true,runValidators:true})
  res.status(200).json({
    success:true,
    msg:"supplier details submitted",  
    supplierDetails ,
    updatedSupplierDetails
  })


});






// update  Supplier supplier shop details
exports.updateSupplierShopdetails = catchAsyncError(async (req, res, next) => {
  const updatesupplierdata= {
    supplier_details:{
      store_name:req.body.store_name,
      your_name:req.body.your_name
    }
   
  }

  const  supplierDetails  = await Supplier.findOne({supplierProfile:req.supplier.id})
  const updatedSupplierDetails = await Supplier.findOneAndUpdate({supplierProfile:req.supplier.id},updatesupplierdata, {new:true,runValidators:true})
  res.status(200).json({
    success:true,
    msg:"supplier details submitted",  
    supplierDetails ,
    updatedSupplierDetails
  })

});





// get all complete Supplier details
exports.AlldetailsOfSupplier = catchAsyncError(async (req, res, next) => {
const supplieralldetails = await Supplier.findOne({supplierProfile:req.supplier.id}).populate("supplierProfile")

if(!supplieralldetails){
  return next(new ErrorHander("Incomplete details"))
}
res.status(200).json({
  success:true, 
  supplieralldetails
}) 
 
}) ;
 
 





