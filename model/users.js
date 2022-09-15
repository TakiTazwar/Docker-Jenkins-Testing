const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:
    {
        type: String,
        required: true
    },
    password:
    {
        type: String,
        required: true
    },
    address:
    {
        type: String,
        required: true
    },
    firstName:
    {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    mobile:
    {
        type: String,
        required: true
    },
    imageUrl:
    {
        type: String,
        required: false
    },
    nationalId:
    {
        type: String,
        required: true
    },
    userType:
    {
        type: String,
        required: true
    },
    verify:
    {
        type: Boolean,
        default: false
    },
    courseTopics:
    [
        {
            topics:
            {
                type:String,
                required:true
            }
        }
    ],

    resetToken: String,
    resetExpire: Date,
    verifyToken: String,
    verifyExpire: Date

},{collection: 'users'});

const userData=mongoose.model('User',userSchema);

module.exports = userData;