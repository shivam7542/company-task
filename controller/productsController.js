const taskModel = require('../model/productModel');



const allProduct = async function (req, res) {

    const allProduct = await taskModel.find();
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


    let allProduct = await taskModel.find({ $expr: { $gt: ["$sellPrice", "$buyPrice"] } })
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
    let allProduct = await taskModel.find({ $expr: { $gt: ["$buyPrice", "$sellPrice"] } });
    // status code

    if (allProduct.length == 0) {
        res.status(404).json({
            result: "product not found",
        });
    } else {
        res.status(200).json({
            result: "lossable product",
            products: lossProduct
        });
    }

}

const productCategory = async function (req, res) {
    console.log("product/cat");
    const { params: { category } } = req; // destrucutr
    // let cat = req.params.category.slice(1);

    // console.log(cat);
    const allproduct = await taskModel.find({ category }); // findOne, find, update, populate, sort, lean, exec, 

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
    const allproduct = await taskModel.find();
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
    const saveData = await taskModel.create(req.body);
    res.json(saveData);
}

const updateProduct = async function (req, res) {
    const update = req.body;
    const { name } = update;
    const updatedDocument = await taskModel.updateOne({ name: "hghbjkn" }, { $set: { name } });

    res.status(200).json({
        result: 'updated data'
    });
}

const deleteProduct = async function (req, res) {

    const data = req.body;
    const { name } = data;
    const deletedData = await taskModel.deleteOne({ name });

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

    const searchedProduct = await taskModel.find({ name: productName, category }).lean();
    console.log('this is the searched Product', searchedProduct);
    console.log('type of searched Product', typeof searchedProduct);
    res.json({
        result: "all searched data",
        product: searchedProduct
    })
}

const filter = async function (req, res) {

    let { filterBy, percentage, sortBy } = req.body;
    let name;
    if (sortBy == 'lth') {
        name = 'name';
    } else if (sortBy == 'htl') {
        name = "-name"
    }
    let queryOperation;
    if (filterBy === 'profit') {
        queryOperation = '$gt'

    } else if (filterBy === 'loss') {
        queryOperation = '$lt'

    }
    percentage = parseFloat(percentage)



    let filterProduct = await taskModel.find({ $expr: { [queryOperation]: ["$sellPrice", "$buyPrice"] } }).sort(name).lean();
    let countProduct = await taskModel.find({ $expr: { [queryOperation]: ["$sellPrice", "$buyPrice"] } }).countDocuments();
    let newArray;
    if (filterBy === "profit") {
        newArray = filterProduct.map((ele) => {


            let profit = (parseFloat(ele.sellPrice) - parseFloat(ele.buyPrice)) / parseFloat(ele.buyPrice);
            profit = profit * 100;

            let newEle = { ...ele, profit }
            console.log('this is the profit', newEle);
            return newEle;
        })
    } else {
        newArray = filterProduct.map((ele) => {

            let loss = (parseFloat(ele.buyPrice) - parseFloat(ele.sellPrice)) / parseFloat(ele.buyPrice);
            loss = loss * 100;

            let newEle = { ...ele, loss }
            return newEle;
        })
    }
    if (filterBy === 'profit') {
        newArray = newArray.filter(ele => {
            if (parseFloat(percentage) > parseFloat(ele.profit)) {
                return true
            } else {
                return false
            }
        })
    } else {
        newArray = newArray.filter(ele => {
            if (parseFloat(percentage) > parseFloat(ele.lossPercentage)) {
                return true
            } else {
                return false
            }
        })

    }
    console.log('new  Array', newArray)


    res.json({
        result: "all filtered data",
        product: newArray,
        countProduct: countProduct
    })
}

module.exports = {
    allProduct, productProfit, productLoss, productCategory, productSort, postProduct, updateProduct, deleteProduct, uploadImage, search, filter
}



//status code
//update product query
//delete query
//convert in ES6