const router = require('express').Router();
const verify = require('./authToken')

router.get('/', verify, (request, response) => {
    response.send(request.user);
    
    /*
    response.json({
        posts: 
            {
                title: 'post test', 
                description: 'random data. dont have access.',
            }
        })
    */
})
module.exports = router;