const { userModel } = require('../model/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const JWT_TOKEN = "asdfghjklzxcvbnm";
const randomstring = require('randomstring');
const nodemailer = require("nodemailer");


const sendResetPasswordEmail = async (name, email, token) => {

    try {

        var transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "ba6b7399f0f44f",
                pass: "0b844556ba2959"
            }
        });


        const mailOptions = {

            to: email,
            subject: "to reset password",
            html: '<p>hii ' + name + ' please copy the link and and <a href="http://localhost:3000/youHaveRequestedForChangePassword?token=' + token + '">reset your password</a></p>'

        }

        // '<p>hii ' + name + ' please copy the link and and <a href="http://localhost:9000/user/reset-password?token=' + token + '">reset your password</a></p>'

        transporter.sendMail(mailOptions, (err, info) => {

            if (err) {
                console.log(err.message);
            } else {

                console.log("email has been sended");
            }


            console.log(err.message);
        });


    } catch (err) {
        console.log(err);
    }

}


//another task
const RegisterPeople = async function (req, res) {

    try {

        const { name, email, password, phoneNumber, wallet, photoUrl } = req.body;
        console.log('this is the request body', req.body);
        console.log('Step 1')
        let hash = await bcrypt.hash(password, 10);
        console.log('Step 2')
        console.log(hash);
        let registeredUser = await userModel.create({ name, email, password: hash, phoneNumber, wallet, photoUrl });
        console.log(registeredUser);
        console.log('Step 3')
        let uid = registeredUser._id;
        let token = jwt.sign({ userId: uid }, JWT_TOKEN);


        res.status(200).json({
            token,
            message: "user SucessFully Registered",
        })
    }
    catch (err) {

        res.status(500).json({
            message: "please try again"
        })
    }

}

const Login = async function (req, res) {
    const { email, password } = req.body;
    console.log(email, password);
    try {

        const user = await userModel.findOne({ email });
        console.log("------->" + user);

        bcrypt.compare(password, user.password, (err, result) => {

            console.log("hii login result" + result);
            if (result == true) {
                let uid = user['_id'];
                let token = jwt.sign({ userId: uid }, JWT_TOKEN);
                // Cookies.set('token', token);

                res.status(200).json({
                    token,
                    message: "user has been sucessfully loged in"
                })
            } else {
                res.status(404).json({
                    message: "Invalid Password"
                }
                )
            }
        });
    }
    catch (err) {
        res.status(404).json(
            {
                message: "you have entered wrong information"
            }
        )
    }


}

const forgetPassword = async function (req, res) {

    const { email } = req.body;
    console.log("this is my mail ", email);

    try {
        let user = await userModel.findOne({ "email": email }).lean();
        console.log("this is my name and email ", user);
        if (user) {

            const randomString = randomstring.generate();
            const updateUser = await userModel.updateOne({ email: email }, { $set: { token: randomString } }).lean();
            console.log("hii i am updated user", updateUser);
            sendResetPasswordEmail(user.name, user.email, randomString);
            res.status(200).send(
                {
                    message: "kindly check your email"
                })

        } else {
            res.status(200).send(
                {
                    message: "result not found"
                })
        }

    } catch (err) {
        res.status(500).send(
            {
                message: "err found "
            }
        )
    }


}

const resetPassword = async function (req, res) {
    // let token = req.query.token;
    // console.log(req.body);
    // const { newPassword, token } = req.body;
    const newPassword = req.query.password;
    const token = req.query.token;
    console.log("new password ", newPassword);
    console.log("token ", token);
    try {

        let tokenUser = await userModel.findOne({ token: token });
        console.log("hii am token--->", tokenUser);
        if (tokenUser) {
            let functionPass = newPassword;
            functionPass = functionPass.toString();
            let _id = tokenUser._id;
            console.log("here is my password ", functionPass);
            //  bcrypt.hash(functionPass, 10, (err, hash) => {
            //     if (err) {
            //         console.log("we have some err ", err.message);
            //     } else {
            //         hash = hash
            //         console.log(hash);
            //     }
            // });
            const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(functionPass, 10, function (err, hash) {
                    if (err) reject(err)
                    resolve(hash)
                });
            })
            console.log("this is password====> ", hashedPassword);
            let updateduser = await userModel.updateOne({ _id }, { $set: { password: hashedPassword, token: "" } });
            console.log(updateduser);
            res.status(200).json({
                message: "password has been sucessfully changed, and token has been expire"
            })
        } else {
            res.status(200).json({
                result: "dont have user of this name"

            })
        }

    } catch (err) {
        res.status(404).json({
            message: "server have some issue"
        })
    }

}

module.exports = { RegisterPeople, Login, forgetPassword, resetPassword }