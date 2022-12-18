const productModel = require('../models/product.js');
const apiResponse = require('../utils/apiResponse.js');

exports.createProduct = async (req, res) => {
    const { id, name, price , loggedUserType } = req.body;
    console.log('1');
    console.log(id, name, price , loggedUserType);
    if (!name || !id || !price  || !loggedUserType) {
        return apiResponse.badRequest(res);
    }
    console.log('2');

    if (loggedUserType !== 'manufacturer' ) {
        return apiResponse.badRequest(res);
    }
    console.log('3');

    const modelRes = await productModel.createProduct({ name, id, price });
    return apiResponse.send(res, modelRes);
};

exports.updateProduct = async (req, res) => {
    const { id, name, price , loggedUserType } = req.body;
    const { role, productId } = req.params;
    console.log('1');

    if (!productId || !name || !id || !price || !loggedUserType || !role) {
        return apiResponse.badRequest(res);
    }
    console.log('2');

    if (loggedUserType === 'consumer' ) {
        return apiResponse.badRequest(res);
    }
    console.log('3');

    let modelRes
    if( role === 'manufacturer' ) {
        modelRes = await productModel.updateProduct(true, false,false, { productId, id, name, price });
    } else if( role === 'middlemen' ) {
        modelRes = await productModel.updateProduct(false, true, false, { productId, id, name, price });
    } else {
        return apiResponse.badRequest(res);
    }
    return apiResponse.send(res, modelRes);
};

exports.getProductbyId = async (req, res) => {
    //const { id } = req.body;
    const id ="admin";
    const { productId, role } = req.params

    console.log('1');
    console.log(id);
    if (!productId || !id || !role ) {
        return apiResponse.badRequest(res);
    }
    console.log('2');
    console.log('3');
    let modelRes;
    if( role === 'manufacturer' ) {
        modelRes = await productModel.getProductById(true, false, false, { productId, id });
    } else if( role === 'middlemen' ) {
        modelRes = await productModel.getProductById(false, true, false,{ productId, id });
    } else if( role === 'consumer' ) {
        modelRes = await productModel.getProductById(false, false, true, { productId, id });
    } else {
        return apiResponse.badRequest(res);
    }
    console.log(modelRes);
    return apiResponse.send(res, modelRes);
};

exports.getAllProducts = async (req, res) => {
    const { id } = req.body;
    const { role } = req.params

    console.log('req received processing');
    console.log(id,role);
    if (!role ) {
        console.log('id role missing');
        return apiResponse.badRequest(res);
    }
    console.log('id role checked');
    console.log('3');
    let modelRes;
    if( role === 'manufacturer' ) {
        modelRes = await productModel.getAllProducts(true, false, false, { id });
    } else if( role === 'middlemen' ) {
        modelRes = await productModel.getAllProducts(false, true, false,{ id });
    } else if( role === 'consumer' ) {
        modelRes = await productModel.getAllProducts(false, false, true, { id });
    } else {
        return apiResponse.badRequest(res);
    }
    return apiResponse.send(res, modelRes);
};

exports.createOrder = async (req, res) => {
    // find who initiates this event by decoding the token and getting the user type
    const { id, loggedUserType , productId , userId } = req.body;
    console.log('1');
    
    if ( !userId || !loggedUserType || !productId || !id) {
        return apiResponse.badRequest(res);
    }
    console.log('2');
    let modelRes;
    if(loggedUserType == 'consumer')
    {
        // call order product
        modelRes = await productModel.createOrder({ productId , userId , id  });
                
    } else {
        return apiResponse.badRequest(res);
    }
    console.log('3');
    return apiResponse.send(res, modelRes);
};

