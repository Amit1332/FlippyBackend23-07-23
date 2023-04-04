const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
    userProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AllUser",
    },
    amount:{
        type:String
    },
    payment_method:{
     type:String
    },
    payment_details:{
     type:String
    }


})



walletSchema.set('timestamps',true)
module.exports = mongoose.model("wallet", walletSchema);
