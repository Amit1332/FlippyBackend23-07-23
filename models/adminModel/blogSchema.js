const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({

blog_title:{
    type:String,
    required:[true,"please enter blog tittle"],

},
category:{
    type:String,
    required:[true,"please enter blog category"]
},
slug:{
    type:String,
    required:[true,"please enter slug"]
},

banner: {
          
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },



short_description:{
    type:String,
    
},
meta_description:{
    type:String,   
},
meta_keyword:[{
        type:String   
    }],
    status:{
        type:String 
    }


});

 blogSchema.set('timestamps',true)


module.exports = mongoose.model("blog", blogSchema);
