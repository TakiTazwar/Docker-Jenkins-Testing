const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema(
{
    batchName:
    {
        type: String,
        required: true
    },
    batchDate:
    {
        type: Date,
        required: true
    },
    trainees:
    [
        {
            trainee:
            {
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref: 'User'
            }
        }
    ]

},{collection: 'batch'});

const batchData=mongoose.model('Batch',batchSchema);

module.exports = batchData;