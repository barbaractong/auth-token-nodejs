const jsonwebtoken = require('jsonwebtoken')

module.exports = function (request, response, next){
    const token = request.header('auth-header');
    if(!token) return response.status(401).send('Access denied.');

    try {
        const verified = jsonwebtoken.verify(token, process.env.TOKEN_TAG);
        request.user = verified
        next()
    } catch (error) {
        response.status(400).send('Invalid token');
    }
}