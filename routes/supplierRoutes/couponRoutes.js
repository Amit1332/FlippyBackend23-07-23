const express = require("express")
const { getAllCouponBySupplier, createCouponBySupplier, deleteCouponBySupplier } = require("../../controller/supplierController/couponController")
const {isAuthenticatedSupplier} =require("../../middleware/auth")
const Router = express.Router()


Router.route("/supplier/all/coupons").get(isAuthenticatedSupplier, getAllCouponBySupplier)
Router.route("/supplier/add/coupons").post(isAuthenticatedSupplier, createCouponBySupplier)
Router.route("/supplier/delete/coupons/:id").delete(isAuthenticatedSupplier, deleteCouponBySupplier)



module.exports =Router