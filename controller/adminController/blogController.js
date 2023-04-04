const { json } = require("body-parser");
const catchAsyncError = require("../../middleware/catchAsyncError");
const ErrorHander = require("../../utils/errorhander");
const ApiFeatures = require("../../utils/apifeatures");
const BlogSchema = require("../../models/adminModel/blogSchema");
const cloudinary = require("cloudinary");







exports.createBlogByAdmin = catchAsyncError(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.banner, {
    folder: "blog",
    // width: 35,
    crop: "scale",
  });
    const blogdata = await BlogSchema.create({
      blog_title:req.body.blog_title,
      category:req.body.category,
      slug:req.body.slug,
      short_description:req.body.short_description,
      meta_description:req.body.meta_description,
      meta_keyword:req.body.meta_keyword,
      banner:{
      public_id:myCloud.public_id,
      url: myCloud.secure_url,
    }
  });
    res.status(201).json({
      success: true,
      blogdata,
    });

})



// get all blog 
exports.getaAllBlogByAdmin = catchAsyncError(async (req,res,next)=>{
    const resultperPage = 20;
  const apiFeatures = new ApiFeatures( BlogSchema.find(),req.query).search().pagination(resultperPage);
  const blogs = await apiFeatures.query
    const blogsCount = await BlogSchema.countDocuments()
  const filterBlogCount = blogs.length


            res.status(200).json({
                success:true,
                blogs,
                blogsCount,
                filterBlogCount

            })
   

})



//get blog by id 
exports.getaBlogByAdmin = catchAsyncError(async (req,res,next)=>{

    const blog = await BlogSchema.findById(req.params.id)
     
    if(blog){
       res.status(200).json({
        success:true,
        blog
       })
    }
    else{
        return next(new ErrorHander(`blog not found with this id ${req.params.id}`,401))
    }
   
})








// delete blog by id

exports.deleteaBlogByAdmin = catchAsyncError(async (req, res, next) => {

 const blog = await BlogSchema.findByIdAndDelete(req.params.id)

  if (!blog) {
    return next(
      new ErrorHander(`blog does not exist with this id ${req.params.id}`)
    );
  }
  res.status(201).json({
    success: true,
    blog,
    msg: "blog deleted successfully",
  });
});


// update category
exports.updateBlogByAdmin = catchAsyncError(async (req, res, next) => {
 

  const myCloud = await cloudinary.v2.uploader.upload(req.body.banner, {
    folder: "blog",
    // width: 35,
    crop: "scale",
  });
    const blogdata = await BlogSchema.findByIdAndUpdate(req.params.id, 
      {
      blog_title:req.body.blog_title,
      category:req.body.category,
      slug:req.body.slug,
      short_description:req.body.short_description,
      meta_description:req.body.meta_description,
      meta_keyword:req.body.meta_keyword,
      banner:{
      public_id:myCloud.public_id,
      url: myCloud.secure_url,
    }
  });

  if (!blogdata) {
    return next(new ErrorHander("sorry blog can not update"));
  }
  res.status(201).json({
    success: true,
    blogdata,
    // msg: "blog updated successfully",

  });
});



