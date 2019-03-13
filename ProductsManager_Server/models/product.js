var mongoose = require("mongoose");
var productSchema = new mongoose.Schema({
  _id: Number,
  product: String,
  price: String,
  inStock: Boolean,
  imageUrl:String
});

var Product = mongoose.model("Product", productSchema);
module.exports = Product
