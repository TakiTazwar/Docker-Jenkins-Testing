const mongoose = require('mongoose');

const dbConnect = async (callback)=>{
    try 
    {
        const client = await mongoose.connect(process.env.DATABASE_CONNECTION);
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