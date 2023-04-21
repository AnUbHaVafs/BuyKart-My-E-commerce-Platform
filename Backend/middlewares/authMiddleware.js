const User = require('../models/User')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-hanlder')

exports.authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req, headers.authorization.split(' ')[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                console.log(deecoded)
            }
        } catch (error) {
            throw new Error("not authorized token expired")
        }
    }
    else {
        throw new Error("There is no token attache dto the headers")
    }
})