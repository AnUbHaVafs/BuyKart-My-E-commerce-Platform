const express = require('express');
const app = express.Router();
const userController = require('../controller/User');
const { authMiddleware } = require('../middlewares/authMiddleware');


app.post('/register', useController.createUser);
app.post('/login', useController.loginUser);
app.get('/users', useController.getAllUsers);
app.get('/user:id', authMiddleware, userController.isAdmin, useController.getUser);
app.get('/logout', useController.logOut);
app.put('/user', authMiddleware, useController.updateUser);
app.delete('/user:id', useController.deleteUser);
app.delete('/refresh', useController.handleRefreshToken);

