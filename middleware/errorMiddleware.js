// Error tracking endpoint, sets statuscode and returns an error 
// message, withholding stack trace if in production

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    res.status(statusCode).json( {
        message: err.message.split(','),
        body: req.body ? req.body : null,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
}

module.exports = errorHandler;