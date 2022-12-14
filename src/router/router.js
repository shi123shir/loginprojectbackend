const express = require ("express")
const route = express.Router()
const {createUser,loginUser} = require ("../controller/UserController")
const{createStudent,getStudent,updateStudent,deleteStudent} = require("../controller/StudentController")
const {authentication} = require("../middleware/auth")


route.post("/register", createUser)
route.post("/login",loginUser)

route.post("/createstudent",authentication,createStudent)
route.get("/getstudent/:userId",authentication,getStudent)
route.put("/updatestudent/:studentId",authentication,updateStudent)
route.delete("/deletestudent/:studentId",authentication,deleteStudent)









module.exports= route