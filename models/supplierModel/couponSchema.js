const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "AllUser",
      required: true,
    },

    start_date:{
      type:String,
      // default:Date.now,
      required:[true, "Enter the starting coupon date"]  
    },
    ending_date:{
        type:String,
        // default:Date.now,
        required:[true, "Enter the starting coupon date"]  
      },
      coupon_type:{
        type:String,
        required:[true, "Enter Coupon Type..."]
      }, 
      coupon_id:{
        type:String,
        // required:[true, "Enter Coupon Type..."]
      },
      coupon_code:{
        type:String,
        require:[true, "Enter the Coupon code..."]
      },
      product:{
        type:String,
        // ref:'product'
      },
      discount_type:{
        type:String,
        required:[true, "Enter the discount Type"]      
    },
    discount_constant:{
        type:Number,
        required:[true, "Enter the discount percent or amount"]      
    },
    status_coupon:{
        type:Boolean,
        default:false,
        required:[true, "Enter coupon status"]
    },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("coupon", couponSchema);
