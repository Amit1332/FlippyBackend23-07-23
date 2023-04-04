const express = require("express")
const { addBrandByAdmin, updateBrandByAdmin, getaAllBrandByAdmin, deleteBrandByAdmin, getSingleBrandByAdmin } = require("../../controller/adminController/brandController")
const { createProductByAdmin, updateProductByAdmin, getAllPRoductsByAdmin, deleteProductByAdmin,  getSingleProductByAdmin } = require("../../controller/adminController/productController")
const { authorizeRoles, isAuthenticatedAdmin} =require("../../middleware/auth")
const Router = express.Router()


// Products -----------------------
Router.route("/admin/single/product/:id").get(isAuthenticatedAdmin,authorizeRoles('superadmin','admin',"customer_support"), getSingleProductByAdmin)
Router.route("/admin/all/product").get(isAuthenticatedAdmin,authorizeRoles('superadmin','admin',"customer_support"), getAllPRoductsByAdmin)
Router.route("/admin/update/product/:id").put(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'), updateProductByAdmin)
Router.route("/admin/delete/product/:id").delete(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'),deleteProductByAdmin)



// Brands
Router.route("/admin/add/brands").post(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'),addBrandByAdmin )
Router.route("/admin/all/brands").get(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'),getaAllBrandByAdmin )
Router.route("/admin/single/brands/:id").get(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'),getSingleBrandByAdmin )
Router.route("/admin/update/brands/:id").put(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'),updateBrandByAdmin )
Router.route("/admin/delete/brands/:id").delete(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'),deleteBrandByAdmin )




 

module.exports =Router

