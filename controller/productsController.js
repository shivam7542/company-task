// const taskModel = require('../model/productModel');
// const userModel=require('../model/productModel');

const { NewProductModel } = require('../model/newProductModel');
const { CartModel } = require('../model/cartModel');
const { TransactionModel } = require('../model/cartModel');

const allProduct = async function (req, res) {

    const allProduct = await NewProductModel.find();
    if (allProduct.length == 0) {
        res.status(404).json({
            result: "result Not found",
        })
    } else {
        res.status(200).json({
            result: "all products",
            product: allProduct
        })
    }

}

const productProfit = async function (req, res) {

    console.log('I am here')
    let allProduct = await NewProductModel.find({ $expr: { $gt: ["$sellPrice", "$buyPrice"] } })
    if (allProduct.length == 0) {
        res.status(404).json({
            result: "result not found",
            products: allProduct
        });
    } else {
        res.status(200).json({
            result: "profitable product",
            products: allProduct
        });
    }
}

const productLoss = async function (req, res) {
    let allProduct = await NewProductModel.find({ $expr: { $gt: ["$buyPrice", "$sellPrice"] } });
    // status code

    if (allProduct.length == 0) {
        res.status(404).json({
            result: "product not found",
        });
    } else {
        res.status(200).json({
            result: "lossable product",
            products: allProduct
        });
    }

}

const productCategory = async function (req, res) {
    console.log("product/cat");
    const { params: { category } } = req; // destrucutr
    // let cat = req.params.category.slice(1);

    // console.log(cat);
    const allproduct = await NewProductModel.find({ category }); // findOne, find, update, populate, sort, lean, exec, 

    // const sameascateg = allproduct.filter((obj) => {
    //     return obj.category == cat;
    // })

    if (allproduct.length == 0) {
        res.status(404).json({
            result: "product not found",
        });
    } else {
        res.status(200).json({
            result: "all similar category product",
            products: allproduct
        });
    }
}

const productSort = async function (req, res) {
    const allproduct = await NewProductModel.find();
    allproduct.sort((a, b) => {
        return a.sellPrice - b.sellPrice;
    })

    res.status(200).json({
        result: "all sorted product according to sell value",
        products: allproduct
    });

}

const postProduct = async function (req, res) {
    console.log('req', req.body)
    const saveData = NewProductModel.create(req.body);
    res.json(saveData);
}

const updateProduct = async function (req, res) {
    const update = req.body;
    const { name } = update;
    const updatedDocument = await NewProductModel.updateOne({ name: "hghbjkn" }, { $set: { name } });

    res.status(200).json({
        result: 'updated data'
    });
}

const deleteProduct = async function (req, res) {

    const data = req.body;
    const { name } = data;
    const deletedData = await NewProductModel.deleteOne({ name });

    res.status(200).json({
        result: "sucessfully deleted"
    })

}

const uploadImage = async function (req, res) {
    try {

        if (req.isFieldNameValidator) {
            res.status(404).json({
                result: "Unexpected field"
            })
        } else
            if (req.isFileSizeValidator) {
                res.status(404).json({
                    result: "Please upload less then 1mb file"
                })
            } else if (req.fileValidationError) {
                res.status(404).json({
                    result: "Invalid file Type"
                })
            } else {
                res.status(200).json({
                    result: "file uploaded sucessfully"
                })
            }
    } catch (err) {
        console.log("errrr", err);
    }

}

const search = async function (req, res) {
    const { category, productName } = req.body;
    console.log("hello---");

    const searchedProduct = await NewProductModel.find({ name: productName, category }).lean();
    console.log('this is the searched Product', searchedProduct);
    console.log('type of searched Product', typeof searchedProduct);
    res.json({
        result: "all searched data",
        product: searchedProduct
    })
}

const filter = async function (req, res) {
    console.log('I am here');
    let { filterBy, percentage, sortBy } = req.body;


    percentage = parseFloat(percentage)


    let aggregateMethod = await NewProductModel.aggregate([
        // {
        //     $addFields: { percentage: { $multiply: [{ $divide: [{ $subtract: ["$sellPrice", "$buyPrice"] }, "$buyPrice"] }, 100] } }
        // },
        {
            $addFields: {
                if: { $eq: [filterBy, "profit"] },
                then: { percentage: { $multiply: [{ $divide: [{ $subtract: ["$sellPrice", "$buyPrice"] }, "$buyPrice"] }, 100] } },
                else: { percentage: { $multiply: [{ $divide: [{ $subtract: ["$buyPrice", "$sellPrice"] }, "$buyPrice"] }, 100] } }
            }
        },

        {
            $match: { percentage: { $gte: percentage } }
        },

        {
            $cond: {
                if: { $eq: [sortBy, "lth"] },
                then: { $sort: { name: 1 } },
                else: { $sort: { name: -1 } }
            }
        }

    ]);




    // aggregateMethod = aggregateMethod.map(ele => {
    //     let obj = ele;
    //     if (ele.percentage < 0) {
    //         obj.lossPercentage = ele.percentage;
    //         return obj
    //     } else {
    //         obj.profitPercentage = ele.percentage;
    //         return obj
    //     }
    // })

    console.log('this is the percentage', aggregateMethod);




    // if (filterBy === 'profit') {
    //     newArray = newArray.filter(ele => {
    //         if (parseFloat(percentage) > parseFloat(ele.percentage)) {
    //             return true
    //         } else {
    //             return false
    //         }
    //     })
    // } else {
    //     newArray = newArray.filter(ele => {
    //         if (parseFloat(percentage) > parseFloat(ele.percentage)) {
    //             return true
    //         } else {
    //             return false
    //         }
    //     })

    // }
    // console.log('new  Array', newArray)


    res.json({
        result: "all filtered data",
        product: aggregateMethod,
        countProduct: countProduct
    })
}

const getAllCarts = async function (req, res) {
    const userId = req.userId;
    const allCartProducts = await CartModel.find({ userId: userId }).populate('productId');
    res.status(200).json({ allCartProducts: allCartProducts, msg: 'Success' });
}

const addCartProduct = async function (req, res) {
    // const payload = req.body.headers.Authorization.payload;
    console.log(req.body);
    console.log(req.userId);
    let { id, price, count } = req.body;
    // console.log(payload);
    // console.log("here is req.body  ->", req.body);
    //manipulate
    //desired schema Mongodb

    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    // },
    // productId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Product',
    // },
    // price: { type: Number },
    // count: { type: Number }


    // let products = [];
    // products.unshift(req.body._id);

    const CartData = {
        userId: req.userId,
        productId: id,
        price,
        count
    }

    // const TransactionData={

    // }





    const cartProductAdded = await CartModel.create(CartData);
    console.log("----00--0--0-> ", cartProductAdded);


    res.status(200).json({ data: cartProductAdded, msg: 'Success' });
}
module.exports = {
    allProduct, getAllCarts, addCartProduct, productProfit, productLoss, productCategory, productSort, postProduct, updateProduct, deleteProduct, uploadImage, search, filter,
}



//status code
//update product query
//delete query
//convert in ES6