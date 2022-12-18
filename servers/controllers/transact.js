const transactModel = require('../models/transact.js');
const apiResponse = require('../utils/apiResponse.js');

exports.transactProduct = async (req, res) => {
    // find who initiates this event by decoding the token and getting the user type
    const { id, loggedUserType , productId , userId } = req.body;
    console.log('1',id, loggedUserType , productId , userId);
    
    if ( !userId || !loggedUserType || !productId || !id) {
        return apiResponse.badRequest(res);
    }
    console.log('2');
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
    }else if(loggedUserType == 'retailer')
    {
        modelRes = await exports.transactProductConsumer(req,res);
    } 
    else {
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
exports.orderProduct = async (req, res) => {
    // find who initiates this event by decoding the token and getting the user type
    const {currproductId , user_id } = req.body;
    const {role} = req.params;
    console.log('1');
    if (!currproductId || !user_id||role) {
        return apiResponse.badRequest(res);
    }
    console.log('2');
    let modelRes;
    if(role == 'consumer') {
        modelRes= await transactModel.orderProduct({ currproductId , user_id });
    } else {
        return apiResponse.badRequest(res);
    }

    console.log('3');
    return apiResponse.send(res, modelRes);
};