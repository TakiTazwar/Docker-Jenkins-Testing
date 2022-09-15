const express = require('express');

//Project Module
const UserController=require('../controller/user');
const validator = require('../middlewares/validation');
const upload = require('../middlewares/addUserImage');
const auth = require("../middlewares/userAuth");


const router = express.Router();


router.post('/add-user' ,auth.checkAuth,auth.isAdmin,upload.single('imageUrl'),validator.addUser, UserController.addUser);

router.post('/edit-user' ,auth.checkAuth,auth.isAdmin,upload.single('imageUrl'),validator.editUser, UserController.editUser);

router.delete('/delete-user/:userId' ,auth.checkAuth,auth.isAdmin,UserController.deleteUser);

router.get('/get-all-users',auth.checkAuth,auth.isAdmin,UserController.getAllUser);

router.get('/view-single-user/:id' , UserController.viewSingleUser);

router.post('/login' ,validator.login, UserController.login);

router.post('/reset-password-mail' ,validator.resetPasswordMail, UserController.resetPasswordMail);

router.post('/reset-password' ,validator.resetPassword, UserController.resetPassword);

router.get('/verifymail/:verifytoken/:id',UserController.verifyMail);

router.get('/refreshVerify/:id',UserController.verifyRefresh);


module.exports=router;