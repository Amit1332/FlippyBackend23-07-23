const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = new mongoose.Schema({
  userProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AllUser",
  },

  address:[
   {
   address_line: {
      type: String,
    },
    email_address:{
      type: String,
      validate:[validator.isEmail,"please enter your valid email address"],

    },
    phone:{
      type:String,
      maxLength:[10,"number can not be greater than 10"],
      minLength:[10, "number can not be less than 10"]
    }
   ,
    country: {
      type: String,
    },
    state:{
          type:String 
    },
    city:{
      type:String
   
    },
    zip_code:{ 
      type:String,
     minLength:[6, "postal code cannot be less than 6 character"],
     maxLength:[6, "postal code cannot be greater than 6 character"]
     
    }
   }
  ],


  
  bank_details:[
   {
    acc_holder_name:{
      type:String,
    },
    acc_number:{
      type:String,
    },
    ifsc_code:{
      type:String,
    }
   }
  ]
  
});

userSchema.set('timestamps',true)

module.exports = mongoose.model("user", userSchema);
