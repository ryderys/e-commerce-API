const httpErrors = require("http-errors")
function NotFoundHandler(req, res, next) {
    next(httpErrors.NotFound("The requested route was not found."))
}

function ErrorHandler(err, req, res, next){
    if(err.isJoi){
        return res.status(400).json({
            error: {
                statusCode: 400,
                message: "validation error",
                details: err.details.map(detail => detail.message)
            }
        })
    }
    const statusCode = err.status || err.statusCode || 500
    const message = err.message || "Internal Server Error"
    return res.status(statusCode).json({
        error: {
            statusCode,
            message
        }
    })
}

module.exports = {
    NotFoundHandler,
    ErrorHandler
}