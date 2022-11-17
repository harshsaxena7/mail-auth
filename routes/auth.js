const express = require("express");
const router = express.Router();
const authController =require("../controllers/auth");
router.post('/signup', authController.signup);
router.post('/password/reset', authController.resetPassword);
router.post('/reset/:token', authController.reset);
router.delete('/deleteUser', authController.deleteUser);
router.post('/login', authController.login);




module.exports =router;
