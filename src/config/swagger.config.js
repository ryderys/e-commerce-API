const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express")

const options = swaggerJsDoc({
    openapi: "3.0.3",
    info: {
        title: "E-commerce API",
        version: "1.0.0",
        description: "API documentation for the user e-commerce application",
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Development server",
        },
    ],
    apis: [process.cwd() + "/src/modules/**/*.swagger.js"],
})
function setupSwagger(app){
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(options))
}

module.exports = setupSwagger