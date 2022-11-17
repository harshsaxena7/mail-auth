const User = require("../models/users");
const { use } = require("../routes/auth");
// const mailgun = require("mailgun-js");
// const DOMAIN = 'sandboxc12a70d63d28483f9699b9d8874bfa08.mailgun.org';
// const mg = mailgun({ apiKey: 'f49e3622207cd7f571fe2940d2be3136-48c092ba-ba2b3e51', domain: DOMAIN });
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")
const utility = require("../Util");
const jwtUtil = require("../JwtUtil");
const { query } = require("express");

exports.signup = (req, res) => {
    console.log(req.body);
    const { name, email, password, role } = req.body;
    console.log('req.body', req.body);

    console.log('email', email)

    User.findOne({ email: email }).exec((err, user) => {
        console.log('user', user)
        if (user) {
            res.status(400);
            return res.send({ error: "user already exists" });
        }

        let subject = "Signup Info";
        let sentTo = email;
        let content = "<b>Congrats You are signed!</b>"

        let sentResponse = utility.mailsend(subject, sentTo, content);

        console.log("Email Send response " + sentResponse);
        let newUser = new User({ name, email, password, role });
        console.log('newUser ', newUser);
        newUser.isNew = true;
        newUser.save((err, success) => {
            if (err) {
                console.log("error on sign:", err);

            }
            res.json({
                message: "signup is successful"
            })
        })
    })
}




// exports.deleteUser = async (req, res) => {
//     console.log("dsdsds",  req.params.email )
//     // User.remove({ email: req.body.email }, function (err, deleted) {
//     //     if (err)
//     //         console.log("ERROR!", err);

//     //     console.log("deleted ");
//     // });
// }
exports.deleteUser = async (req, res) => {
    console.log("DELETE Request Called", req.body.email)

    let userEmail = req.body.email;
    let responseMessage = await new Promise((resolve, reject) => {
        User.remove({ email: userEmail }, function (err, deleted) {
            if (err)
                console.log("ERROR!", err);

            err ? reject(err) : resolve("User deleted successfully.");
        });
    })
    res.json({
        message: responseMessage
    })
}

exports.login = async (req, res) => {
    console.log("POST Request Called", req.body.email)

    let userEmail = req.body.email;
    let userPassword = req.body.password;
    let responseMessage = "";
    let userData = await new Promise((resolve, reject) => {
        User.findOne({ email: userEmail, password: userPassword }, function (err, userData) {
            if (err)
                console.log("ERROR!", err);

            err ? reject(err) : resolve(userData);
        });
    })
    if(userData != null && userData != undefined && userData != "") {
        let accessToken = jwtUtil.generateAccessToken(userData);
        res.json({
            authToken: accessToken
        })
  
    } else {
        responseMessage = "User doesn't exist."
    }
    res.json({
        message: responseMessage
    })
}



exports.resetPassword = (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    let userJson = {
        email: email
    }
    let passwordResetToken = jwtUtil.generateResetPasswordToken(userJson);
    console.log("passwordResetToken", passwordResetToken)
    let subject = "Password reset";
    let baseUrl = "http://localhost:6900/api/reset/";
    let body = "Dear User <br/><br/>" +
        "Please click on below password reset link and change your password: <br/>" +
        baseUrl + passwordResetToken;


    utility.mailsend(subject, email, body);
    res.json({
        message: "Reset Password link has been sent on email."
    })
}

exports.reset = async (req, res) => {
    let responseMessage = "";
    if (req.params.token == undefined && req.params.token == "") {
        responseMessage = "Password reset token cannot be empty."
    } else {
        let passwordResetToken = req.params.token;
        let userEmail = await jwtUtil.verifyToken(passwordResetToken);
        console.log("userEmail", userEmail);
        if (userEmail == "invalid-token") {
            responseMessage = "Invalid Token! Please try again with new reset password link.";
        } else if (userEmail == "TokenExpiredError") {
            responseMessage = "Token Expired! Please try again with new reset password link.";
        } else {
            // First validate the user email if exist or not.
            responseMessage = await new Promise((resolve, reject) => {
                User.findOne({ email: userEmail }).exec((err, user) => {
                    console.log('user', user);
                    if (user != null && user.email != undefined && user.email != "") {
                        if (req.body.new_password != undefined && req.body.new_password != "") {
                            let newPassword = req.body.new_password;
                            var whereCondition = { email: user.email };
                            var updatedField = { $set: { password: newPassword } };

                            User.updateOne(whereCondition, updatedField, function (err, res) {
                                if (err) throw err;
                                responseMessage = "Password updated successfully";
                                err ? reject(err) : resolve(responseMessage);
                                console.log(" Password updated");
                            });
                        } else {
                            responseMessage = "New Password cannot be empty";
                            err ? reject(err) : resolve(responseMessage);
                        }
                    } else {
                        responseMessage = "User doesn't exist in database.";
                        err ? reject(err) : resolve(responseMessage);
                    }
                })
            })
        }


        res.json({
            message: responseMessage
        })
    }
}