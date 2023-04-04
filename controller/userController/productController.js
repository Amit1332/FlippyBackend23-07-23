const { json } = require("body-parser");
const catchAsyncError = require("../../middleware/catchAsyncError");
const AllUser = require("../../models/alluser");
const ErrorHander = require("../../utils/errorhander");
const Product = require("../../models/productSchema");
const ApiFeatures = require("../../utils/apifeatures");
const wishlist = require("../../models/userModel/wishlistSchema");









// get All Products
exports.getAllProductsByUser = catchAsyncError(async (req, res, next) => {
 const resultperPage = 2;
 const apiFeatures = new ApiFeatures( Product.find(),req.query).search().filter().pagination(resultperPage);
 const products = await apiFeatures.query
  const productsCount = products.length


  res.status(200).json({
    success: true,
    products,
    productsCount,
  });
});




// get single prodcuts by seller

exports.getSingleProductByUser = catchAsyncError(async (req,res,next)=>{

    const product = await Product.findById(req.params.id)

    if(product){
       res.status(200).json({
        success:true,
        product

       })
    }
    else{
        return next(new ErrorHander(`product not found with this id ${req.params.id}`,401))
    }
   
})



// wishlist Product Controller
exports.addWishlistProduct = catchAsyncError(async (req,res,next)=>{
  const user = await wishlist.findOne({userProfile:req.user.id})

  if(user){
   user.product_id.forEach(async (elem)=>{
      if(elem==req.params.id){
        const removewishlist = await wishlist.findOneAndUpdate(
          { userProfile:req.user.id },
          { $pull: {  product_id: req.param.id } },
          { new: true, runValidators: true }
        );
        res.status(200).json({ 
          success:true,
          msg:"Product removed from wishlist"
        })
      }
      else{
        const addwishlist = await wishlist.findOneAndUpdate(
          { userProfile:req.user.id },
          { $push: {  product_id: req.param.id } },
          { new: true, runValidators: true }
        );
        res.status(200).json({
          success:true,
          msg:"Product removed from wishlist"
        })
      }
    })
   
  }
  else{
    const wishproduct = wishlist.create({
      userProfile:req.user.id,
      product_id:req.params.id
    
    })
    
    res.status(200).json({
      success:true,
      wishproduct
    })
  }



})

