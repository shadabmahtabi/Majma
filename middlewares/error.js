exports.generatedErrors = (err, req, res, next) => {

    let statusCode = err.statusCode || 500;

    if (err.name = 'MongoServerError' && err.message.includes('E11000 duplicate key error collection')){
        statusCode = 409;
        err.message = 'User already exists with this credential.';
    }

    res.status(statusCode).json({
        message: err.message,
        error: err.name,
        // stack: err.stack
    })

}