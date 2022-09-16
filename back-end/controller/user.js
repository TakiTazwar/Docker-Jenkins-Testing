const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fs = require('fs/promises');
const jwt = require('jsonwebtoken');
//Internal Module
const sendMail = require('../config/mail');
const {success,failed}=require('../utils/message');
const HTTP_STATUS =require('../utils/httpStatus');
const { validationResult } = require('express-validator');
const userData = require('../model/users');
const batchData = require('../model/batch');
const termData = require('../model/term');
const paginationSkip=require("../utils/pagination");

//EJS
const ejs = require('ejs');
const path = require('path');
const { promisify } = require('util');
const ejsRenderFile = promisify(ejs.renderFile);



class UserController
{
    async login(req,res,next)
    {
        try
        {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failed(errors.array()));
            }
            const email = req.body.email;
            const password = req.body.password;
            const foundUser = await userData.findOne({email:email}).exec();
            if(foundUser)
            {
                const passMatch = await bcrypt.compare(password, foundUser.password);
                if(passMatch)
                {
                    const userData = {
                        _id: foundUser._id,
                        email: foundUser.email,
                        address: foundUser.address,
                        firstName: foundUser.firstName,
                        lastName: foundUser.lastName,
                        mobile: foundUser.mobile,
                        nationalId:foundUser.nationalId,
                        userType: foundUser.userType,
                        imageUrl: foundUser.imageUrl,
                        verify:foundUser.verify
                    };
                    const jwtToken = jwt.sign(userData, process.env.JWT_SECRET_KEY);
                    const resData = {
                        access_token: jwtToken,
                        ...userData
                    }
                    res.status(HTTP_STATUS.OK).send(success("Login Succes",resData));
                }
                else
                {
                    res.status(HTTP_STATUS.OK).send(failed("Login Fail"));
                }
            }
            else
            {
                res.status(HTTP_STATUS.OK).send(failed("Invalid Email"));
            }
        }
        catch(error)
        {
            next(error);
        }
    }

    async addUser(req,res,next)
    {
        try
        {
            const errors = validationResult(req);
            if (!errors.isEmpty()) 
            {
                req.file?await fs.unlink(path.join(__dirname, '..', req.file.path)):"";
                return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failed(errors.array()));
            }
            
            const OTP = (Math.random() + 1).toString(36).substring(5);

            const email = req.body.email;
            const password = await bcrypt.hash(OTP, 5);
            const address = req.body.address;
            const firstName = req.body.firstName;
            const lastName=req.body.lastName;
            const mobile=req.body.mobile;
            const nationalId=req.body.nationalId;
            const userType=req.body.userType;
            const imageUrl = req.file?'images/'+req.file.filename:'images/'+'defaultuser.png';
            const newUser = new userData({email,password,address,firstName,lastName,mobile,nationalId,userType,imageUrl});
            newUser.verifyToken = crypto.randomBytes(32).toString('hex');
            newUser.verifyExpire = Date.now() + 60* 60 * 1000;
            await newUser.save();


            const verifyLink="http://localhost:5000/user/verifymail/"+newUser.verifyToken+"/"+newUser._id;

            const verifyMailPage = await ejsRenderFile(
                path.join(__dirname, '..', 'mails', 'verifyMail.ejs'),
                { firstName: firstName,lastName: lastName,password: OTP, link: verifyLink }
            );

            sendMail({
                from: "BJIT Academy <bjitacedemy@gmail.com>",
                to: email,
                subject: " Verify your mail",
                html: verifyMailPage
            });

            res.status(HTTP_STATUS.OK).send(success('User has been created'));

        }
        catch(error)
        {
            next(error);
        }
    }

    async editUser(req,res,next)
    {
        try
        {
            const errors = validationResult(req);
            if (!errors.isEmpty()) 
            {
                req.file?await fs.unlink(path.join(__dirname, '..', req.file.path)):"";
                return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failed(errors.array()));
            }


            const userId = req.body.userId;
            const updatedUser = await userData.findById(userId).exec();


            updatedUser.address = req.body.address?req.body.address:updatedUser.address;
            updatedUser.firstName = req.body.firstName?req.body.firstName:updatedUser.firstName;
            updatedUser.lastName=req.body.lastName?req.body.lastName:updatedUser.lastName;
            updatedUser.mobile=req.body.mobile?req.body.mobile:updatedUser.mobile;
            updatedUser.nationalId=req.body.nationalId?req.body.nationalId:updatedUser.nationalId;
            updatedUser.userType=req.body.userType?req.body.userType:updatedUser.userType;
            
            if (req.file) 
            {
                await fs.unlink(path.join(__dirname, '..', updatedUser.imageUrl));
                updatedUser.imageUrl = 'images/' + req.file.filename;
            }           
     
            await updatedUser.save();

            res.status(HTTP_STATUS.OK).send(success('User has been Updated'));

        }
        catch(error)
        {
            next(error);
        }
    }

    async deleteUser(req,res,next)
    {
        try
        {
            const userId = req.params.userId;
            const deletedUser = await userData.findById(userId).exec();

            //Delete in Batch
            if(deletedUser.userType=="trainee")
            {

                let batch= await batchData.find({"trainees.trainee":userId});
                batch=batch.map(async (singleBatch)=>
                {
                    let flag=false;
                    singleBatch.trainees=singleBatch.trainees.map(trainee=>
                    {
                        if(trainee.trainee.toString()==userId)
                        {
                            flag=true;
                        }
                    });
                    if(flag)
                    {
                        const batch = await batchData.findOne({ batchName: singleBatch.batchName}).exec();
                        batch.trainees=batch.trainees.filter(trainee=> trainee.trainee.toString()!==userId.toString());
                        batch.save();
                    }
    
                });
            }
            //Delete in Term
            if(deletedUser.userType=="trainer")
            {
                const term=await termData.find({ trainerId: userId}).exec();
                term.map(async (singleTerm)=>
                {
                    const delTerm = await termData.findOne({ _id: singleTerm._id}).exec();
                    delTerm.trainerId=undefined;
                    delTerm.save();
                });
                
            }

            //Delete From User

            await fs.unlink(path.join(__dirname, '..', deletedUser.imageUrl));
            
            const del = await userData.findOneAndDelete({_id:userId}).exec();
            if(del)
            {
                res.status(HTTP_STATUS.OK).send(success("User Deleted Successfully",del));
            }
            else
            {
                res.status(HTTP_STATUS.NOT_FOUND).send(failed("User wasn't found"));
            }
        }
        catch(error)
        {
            next(error);
        }
    }

    async resetPasswordMail(req,res,next)
    {
        try 
        {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failed(errors.array()));
            }
            const email = req.body.email;
            const user = await userData.findOne({ email: email });
            if (!user) {
                return res.status(HTTP_STATUS.NOT_FOUND).send(failed("Invalid User"));
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            user.resetToken = resetToken;
            user.resetExpire = Date.now()+1000*5*60*60;
            await user.save();

            const resetUrl = path.join(
                process.env.FRONTEND_URI,
                '/resetpassword',
                resetToken,
                user._id.toString()
            );

            const resetPassword = await ejsRenderFile(
                path.join(__dirname, '..', 'mails', 'resetPassword.ejs'),
                { firstName: user.firstName,lastName: user.lastName, link: resetUrl }
            );

            sendMail({
                from: "BJIT Academy <academy@bjitgroup.com>",
                to: email,
                subject: "Reset Your Password",
                html: resetPassword
            });

            return res.status(HTTP_STATUS.OK).send(success('Reset Password link is sent!'));
        } 
        catch (error) 
        {
            next(error);
        }
    }

    async resetPassword(req,res,next)
    {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(failed(errors.array()));
        }
        const resetToken = req.body.resetToken;
        const userId = req.body.userId;
        const password = req.body.password;

        const user = await userData.findOne({ _id: userId, resetExpire: { $gt: Date.now() } });

        if (!user) 
        {
            return res.status(HTTP_STATUS.FORBIDDEN).send(failed('Wrong User Info'));
        }
        else if(user.resetToken.toString() !== resetToken.toString())
        {
            return res.status(HTTP_STATUS.FORBIDDEN).send(failed('Invalid reset token'));
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetToken = undefined;
        user.resetExpire = undefined;
        await user.save();

        return res.status(HTTP_STATUS.OK).send(success('Reset password is successfull!'));

    }

    async verifyMail(req, res, next)
    {
        try
        {
            
            const verifyToken=req.params.verifytoken;
            const id=req.params.id;

            const user = await userData.findOne({ _id: id,verifyExpire: { $gt: Date.now() } }).exec();
            if (!user) 
            {
                return res.status(HTTP_STATUS.FORBIDDEN).send(failed('Wrong User Info'));
            }
            else if(user.verifyToken.toString() !== verifyToken.toString())
            {
                return res.status(HTTP_STATUS.FORBIDDEN).send(failed('Invalid reset token'));
            }
            user.verify=true;
            user.verifyToken=undefined;
            user.verifyExpire=undefined;
    
            await user.save();
            
            //return res.status(HTTP_STATUS.OK).send(success('User is verified'));
            return res.render('verified',{firstName:user.firstName,lastName:user.lastName});

        }
        catch (error) {
            console.log(error);
            next(error);
        }

    } 

    async verifyRefresh(req,res,next)
    {
        const id=req.params.id;
        const user = await userData.findOne({ _id: id,verify:false}).exec();
        if (!user) 
        {
            return res.status(HTTP_STATUS.FORBIDDEN).send(failed('Wrong User Info'));
        }
        user.verifyToken = crypto.randomBytes(32).toString('hex');
        user.verifyExpire = Date.now() + 60* 60 * 1000;
        user.save();

        const verifyLink="http://localhost:5000/user/verifymail/"+user.verifyToken+"/"+user._id;
        const htmlStr = await ejsRenderFile(
            path.join(__dirname, '..', 'mails', 'verifyMailRefresh.ejs'),
            { firstName: user.firstName,lastName: user.lastName, link: verifyLink }
        );

        sendMail({
            from: "Shop <shop@gmail.com>",
            to: user.email,
            subject: " Verify your mail",
            html: htmlStr
        });

        res.status(HTTP_STATUS.OK).send(success('Verify Email Refreshed'));
    }

    async getAllUser(req,res,next)
    {
        try
        {
            let filter;
            if(req.query.type=="trainee" || req.query.type=="trainer")
            {
                filter={userType:req.query.type}
            }
            else if(req.query.type==undefined)
            {
                filter={userType:{$ne:"admin" }};
            }
            else
            {
                return res.status(HTTP_STATUS.NOT_FOUND).send(failed('Invalid User Type'));

            }

            const page = parseInt(req.query.page) >0 ? req.query.page : 1;
            const items =  parseInt(req.query.page)>0 ? req.query.items : 3;
            const {skipMed} = paginationSkip(page, items);

            
            const allUser = await userData.find(filter).skip(skipMed).limit(items).select("-password -__v").exec(); 
            const totalItems = await userData.find(filter).count().exec();

            return res.status(HTTP_STATUS.OK).send(success('Users Returned',{allUser,totalItems}));
        }
        catch(error)
        {
            console.log(error);
            next(error);
        }
        
    }

    async viewSingleUser(req,res,next)
    {
        const id=req.params.id;
        const user = await userData.findOne({_id:id}).exec();
        
        res.status(HTTP_STATUS.OK).send(success("Fetched the Course successfully",{user}));
    }
    

}

module.exports = new UserController();