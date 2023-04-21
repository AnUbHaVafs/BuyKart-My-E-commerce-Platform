const express = require('express');
const app = express.Router();
const productController = require('../controller/Product');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../controller/User');


app.post('/product', authMiddleware, isAdmin, productController.createProduct);
app.get('/product/:id', productController.getaProduct);
app.get('/product', productController.getAllProducts);
app.put('/product', authMiddleware, isAdmin, productController.updateProduct);
app.delete('/product', authMiddleware, isAdmin, productController.deleteProduct);
