const express = require("express")
const { adminLogin,getAllUser,getSingleUser,updateStaffRole,deleteUser ,updateUserDetails, adminProfile, adminLogout,getAllStaffRole, getSingleStaff, getDeleteStaff, getAllSeller, getSingleSeller, updateSellerProfileByAdmin, updateSellerAllDetails, getDetailsOfPermanentDeleteSeller, superadminRegistration, newStaffRegistration, AlldetailsOfSeller, permanentDeleteSupplier } = require("../../controller/adminController/adminController")
const { updateSupplierProfile } = require("../../controller/supplierController/supplierController")
const {isAuthenticatedUser, authorizeRoles, isAuthenticatedAdmin} =require("../../middleware/auth")
const Router = express.Router()

Router.route("/superadmin_regsitration").post(superadminRegistration)
Router.route("/admin_login").post(adminLogin)
Router.route('/admin/logout').get(adminLogout)
Router.route("/admin/me").get(isAuthenticatedAdmin, adminProfile)


// users -----------------------
Router.route("/admin/users").get(isAuthenticatedAdmin,authorizeRoles('superadmin','admin','customer_support'), getAllUser)
Router.route("/admin/user/:id").get(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'), getSingleUser)
Router.route("/admin/user/update/:id").put(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'), updateUserDetails)
Router.route("/admin/user/delete/:id").delete(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'), deleteUser)


// staff -------------------------

Router.route("/admin/staff/new/").post(isAuthenticatedAdmin,authorizeRoles('superadmin'),newStaffRegistration)
Router.route("/admin/staff/role/").get(isAuthenticatedAdmin,authorizeRoles('superadmin'), getAllStaffRole)
Router.route("/admin/staff/:id").get(isAuthenticatedAdmin,authorizeRoles('superadmin'), getSingleStaff)
Router.route("/admin/staff/delete/:id").get(isAuthenticatedAdmin,authorizeRoles('superadmin'), getDeleteStaff)
Router.route("/admin/staff/role/:id").put(isAuthenticatedAdmin,authorizeRoles('superadmin'), updateStaffRole)



// seller  -----------------------

Router.route("/admin/seller").get(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'), getAllSeller)
Router.route("/admin/seller/:id").get(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'), getSingleSeller)
Router.route("/admin/seller/all/details/:id").get(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'), AlldetailsOfSeller)

Router.route("/admin/seller/update/profile/:id").put(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'),updateSellerProfileByAdmin)
Router.route("/admin/seller/update/alldetails/:id").put(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'),updateSellerAllDetails)
Router.route("/admin/seller/delete/:id").delete(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'), permanentDeleteSupplier)
Router.route("/admin/seller/permanent/deleted").get(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'), getDetailsOfPermanentDeleteSeller)





 

module.exports =Router

