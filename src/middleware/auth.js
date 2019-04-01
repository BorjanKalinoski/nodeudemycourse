const jwb = require('jsonwebtoken');
const User = require('../models/user-model');
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        const decode = jwb.verify(token, 'thisismysecret');
        const user = await User.findOne({_id: decode._id, 'tokens.token': token});
        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next();
    }catch (e) {
        return res.status(401).send({error: 'Please authenticate'});
    }
};

module.exports = auth;