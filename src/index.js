const express = require("express")
const route = require("./router/router")
const mongoose = require ("mongoose")
const app = express()

app.use(express.json())

mongoose.set('strictQuery', true)

mongoose.connect("mongodb+srv://shishir1912-DB:F85ml8mUXi1MrEKV@cluster0.2ta5zuw.mongodb.net/loginassinment",
{useNewUrlParser:true}
).then(()=>console.log("mongoose connected successfully"))
.catch((err)=>err)

app.use("/",route)

app.listen(process.env.PORT||3000,function(){console.log("app is running " + (3000))} )