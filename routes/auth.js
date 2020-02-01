const router = require('express').Router();

const User = require('../model/User');

const {registerValidation, loginValidation} = require('../validation');

const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

router.post('/register', async(request, response) => {
    // user validation
    const {error} = registerValidation(request.body);

    if (error) return response.status(400).send(error.details[0].message);

    // check if the user is in database already
    const emailExist = await User.findOne({
        email: request.body.email
    })

    if(emailExist) return response.status(400).send('Email already exists.')

    // hash the password
    const salt = await bcrypt.genSalt(10);     // complexity of the string is 10
    const hashedPassword = await bcrypt.hash(request.body.password, salt);

    // creates new user
    const user = new User ({
        name: request.body.name,
        email: request.body.email,
        password: hashedPassword,
    })

    try{
        const savedUser = await user.save();
        response.send({user: user._id});
    }catch(err){
        response.status(400).send(err);
    }
});

// LOGIN

router.post('/login', async(request, response) =>{
    const {error} = loginValidation(request.body);
    if (error) return response.status(400).send(error.details[0].message);

    // check if the user is in database already
    const user = await User.findOne({
        email: request.body.email
    });
    if(!user) return response.status(400).send('Email is not found.');

    // check if the password is correct
    const validPass = await bcrypt.compare(request.body.password, user.password);
    if(!validPass) return response.status(400).send('Invalid password.');

    // create token
    const token = jsonwebtoken.sign({id: user._id,}, process.env.TOKEN_TAG);
    response.header('auth-token', token).send(token);  // generates a token with a json in
});

module.exports = router;