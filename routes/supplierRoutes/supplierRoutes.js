const express = require("express")
const {signupSupplier, supplierLogin,SupplierLogout,getSupplierDetails,updateSupplierPassword,updateSupplierProfile,registerAllSupplierdetails,updateAllSupplierdetails,updateSupplierBankdetails,updateSupplierAddressdetails,updateSupplierShopdetails, AlldetailsOfSupplier, updateGstSupplierdetails, verifyNumber, verifyEmail, sendOtpByNumber, sendOtpByEmail, forgotPassword, resetPassword } = require("../../controller/supplierController/supplierController")
const {isAuthenticatedSupplier} =require("../../middleware/auth")
const Router = express.Router()


Router.route("/supplier/otp/number").post(sendOtpByNumber)
Router.route("/supplier/verify/number").post(isAuthenticatedSupplier,verifyNumber)

Router.route("/supplier/otp/email").post(sendOtpByEmail)
Router.route("/supplier/verify/email").post(isAuthenticatedSupplier,verifyEmail)


Router.route("/supplier/signup").post(signupSupplier)
Router.route("/supplier/login").post(supplierLogin)
Router.route('/supplier/logout').get(SupplierLogout)
Router.route("/supplier/password/forgot").post(forgotPassword);
Router.route("/supplier/password/reset/:token").put(resetPassword);

Router.route('/supplier/me').get(isAuthenticatedSupplier, getSupplierDetails)
Router.route("/supplier/me/password/update").put(isAuthenticatedSupplier, updateSupplierPassword)
Router.route("/supplier/me/updateProfile").put(isAuthenticatedSupplier,updateSupplierProfile)
 


Router.route("/supplier/me/fill/complete/details").post(registerAllSupplierdetails)

Router.route("/supplier/me/update/gst/details").put(isAuthenticatedSupplier,updateGstSupplierdetails)  // gst update and create supplier complete details in supplier
Router.route("/supplier/me/update/bank/details").put(isAuthenticatedSupplier,updateSupplierBankdetails) 
Router.route("/supplier/me/update/address/details").put(isAuthenticatedSupplier,updateSupplierAddressdetails)   
Router.route("/supplier/me/update/supplier/shop/details").put(isAuthenticatedSupplier,updateSupplierShopdetails)   






Router.route("/supplier/me/show/complete/details").get(isAuthenticatedSupplier,AlldetailsOfSupplier)


module.exports =Router