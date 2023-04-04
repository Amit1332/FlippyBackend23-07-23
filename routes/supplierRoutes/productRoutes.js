const express = require("express")
const { createProductBySupplier, updateProductBySupplier, getAllProductsBySupplier, deleteProductBySupplier, getSingleProductBySupplier } = require("../../controller/supplierController/productController")
const {isAuthenticatedUser, authorizeRoles, isAuthenticatedSupplier} =require("../../middleware/auth")
const Router = express.Router()


// Products -----------------------
Router.route("/supplier/add/product").post(isAuthenticatedSupplier, createProductBySupplier)
Router.route("/supplier/single/product/:id").get(isAuthenticatedSupplier, getSingleProductBySupplier)
Router.route("/supplier/all/product").get(isAuthenticatedSupplier, getAllProductsBySupplier)
Router.route("/supplier/update/product/:id").put(isAuthenticatedSupplier, updateProductBySupplier)
Router.route("/supplier/delete/product/:id").delete(isAuthenticatedSupplier,deleteProductBySupplier)



module.exports =Router

