const AppError = require('../utils/AppError');

// Middleware to check if user is admin
const adminMiddleware = (req, res, next) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return next(new AppError('Authentication required', 401));
        }

        // Check if user has admin role
        if (req.user.role !== 'admin') {
            return next(new AppError('Admin access required', 403));
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = adminMiddleware;