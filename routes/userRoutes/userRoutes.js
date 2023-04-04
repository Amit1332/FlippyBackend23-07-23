const express = require("express")
const { loginuser, logout, getUserDetails, updatePassword, updateProfile, registerAlldetails, AlldetailsOfUser, UpdateAlldetailsOfUser, createUserAccount, manageAddress, updateManageAddress, deleteManageAddress, getAllManageAddress, addBankDetails, deleteBankDetails, getAllUserDetails, updateBankDetails } = require("../../controller/userController/userController")
const {isAuthenticatedUser} =require("../../middleware/auth")
const Router = express.Router()


Router.route("/create/user/account").post(isAuthenticatedUser,createUserAccount)
Router.route("/login").post(loginuser)
Router.route('/logout').get(logout)
Router.route("/me").get(isAuthenticatedUser, getUserDetails)
Router.route("/me/password/update").put(isAuthenticatedUser, updatePassword)
Router.route("/me/updateProfile").put(isAuthenticatedUser,updateProfile)



// manage address
Router.route("/me/add/address").post(isAuthenticatedUser,manageAddress)
Router.route("/me/update/address/:id").put(isAuthenticatedUser,updateManageAddress)
Router.route("/me/delete/address/:id").delete(isAuthenticatedUser,deleteManageAddress)




// bank
Router.route("/me/add/bank/account").post(isAuthenticatedUser,addBankDetails)
Router.route("/me/update/bank/account/:id").put(isAuthenticatedUser,updateBankDetails)
Router.route("/me/delete/bank/account/:id").delete(isAuthenticatedUser,deleteBankDetails)








// get all user-details - bank,address
Router.route("/me/get/all/user/details").get(isAuthenticatedUser,getAllUserDetails)









module.exports = Router