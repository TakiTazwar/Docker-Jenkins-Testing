const queryFetchBatch=(query)=>
{
    const batchName = query.batchName;
    const batchNameRegex = batchName?new RegExp(batchName, 'i'):/.*/;

    const searchRegex={batchName:batchNameRegex};
    return searchRegex;
}

const queryFetchDelivery=(query)=>
{
    const address = query.address;
    const addressRegex = address?new RegExp(address, 'i'):/.*/;
    
    const searchRegex={address:addressRegex};
    return searchRegex;
}


module.exports={queryFetchBatch,queryFetchDelivery};