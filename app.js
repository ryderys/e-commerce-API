const express = require('express');
const { mainRouter } = require('./src/app.routes');
const { NotFoundHandler, ErrorHandler } = require('./src/common/utils/errorohandling');
const { setupSwagger } = require('./src/config/swagger.config');
const cookieParser = require("cookie-parser")
const path = require("path")
const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/public",express.static(path.join(process.cwd(), "public")))
app.use(mainRouter)

setupSwagger(app)

require("./src/config/db.config")

app.use(NotFoundHandler)
app.use(ErrorHandler)
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT || 3000}/swagger`);
})