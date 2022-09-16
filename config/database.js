const mongoose = require('mongoose');

const dbConnect = async (callback)=>{
    try 
    {
        const client = await mongoose.connect("mongodb+srv://tgop:01711188881@Me@mongolearn.sdong.mongodb.net/academy_project?retryWrites=true&w=majority");
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