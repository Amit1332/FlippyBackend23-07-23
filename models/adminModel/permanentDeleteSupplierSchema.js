const mongoose = require("mongoose");

const deletedSupplierSchema = new mongoose.Schema({
 
supplier:{

},
supplierdetails:{

}


});

deletedSupplierSchema.set('timestamps',true)

module.exports = mongoose.model("permanent_deleted_supplier", deletedSupplierSchema);
