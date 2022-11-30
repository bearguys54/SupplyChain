const authenticateUtil = require('../utils/authenticate');
const apiResponse = require('../utils/apiResponse.js');

module.exports = async (req, res, next) => {
    const accessToken = req.headers['x-access-token'];
    if (!accessToken) {
        console.log("authentokennull");
        return apiResponse.unauthorized(res, 'Required access token');
    }

    try {
        const result = await authenticateUtil.certifyAccessToken(accessToken);
        req.body.id = result.id;
        req.body.loggedUserType = result.UserType;
        req.body.loggedUserName = result.Name;
        return next();
    } catch (err) {
        console.log("authentokenerror");
        return apiResponse.unauthorized(res, err.toString());
    }
};
