const mongoose = require("mongoose");

const superadminSchema = new mongoose.Schema({
 
superadmin :{
    
}

 

});
superadminSchema.set('timestamps',true)

module.exports = mongoose.model("superadmin", superadminSchema);
