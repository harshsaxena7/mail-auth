const jwt = require("jsonwebtoken");


const TOKEN_SECRET =
    "877a775acb16b22fb7cdd56a964b4c715ca4c1b3ff3fb1332894d276842c901059dee05fa698796aa2e285047bae3e40b8c0996b480a082b0c7d3022712d150e";
function generateResetPasswordToken(userJson) {
    // expires after half and hour (1800 seconds = 30 minutes)
    var authJson = {
        email: userJson.email,
    };
    return jwt.sign(authJson, TOKEN_SECRET);
}

function generateAccessToken(userJson) {
    // expires after half and hour (1800 seconds = 30 minutes)
    var authJson = {
        email: userJson.email,
        name: userJson.name
    };
    return jwt.sign(authJson, TOKEN_SECRET);
}


async function verifyToken(authToken) {
    var rtnVal = "";
    var userData = "";
    try {
        userJson = jwt.verify(authToken, TOKEN_SECRET);
        console.log("userJson token", userJson);
        if (userJson.login_id != "" || userJson.login_id != undefined) {
            rtnVal = userJson.email
        } else {
            rtnVal = "invalid-token";
        }
    } catch (err) {
        if (err != null && err != "" && err.name == "TokenExpiredError") {
            rtnVal = "TokenExpiredError";
        }
    }

    return rtnVal;

}

module.exports = {
    verifyToken,
    generateAccessToken,
    generateResetPasswordToken
};