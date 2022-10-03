const jwt = require('jsonwebtoken');
const JWT_TOKEN = "asdfghjklzxcvbnm";



const auth = (req, res, next) => {
    console.log('I was here');
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }
        const { userId } = jwt.verify(
            req.headers.authorization,
            JWT_TOKEN

        );
        console.log('this is the userId', userId);
        req.userId = userId;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ msg: 'Unauthorized' });
    }
};

module.exports = { auth }