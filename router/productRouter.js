const express = require('express');
const app = express();
const { allProduct, getAllCarts, addCartProduct, productProfit, productLoss, productCategory, productSort, postProduct, updateProduct, deleteProduct, uploadImage, search, filter, RegisterPeople, Login } = require('../controller/productsController');
const productsRouter = express.Router();
const productRouter = express.Router();
const fileUpload = require('./multer');
const { auth } = require('./authMiddleware');

//products routes

productsRouter.route('/profit')
    .get(productProfit)


productsRouter.route('/getAllCarts')
    .get(auth, getAllCarts)


productsRouter.route('/addCartProduct')
    .post(auth, addCartProduct)

productsRouter.route('/loss')
    .get(productLoss)

productsRouter.route('/searchByCatAndProdNam')
    .post(search)

productsRouter.route('/filter')
    .post(filter)

//product routes
productRouter.route('/sort')
    .get(productSort)

productRouter.route('/updateProduct')
    .post(updateProduct)

productRouter.route('/deleteProduct')
    .post(deleteProduct)

productRouter.route('/uploadImage')
    .post(fileUpload.single('image'), uploadImage);

productsRouter.route('/')
    .get(allProduct)

productRouter.route('/')
    .post(postProduct)

productsRouter.route('/:category')
    .get(productCategory)

module.exports = { productsRouter, productRouter };

