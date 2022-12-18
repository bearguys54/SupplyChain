const network = require('../fabric/network.js');
const apiResponse = require('../utils/apiResponse.js');
const authenticateUtil = require('../utils/authenticate.js');


exports.signup = async (isManufacturer, isMiddlemen, isConsumer, information) => {
    const { userType, address, name, email, password } = information;

    let networkObj;
    networkObj = await network.connect(isManufacturer, isMiddlemen, isConsumer, "admin");
    
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
    console.log("conneting");
    // const networkObj = await network.connect(isManufacturer, isMiddlemen, isConsumer, id);
    const networkObj = await network.connect(isManufacturer, isMiddlemen, isConsumer, "admin");

    let contractRes;
    console.log("conneted");
    contractRes = await network.invoke(networkObj, 'signIn', id, password);
    console.log("test3");
    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }
    console.log(contractRes);
    const { Name, UserType } = contractRes;
    const accessToken = authenticateUtil.generateAccessToken({ id, UserType, Name });
    return apiResponse.createModelRes(200, 'Success', { id, UserType, Name, accessToken });
};

exports.getAllUser = async () => {

    const networkObj = await network.connect(true, false, false, 'admin');

    const contractRes = await network.invoke(networkObj, 'queryAll', 'User');

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }
    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.getUserById = async (isManufacturer, isMiddlemen, isConsumer, information) => {
    const {userId, role } = information;

    const networkObj = await network.connect(true, false, false, "admin");

    const contractRes = await network.invoke(networkObj, 'queryAsset', userId);

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }
    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.getUserByUserType = async (role,targetUser) => {
    
    const allUSer = (await exports.getAllUser()).data;
    let contractRes;
    if (role === "manufacturer") {
        contractRes = (targetUser === "true")?allUSer.filter((item) => item.Record.UserType === "wholesaler" ):allUSer.filter((item) => item.Record.UserType === "manufacturer" );
    } else if (role === "wholesaler") {
        contractRes = (targetUser === "true")?allUSer.filter((item) => item.Record.UserType === "distributor" ):allUSer.filter((item) => item.Record.UserType === "wholesaler" );
    }else if (role === "distributor") {
        contractRes = (targetUser === "true")?allUSer.filter((item) => item.Record.UserType === "retailer" ):allUSer.filter((item) => item.Record.UserType === "distributor" );
    }else if (role === "retailer") {
        contractRes = (targetUser === "true")?allUSer.filter((item) => item.Record.UserType === "consumer" ):allUSer.filter((item) => item.Record.UserType === "retailer" );
    }else if(role === "consumer")
    {
        contractRes = allUSer.filter((item) => item.Record.UserType === "consumer" );
    }
    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.updateUser = async ( isManufacturer, isMiddlemen, isConsumer ,information ) => {
    const { userId, name, email, usertype , address } = information;

    const networkObj = await network.connect(isManufacturer, isMiddlemen, isConsumer, "admin");
    const contractRes = await network.invoke(networkObj, 'updateUser',userId, name, email, usertype , address );

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};
