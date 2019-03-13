const jwt = require('jsonwebtoken');

let secret = 'secret65XyGtrR32';

const GetToken = (payload) => {
    // payload.exp = Date.now();
    return jwt.sign(payload, secret)
}

const authenticateTokenOrUnauthorized = (req, res, next) => {
    let token = req.header('x-auth');
    let decoded;
    try {
        decoded = jwt.verify(token, secret);
        next();
    }
    catch(e){
        res.status(401).send();;
    }
}

module.exports = {
    authenticateTokenOrUnauthorized,
    GetToken,
    
}
