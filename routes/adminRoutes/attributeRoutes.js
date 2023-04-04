
const express = require("express")
const { createAttributeByAdmin, getAllAttributeByAdmin, deleteAttributeByAdmin, deleteAttributeValuesByAdmin } = require("../../controller/adminController/attributeController")
const {authorizeRoles, isAuthenticatedAdmin} =require("../../middleware/auth")

const Router = express.Router()

Router.route("/admin/add/attribute").post(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'),createAttributeByAdmin)
// Router.route("/admin/update/attribute/:id").put(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'),updateAttributeByAdmin)
Router.route("/admin/delete/attribute/:id").delete(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'),deleteAttributeByAdmin )
Router.route("/admin/delete/attribute/atrval/:id/:atrId").delete(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'),deleteAttributeValuesByAdmin )

// Router.route("/admin/get/single/attribute/:id").get(isAuthenticatedAdmin,authorizeRoles('superadmin','admin') )
Router.route("/admin/get/all/attribute").get(isAuthenticatedAdmin,authorizeRoles('superadmin','admin'),getAllAttributeByAdmin )









module.exports =Router

