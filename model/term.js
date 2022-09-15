const mongoose = require('mongoose');

const termSchema = new mongoose.Schema(
{
    termName:
    {
        type: String,
        required: true
    },
    startDate:
    {
        type: Date,
        required: true
    },
    endDate:
    {
        type: Date,
        required: true
    },

    batchId:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Batch'
    },
    courseId:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    trainerId:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Quizes:
    [
        {
            quizName:
            {
                type: String,
                required: true
            },
            quizDetails:
            {
                type: String,
                required: true
            },
            marks:
            [
                {
                    trainee:
                    {
                        type:mongoose.Schema.Types.ObjectId,
                        required:true,
                        ref: 'User'
                    },
                    mark:
                    {
                        type: Number,
                        required:true,
                    }
                }
            ]
        }
    ]

},{collection: 'term'});

const termData=mongoose.model('Term',termSchema);

module.exports = termData;