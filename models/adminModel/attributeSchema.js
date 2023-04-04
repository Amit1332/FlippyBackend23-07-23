const mongoose = require("mongoose");
const attributeSchema = new mongoose.Schema({
   name: {
    type: String,
    required: [true, "please add attribute name"],
    unique:[true,"this attribute already exist"],
    lowercase: true,

  },


   attr_values:[
     {
      val:{
        type:String
       },
     }
          
      ]         
,


  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Attribute", attributeSchema);
