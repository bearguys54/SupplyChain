const authenticateUtil = require('../utils/authenticate');
const apiResponse = require('../utils/apiResponse.js');

module.exports = async (req, res, next) => {
    console.log("auth");
    const accessToken = req.headers['x-access-token'];

    if (!accessToken) {
        return apiResponse.unauthorized(res, 'Required access token');
        console.log("auth err no token");
    }
    console.log("auth access  token found");
    try {
        console.log("auththenticating");
        const result = await authenticateUtil.certifyAccessToken(accessToken);
        console.log("auth access token ver");
        req.body.id = result.id;
        req.body.loggedUserType = result.UserType;
        req.body.loggedUserName = result.Name;
        console.log("authcompleted");
        return next();
    } catch (err) {
        return apiResponse.unauthorized(res, err.toString());
    }
    console.log("auth next");
};
