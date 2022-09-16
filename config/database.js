const mongoose = require('mongoose');

const dbConnect = async (callback)=>{
    try 
    {
        const client = await mongoose.connect("mongodb+srv://tgop2:01711188881@mongolearn.rzdxtdd.mongodb.net/?retryWrites=true&w=majority");
        if(client)
        {
            console.log("Database is Connected");
        }
        callback();
    } 
    catch (error) 
    {
        throw new Error(error.message);
    }
}


module.exports = dbConnect;