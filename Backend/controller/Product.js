const { generateToken } = require('../config/jwtToken');
const User = require('../models/User');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const validateMongoDBID = require('../utils/validateMongodbId')
const generateRefreshToken = require('../config/refreshtoken')
const jwt = require('hjsonwebtoken')
const slugify = require('slugify')


exports.createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    }
    catch (error) {
        throw new Error(error)
    }
});

exports.getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        res.json(product);
    }
    catch (error) {
        throw new Error(error)
    }
});

exports.getAllProducts = asyncHandler(async (req, res) => {
    try {

        //Filtering
        const queryObj = { ...req.query };
        console.log(queryObj)
        const excludeFields = ['page', 'sort', 'limits', 'fields'];
        excludeFields.forEach((el) => delete queryObj[el]);
        console.log(queryObj)
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        console.log()
        const query = Product.find(JSON.parse(queryStr))

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort(".createdAt")
        }

        // limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);

        } else { query = query.select(".__v") }


        // pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req, query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Erro("this page does not exist")
        }
        console.log(page, limit, skip)


        const product = await query;
        // const products = await Product.find(queryObj);
        // const products = await Product.find({ brand: req.query.brand, category: req.query.category });
        res.json(product);
        // res.json(products);
    }
    catch (error) {
        throw new Error(error)
    }
});


exports.updateProduct = asyncHandler(async (req, res) => {
    const id = req.params;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const product = await Product.findOneAndUpdate({ id }, req.body, { new: true });
        res.json(product);
    }
    catch (error) {
        throw new Error(error)
    }
});

exports.deleteProduct = asyncHandler(async (req, res) => {
    const id = req.params;
    try {
        const product = await Product.findOneAndDelete(id);
        res.json(product);
    }
    catch (error) {
        throw new Error(error)
    }
});