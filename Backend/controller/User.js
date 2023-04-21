const { generateToken } = require('../config/jwtToken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const validateMongoDBID = require('../utils/validateMongodbId')
const generateRefreshToken = require('../config/refreshtoken')
const jwt = require('hjsonwebtoken')

exports.createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const finduser = await User.find({ email: email });
    if (!finduser) {
        const newuser = await User.create(req.body);
        res.json(newUser);
    }
    else {
        throw new Error("User already exists!")
    }
});

exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const finduser = await User.findOne({ email: email });
    if (finduser && finduser.isPasswordMatched(password)) {
        const refreshtoken = await generateRefreshToken(findUser?._id);
        const updateduser = await findUser.findByIdAndUpdate(findUser?._id, {
            refreshtoken: refreshtoken
        }, { new: true }
        );
        res.cookie('refreshtoken', refreshtoken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    }
    else {
        throw new Error("Invalid Credenials")
    }
});


exports.getUsers = async (req, res) => {
    try {
        const getusers = await User.find();
        res.json(getUsers)
    } catch (error) {
        throw new Error(error);
    }
}


exports.handleRefreshToken = async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refresh token in cookies")
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken })
    if (!user) throw new Error("No refresh token is present in db or not matched")
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token")
        }
        const accesstoken = generateToken(user?._id)

        res.json({ accesstoken })
    })
}


exports.logOut = async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refresh token in cookies")
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken })
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        })
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate(refreshToken, { refreshToken: "" })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    });
    res.sendStatus(204);

}


exports.updateUser = async (req, res) => {
    const { _id } = req.user;
    validateMongoDBID(_id)
    try {
        const updateduser = await User.findByIdAndUpdate(_id,

            {
                firstname: findUser?.firstname,
                lastname: findUser?.lastname,
                email: findUser?.email,
                mobile: findUser?.mobile,
            },
            {
                new: true

            });
        res.json(updateduser)
    } catch (error) {
        throw new Error(error);
    }
}


exports.getUsers = async (req, res) => {
    const { id } = req.params;
    try {
        const getusers = await User.findById(id);
        res.json(getUsers)
    } catch (error) {
        throw new Error(error);
    }
}


exports.deleteUsers = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedusers = await User.findByIdAndDelete(id);
        res.json(deletedusers)
    } catch (error) {
        throw new Error(error);
    }
}

exports.isAdmin = asyncHandler(async (req, res) => {
    const { email } = req.user;
    const adminuser = await User.findOne({ email });
    if (adminuser.role != "admin") {
        throw new Error("Access Denied")
    } else {
        next();
    }
});
