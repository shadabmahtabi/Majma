exports.generatedErrors = (err, req, res, next) => {

    let statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message: err.message,
        error: err.name
    })

}