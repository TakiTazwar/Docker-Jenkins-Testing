const success=(message,data=null)=>
{
    const format=
    {
        success:true,
        message:message,
        data:data
    }

    data?data:delete format.data;

    return {
        ...format
    }
}
const failed=(message)=>
{
    return {
        success:false,
        message:message
    }
}


module.exports={success,failed}