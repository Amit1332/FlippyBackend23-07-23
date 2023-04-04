const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  supplierProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AllUser",
  },
  gst: {
    type: String,
    unique:true,
    required: [true, "please enter your gst number"],
    minLength: [15, "gst number cannot be less than 15"],
    maxLength: [15, "gst number cannot grater than 15"],
  },
  pan:{
    type: String,
    unique:true,
    required: [true, "please enter your pan number"],
    minLength: [15, "pan number cannot be less than 15"],
    maxLength: [15, "pan number cannot grater than 15"],
  }
,
  pickup_address: {
    house_no: {
      type: String,
      // required: [true, "please enter Room/Floor/Building Number"],
      default:""

    },
    street:{
      type: String,
      // required: [true, "please enter Room/Floor/Building Number"],
      default:""
    },
    landmark: {
      type: String,
      // required: [true, "please enter landmark or street/locality"],
      default:""

    },
    postal_code: {
      type: String,
      minLength: [6, "postal code cannot be less than 6 character"],
      maxLength: [6, "postal code cannot be greater than 6 character"],
      default:"000000"

    },

    city: {
      type: String,
      // required: [true, "please enter pickup city"],
      default:""

    },
    state: {
      type: String,
      // required: [true, "please enter pickup state"],
      default:""

    },
  },

  bank_details:{
    account_number:{
      type:String,
      unique:true,
      default:""
      // required:[true,"please enter your bank account number"]
    },
    ifsc_code :{
      type:String,
      // required:[true,"please enter your ifsce code"]
      // default:""

    }
  },
  supplier_details:{
    store_name:{
      type:String,
      // default:""
    },
    your_name:{
      type:String,
      // default:""
    }
  },
 
  verification_status:{
    type:Boolean,
    default:false,
    // required:[true,"please verify your account"]
  },
   activation_status:{
    type:String,
    default:"Pending",
    // required:true
  }
  
  

  

});
supplierSchema.set('timestamps',true)


module.exports = mongoose.model("supplier", supplierSchema);
