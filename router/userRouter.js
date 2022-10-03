const express = require("express");
const userRouter = express.Router();
const { RegisterPeople, Login, forgetPassword, resetPassword } = require('../controller/userController');



userRouter.route('/reset-password')
    .get(resetPassword)

userRouter.route('/forget-password')
    .post(forgetPassword)

userRouter.route('/login')
    .post(Login)

userRouter.route('/signUp')
    .post(RegisterPeople)



module.exports = { userRouter }