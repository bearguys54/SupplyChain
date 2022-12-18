const transactModel = require('../models/transact.js');
const apiResponse = require('../utils/apiResponse.js');

exports.transactProduct = async (req, res) => {
    console.log('begin transact');

    // find who initiates this event by decoding the token and getting the user type
    const { id, loggedUserType , productId , userId } = req.body;
    console.log('1',id, loggedUserType , productId , userId);
    console.log('start transact');
    
    if ( !userId || !loggedUserType || !productId || !id) {
        return apiResponse.badRequest(res);
    }
    console.log('controoler called by: '+ loggedUserType);
    let modelRes;
    if(loggedUserType == 'manufacturer')
    {
        // call send to Wholesaler
        modelRes= await transactModel.sendToWholesaler({ productId , userId , id });
    }
    else if(loggedUserType == 'wholesaler')
    {
        // call send to Distributor
        modelRes = await transactModel.sendToDistributer({ productId , userId , id });
    }
    else if(loggedUserType == 'distributor')
    {
        // call send to Retailer
        modelRes = await transactModel.sendToRetailer({ productId , userId , id  });
    }
    else if(loggedUserType == 'retailer')
    {
        // call send to Retailer
        console.log("controller selling to customer");
        modelRes = await transactModel.sellToConsumer({ productId , userId , id  });
    } else {
        return apiResponse.badRequest(res);
    }
    console.log('3');
    return apiResponse.send(res, modelRes);
};

exports.orderProduct = async (req, res) => {
    // find who initiates this event by decoding the token and getting the user type
    const { id, loggedUserType , productID , userId } = req.body;
    console.log('HI');
    console.log('order call received with data: ' + productID+ userId);
    
    if ( !userId || !loggedUserType || !productID || !id) {
        console.log('He');
        return apiResponse.badRequest(res);
    }
    console.log('Begining order');
    let modelRes;
    if(loggedUserType == 'consumer')
    {
        // call order product
        console.log('calling model order');
        modelRes = await transactModel.createOrder({ productID , userId , id  });
                
    } else {
        return apiResponse.badRequest(res);
    }
    console.log('3');
    return apiResponse.send(res, modelRes);
};

exports.deliverProduct = async (req, res) => {
    // find who initiates this event by decoding the token and getting the user type
    const { id, loggedUserType , productID , userId } = req.body;
    console.log('deliver call received with data: ' + productID+ userId);
    
    if ( !userId || !loggedUserType || !productID || !id) {
        return apiResponse.badRequest(res);
    }
    console.log('Begining deliver');
    let modelRes;
    if(loggedUserType == 'consumer')
    {
        // call order product
        console.log('calling model deliver');
        modelRes = await transactModel.deliverProduct({ productID , userId , id });
                
    } else {
        return apiResponse.badRequest(res);
    }
    console.log('3');
    return apiResponse.send(res, modelRes);
};

exports.transactProductConsumer = async (req, res) => {
    // find who initiates this event by decoding the token and getting the user type
    const { id, loggedUserType , productId , userId } = req.body;
    console.log('1',id, loggedUserType , productId , userId);
    if (!userId || !loggedUserType || !productId || !id) {
        return apiResponse.badRequest(res);
    }
    console.log('2');
    let modelRes;
    if(loggedUserType == 'retailer') {
        modelRes= await transactModel.sellToConsumer({ productId , id });
    } else {
        return apiResponse.badRequest(res);
    }

    console.log('3');
    return apiResponse.send(res, modelRes);
};
