const express = require("express")
const { getSingleProductByUser, getAllProductsByUser, addWishlistProduct } = require("../../controller/userController/productController")
const {isAuthenticatedUser, authorizeRoles} =require("../../middleware/auth")
const Router = express.Router()


// Products -----------------------
Router.route("/user/single/product/:id").get( getSingleProductByUser)
Router.route("/user/all/product").get( getAllProductsByUser)




// wishlist Product Routes
Router.route("/user/add/wishlist/product/:id").post(isAuthenticatedUser, addWishlistProduct)





module.exports =Router