const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
 
newStaff :{
    
}

});
staffSchema.set('timestamps',true)

module.exports = mongoose.model("staff_History", staffSchema);
