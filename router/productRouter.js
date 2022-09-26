const express = require('express');
const app = express();
const { allProduct, productProfit, productLoss, productCategory, productSort, postProduct, updateProduct, deleteProduct, uploadImage, search, filter } = require('../controller/productsController');
const productsRouter = express.Router();
const productRouter = express.Router();
const fileUpload = require('./multer');


//products routes

productsRouter.route('/:category')
    .get(productCategory)

productsRouter.route('/')
    .get(allProduct)

productsRouter.route('/profit')
    .get(productProfit)

productsRouter.route('/loss')
    .get(productLoss)

productsRouter.route('/searchByCatAndProdNam')
    .post(search)

productsRouter.route('/filter')
    .post(filter)

//product routes
productRouter.route('/sort')
    .get(productSort)

productRouter.route('/')
    .post(postProduct)

productRouter.route('/updateProduct')
    .post(updateProduct)

productRouter.route('/deleteProduct')
    .post(deleteProduct)

productRouter.route('/uploadImage')
    .post(fileUpload.single('image'), uploadImage);

module.exports = { productsRouter, productRouter };

