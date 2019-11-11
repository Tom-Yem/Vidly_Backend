const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req,res,next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(400).send('Token is not provided,please send token through header!')
    try{
        let Decodedpayload = jwt.verify(token,config.get('privateKey'));
        req.user = Decodedpayload;
        next();
    }catch(e){
        res.status(401).send('Unauthorized request!');
    }
}
