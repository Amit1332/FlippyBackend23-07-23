const { json } = require("body-parser");
const catchAsyncError = require("../../middleware/catchAsyncError");
const ErrorHander = require("../../utils/errorhander");
const ApiFeatures = require("../../utils/apifeatures");
const Attribute = require("../../models/adminModel/attributeSchema");







exports.createAttributeByAdmin = catchAsyncError(async (req, res, next) => {
  const attrdata = {
    name:req.body.name,
    attr_values:[{
      val:req.body.val

    }
  ]
  }
  const attrval = { 
    val:req.body.val
  }  

  const isExistAttribute = await Attribute.findOne({
    name: req.body.name
  });

  if (isExistAttribute) {
    const { val } = req.body;
    if (!val) {
      return next(
        new ErrorHander("please enter with Attribute Value", 401)
      );
    } else {
    
        const update_attr_val = await Attribute.findOneAndUpdate(
          { name: req.body.name },
          { $push: { attr_values: attrval } },
          { new: true, runValidators: true }
        );
        res.status(201).json({
          success: true,
          update_attr_val,
        });
     

    }
  } else {
    const { val, name } = req.body;
    if (!val || !name) {
      return next(
        new ErrorHander("please enter field", 401)
      )
    }
    const attribute = await Attribute.create(attrdata);
    res.status(201).json({
      success: true,
      attribute,
    });
  }

})




















// add attribute
// exports.createAttributeByAdmin = catchAsyncError(async (req, res, next) => {
//   const attr = {
//     name:req.body.name,
//     attr_values:[{
//       val:req.body.attr_values

//     }
//   ]
//   }
 
  

// const attribute = await Attribute.create(attr)

// res.status(200).json({
//     success:true,
//     attribute,
//     msg:"Attribute Created Successful"
// });

// })


// update attribute
// exports.updateAttributeByAdmin = catchAsyncError(async (req, res, next) => {
//   const attribute = await Attribute.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });


//   if (!attribute) {
//     return next(new ErrorHander("sorry attribute can not update"));
//   }
//   res.status(201).json({
//     success: true,
//     attribute,
//   });
// });



// get single attribute
// exports.getSingleAttributeByAdmin = catchAsyncError(async (req, res, next) => {
//   const attribute = await Attribute.findById(req.params.id);

//   if (!attribute) {
//     return next(
//       new ErrorHander(`attribute does not exist with this id ${req.params.id}`)
//     );
//   }
//   res.status(201).json({
//     success: true,
//     attribute,
//   });
// });





// delete attribute

exports.deleteAttributeByAdmin = catchAsyncError(async (req, res, next) => {

 const attribute = await Attribute.findByIdAndDelete(req.params.id)

  if (!attribute) {
    return next(
      new ErrorHander(`attribute does not exist with this id ${req.params.id}`)
    );
  }
  res.status(201).json({
    success: true,
    attribute,
    msg: " attribute deleted successfully",
  });
});


// delete attribute values

exports.deleteAttributeValuesByAdmin = catchAsyncError(async (req, res, next) => {
  const { id, atrId } = req.params;


  const attribute  = await Attribute.findById(atrId);

  const attt = await Attribute.updateMany(
    { _id: atrId },
    { $pull: { attr_values: { _id: id } } }
  );

  if (!attt) {
    return next(
      new ErrorHander(`Does not exist with this id ${req.params.id}`)
    );
  }
  res.status(201).json({
    success: true,
    attt,
    msg: "Deleted successfully",
  });
});









// get all attribute
exports.getAllAttributeByAdmin = catchAsyncError(async (req, res, next) => {
  const allattribute = await Attribute.find();
 
  res.status(201).json({
    success: true,
    allattribute,
  });
});
