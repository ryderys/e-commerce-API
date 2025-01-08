const express = require('express');
const { mainRouter } = require('./src/app.routes');
const { NotFoundHandler, ErrorHandler } = require('./src/common/utils/errorohandling');
const setupSwagger = require('./src/config/swagger.config');
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(mainRouter)

setupSwagger(app)

app.use(NotFoundHandler)
app.use(ErrorHandler)
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running')
})