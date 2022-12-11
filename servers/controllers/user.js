const authModel = require('../models/user.js');
const apiResponse = require('../utils/apiResponse.js');

exports.signup = async (req, res) => {
    const { userType, address, name, email, password } = req.body;
    const { role } = req.params;

    console.log(req.body);
    console.log(role);

    if ((!userType || !address || !name  || !email || !password )) {
        console.log('1');
        return apiResponse.badRequest(res);
    }

    let modelRes;

    if (userType === 'manufacturer') {
        modelRes = await authModel.signup(true, false, false, {  userType, address, name, email, password });
    } else if (userType === 'wholesaler' || userType === 'distributor' || userType === 'retailer') {
         modelRes = await authModel.signup(false, true, false, {  userType, address, name, email, password });
    } else if (userType === 'consumer') {
         modelRes = await authModel.signup(false, false, true, {  userType, address, name, email, password });
    } else {
        return apiResponse.badRequest(res);
    }

    return apiResponse.send(res, modelRes);
};

exports.signin = async (req, res) => {
    const { id, password } = req.body;
    const { role } = req.params;
    console.log("role:"+role+" "+id + " "+ password);
    if (!id || !password || !role) {
        return apiResponse.badRequest(res);
    }
    let modelRes;
    if (role === 'admin') {
        modelRes = await authModel.signin(true, false, false, { id, password });
    }else if (role === 'manufacturer') {
        modelRes = await authModel.signin(true, false, false, { id, password });
    } else if (role === 'middlemen') {
        modelRes = await authModel.signin(false, true, false, { id, password });
    } else if (role === 'consumer') {
        modelRes = await authModel.signin(false, false, true, { id, password });
    } else {
        return apiResponse.badRequest(res);
    }
    console.log(modelRes);
    return apiResponse.send(res, modelRes);
};


exports.getAllUser = async (req, res) => {
    const { role } = req.params;

    let modelRes;
    if (role === 'admin') {
        modelRes = await authModel.getAllUser();
    } else if (role) {
        modelRes = await authModel.getUserByUserType(role);
    } else {
        return apiResponse.badRequest(res);
    }
    console.log(modelRes);
    return apiResponse.send(res, modelRes);
};
exports.getUserById = async (req, res) => {
    const { userId, role } = req.params

    console.log('1');
    if (!userId || !role ) {
        return apiResponse.badRequest(res);
    }
    console.log('2');
    console.log('3');
    let modelRes;
    if( role === 'admin' ) {
        modelRes = await authModel.getUserById(true, false, false, { userId, role });
    }else {
        return apiResponse.badRequest(res);
    }
    console.log(modelRes);
    return apiResponse.send(res, modelRes);
};
exports.updateUser = async (req, res) => {
    const { name, email, usertype , address } = req.body;
    const { role, userId } = req.params;
    console.log('1');
    if (!userId || !name || !email || !usertype || !address || !role) {
        return apiResponse.badRequest(res);
    }
    console.log('2');

    let modelRes
    if( role === 'admin' ) {
        modelRes = await authModel.updateUser(true, false,false, { userId, name, email, usertype , address });
    } else {
        return apiResponse.badRequest(res);
    }
    return apiResponse.send(res, modelRes);
};


