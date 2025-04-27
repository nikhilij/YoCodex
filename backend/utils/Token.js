// this util will be used to generate and verify JWT tokens

const JWT = require('jsonwebtoken');
const dotenv = require('dotenv').config();

exports.generateToken = (userId) =>{
    return JWT.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '1hr',
    });
}

