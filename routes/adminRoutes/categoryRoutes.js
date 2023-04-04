
const express = require("express")
const { createCategoryByAdmin, updateCategoryByAdmin, deleteCategoryByAdmin, getSingleCategoryByAdmin, getAllCategoryByAdmin } = require("../../controller/adminController/categoryController")
const { authorizeRoles, isAuthenticatedAdmin} =require("../../middleware/auth")

const Router = express.Router()

Router.route("/admin/add/category").post(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'),createCategoryByAdmin )
Router.route("/admin/update/category/:id").put(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'),updateCategoryByAdmin )
Router.route("/admin/delete/category/:id/:catId").delete(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'),deleteCategoryByAdmin )
Router.route("/admin/get/single/category/:id").get(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'),getSingleCategoryByAdmin )
Router.route("/admin/get/all/category/").get(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'),getAllCategoryByAdmin )










module.exports =Router

