const express = require ("express")
const route = express.Router()
const {createUser,loginUser} = require ("../controller/UserController")
const{createStudent,getStudent,updateStudent,deleteStudent} = require("../controller/StudentController")
const {authentication,authorization} = require("../middleware/auth")


route.post("/register", createUser)
route.post("/login",loginUser)

route.post("/createstudent",authentication,authorization ,createStudent)
route.get("/getstudent",authentication,authorization,getStudent)
route.put("/updatestudent",authentication,authorization ,updateStudent)
route.delete("/deletestudent",authentication,authorization,deleteStudent)









module.exports= route