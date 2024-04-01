class ErrorHandler extends Error {
    
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // Making 'Error' objects from the constructors of other errors to make sure that stacktraces show the context of where our error was
        Error.captureStackTrace(this, this.constructor);
    }

}

module.exports = ErrorHandler;