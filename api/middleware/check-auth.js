const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[0];
        console.log(token);
        const verify = jwt.verify(token, 'this is dummy text');
        next();
    } catch (err) {
        res.status(200).json({

            msg: 'invalid token'
        })
    }


}