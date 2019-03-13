var mongoose = require("mongoose");
const config = require("../configs/config");
var Product = require("../models/product");
var AutoCompleteDic = {};
var MostUsedWords = {};
function InitDB() {
  mongoose.connect(config.mongoDbUrl);
  var db = mongoose.connection;
  db.on("error", () => {
    console.log("Connection Error");
  });
  db.once("open", () => {
    console.log("Connection Established");
  });
}
function FillAutoCompleteDic() {
  Product.find().then(products => {
    products.forEach(p => {
      var words = p.product.split(" ");
      words.forEach(w => {
        if (!AutoCompleteDic[w]) {
          AutoCompleteDic[w] = 1;
          if (w == "-" || w == "/") {
            AutoCompleteDic[w] = 0;
          }
        } else {
          AutoCompleteDic[w]++;
        }
      });
    });

    Object.keys(AutoCompleteDic).forEach(function(key) {
      if (AutoCompleteDic[key] > config.minValForMostUsedWords) {
        if (!MostUsedWords[key]) {
          MostUsedWords[key] = AutoCompleteDic[key];
        }
      }
    });
  });
}

module.exports = {
  InitDB,
  FillAutoCompleteDic,
  MostUsedWords
};
