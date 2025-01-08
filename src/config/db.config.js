const {MongoClient} = require("mongodb")
const dotenv = require("dotenv")
const { default: mongoose } = require("mongoose")
dotenv.config()

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("connected to DB");
    
}).catch(err => {
    console.log(err?.message ?? "failed to connect to DB");
})
