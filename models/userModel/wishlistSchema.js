const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema({
    userProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AllUser",
    },

    product_id:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
        }
    ]
   
})

wishlistSchema.set('timestamps',true)
module.exports = mongoose.model("wishlist", wishlistSchema);
