const network = require('../fabric/network.js');
const apiResponse = require('../utils/apiResponse.js');
const authenticateUtil = require('../utils/authenticate.js');


exports.signup = async (isManufacturer, isMiddlemen, isConsumer, information) => {
    const { id, userType, address, name, email, password } = information;

    let networkObj;
    networkObj = await network.connect(isManufacturer, isMiddlemen, isConsumer, id);
    
    let contractRes;
    contractRes = await network.invoke(networkObj, 'createUser', name, email, userType, address, password);
    console.log('5');
    const walletRes = await network.registerUser(isManufacturer, isMiddlemen, isConsumer, contractRes.UserID);

    const error = walletRes.error || networkObj.error || contractRes.error;
    if (error) {
        const status = walletRes.status || networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.signin = async (isManufacturer, isMiddlemen, isConsumer, information) => {
    const { id, password } = information;
    console.log("0000");

    const networkObj = await network.connect(isManufacturer, isMiddlemen, isConsumer, "admin");
    let contractRes;
    console.log("1111");
    contractRes = await network.invoke(networkObj, 'signIn', id, password);
    const error = networkObj.error || contractRes.error;
    console.log("11112222");
    if (error) {
        console.log("2222");
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);


    }
    console.log("contract res");
    console.log(contractRes);
    console.log("3333");
    const { Name, UserType } = contractRes;
    const accessToken = authenticateUtil.generateAccessToken({ id, UserType, Name });
    return apiResponse.createModelRes(200, 'Success', { id, UserType, Name, accessToken });
};

exports.getAllUser = async (isManufacturer, isMiddlemen, isConsumer, information) => {
    const { id } = information;

    const networkObj = await network.connect(true, false, false, 'admin');

    const contractRes = await network.invoke(networkObj, 'queryAll', 'User');

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};