const { body } = require('express-validator');
const userData = require('../model/users');

const validator = {
    
    addUser: [
        body('email')
            .notEmpty()
            .withMessage('email is required')
            .isEmail()
            .withMessage('email must be valid!')
            .custom(async(value) => {
                const foundUser = await userData.findOne({email:value}).exec();
                if(foundUser)
                {
                    return Promise.reject("User email already exists");
                }
                return true;
            }),
        body('userType')
            .notEmpty()
            .withMessage('user type is required')
            .isString()
            .withMessage('user type must be string!')
            .custom((value) => {
                if(value.toLowerCase()!=="trainee" && value.toLowerCase()!=="trainer")
                {
                    return Promise.reject("User type does not exist");
                }
                return true;
            }),
        body('mobile')
            .notEmpty()
            .withMessage('mobile is required')
            .isNumeric()
            .withMessage('mobile must be string!'),
        body('firstName')
            .notEmpty()
            .withMessage('firstName is required')
            .isString()
            .withMessage('firstName must be string!'),
        body('lastName')
            .notEmpty()
            .withMessage('lastName is required')
            .isString()
            .withMessage('lastName must be string!'),
        body('address')
            .notEmpty()
            .withMessage('address is required')
            .isString()
            .withMessage('address must be string!'),
    ],

    editUser: [
        body('userType')
            .optional()
            .isString()
            .withMessage('user type must be string!')
            .custom((value) => {
                if(value.toLowerCase()!=="trainee" && value.toLowerCase()!=="trainer")
                {
                    return Promise.reject("User type does not exist");
                }
                return true;
            }),
        body('mobile')
            .optional()
            .isNumeric()
            .withMessage('mobile must be string!'),
        body('firstName')
            .optional()
            .isString()
            .withMessage('firstName must be string!'),
        body('lastName')
            .optional()
            .isString()
            .withMessage('lastName must be string!'),
        body('address')
            .optional()
            .isString()
            .withMessage('address must be string!'),
    ],

    login: [
        body('email')
            .notEmpty()
            .withMessage('email is required')
            .isEmail()
            .withMessage('email must be valid!'),
        body('password')
            .notEmpty()
            .withMessage('password type is required')
            .isString()
            .withMessage('password type must be string!'),
    ],

    resetPasswordMail: [
        body('email')
            .notEmpty()
            .withMessage('email is required')
            .isEmail()
            .withMessage('email must be valid!'),
    ],
    resetPassword: [
        body("resetToken")
            .isString()
            .withMessage("Token is required and must be string"),
        body("userId")
            .trim()
            .isString()
            .withMessage("userId is required and must be string"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Passowrd must be at least 6 character"),
        body("confirm_password")
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                throw new Error("Password doesn't match!");
                }
                return true;
            }),
    ]


};

module.exports = validator;