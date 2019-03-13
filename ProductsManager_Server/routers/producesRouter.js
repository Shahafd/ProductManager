var Product = require("../models/product");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const data = require("../data/mokData.json");
const mongoDb = require("../databases/mongoose");
const config = require("../configs/config");
const auth = require('../middleware/authentication');
router.use(bodyParser.json());

mongoDb.InitDB();
mongoDb.FillAutoCompleteDic();

router.get("/GetMostUsedWords", (req, res) => {
  res.status(200).send(Object.keys(mongoDb.MostUsedWords));
});
router.get("/GetNumOfItemsPerRquest", (req, res) => {
  res.status(200).send(config.itemsAmount);
});
router.get("/GetToken", (req, res) => {
  res.status(200).send(auth.GetToken("customPayload"));
});

router.get("/GetProducts/:input/:index", (req, res) => {
  input = req.params["input"];
  index = parseInt(req.params["index"]);
  if (!index || index >= 1000) {
    index = 1;
  }
  Product.aggregate([
    { $skip: index },
    { $sort: { _id: 1 } },
    { $limit: parseInt(config.itemsAmount) },
    { $match: { product: { $regex: input, $options: "i" } } }
  ]).exec((error, doc) => {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.send(doc);
    }
  });
});
router.get("/GetAllProducts/:index", (req, res) => {
  index = parseInt(req.params["index"]);
  if (!index || index >= 1000) {
    index = 1;
  }
  Product.aggregate([
    { $skip: index },
    { $sort: { _id: 1 } },
    { $limit: parseInt(config.itemsAmount) },
    { $match: {} }
  ]).exec((error, doc) => {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.send(doc);
    }
  });
});
router.get("/INIT",auth.authenticateTokenOrUnauthorized, (req, res) => {
  data.forEach(item => {
    var product = new Product({
      _id: item._id,
      product: item.product,
      price: item.price,
      inStock: item.inStock,
      imageUrl: item.imageUrl
    });

    product.save();
  });
  res.send("OK");
});

module.exports = router;
