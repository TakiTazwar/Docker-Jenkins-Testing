const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
{
    courseName:
    {
        type: String,
        required: true
    },
    courseDetails:
    {
        type: String,
        required: true
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

},{collection: 'course'});

const courseData=mongoose.model('Course',courseSchema);

module.exports = courseData;