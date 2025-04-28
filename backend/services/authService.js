const User = require('../models/User');

exports.findUserByEmail = (email) =>{
    User.findOne({email});
}
exports.createUser = (userData) =>{
    User.create(userData);
}