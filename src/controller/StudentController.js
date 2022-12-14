const userModel = require("../model/UserModel")
const StudentModel = require("../model/StudentModel")
const mongoose = require("mongoose")

const isValidType = function (value) {
   if (typeof value !== "string" || value.trim().length === 0) {
      return false;
   }
   return true;
};

const isValidNumber = function (value) {
   if (typeof value !== "number" ) {
      return false;
   }
   return true;
};


var nameRegex = /^[a-zA-Z ]{2,30}$/

const createStudent = async function (req, res) {
   try {
      let data = req.body

      const { fname, lname, subject, userId, marks, isdeleted, deletedAt } = data

      if (!fname)
         return res
            .status(400)
            .send({ status: false, message: "fname is mandatory" })

      if (fname) {

         if (!nameRegex.test(fname))
            return res
               .status(400)
               .send({ status: false, message: "name is not valid format" })

         if (!isValidType(fname))
            return res
               .status(400)
               .send({ status: false, message: "fname is must be in stirng and not a empty" })

      }

      if (!lname)
         return res
            .status(400)
            .send({ status: false, message: "firstname is mandatory" })

      if (lname) {

         if (!nameRegex.test(lname))
            return res
               .status(400)
               .send({ status: false, message: "name is not valid format" })

         if (!isValidType(lname))
            return res
               .status(400)
               .send({ status: false, message: "lname is must be in stirng and not a empty" })

      }

      if (!subject)
         return res
            .status(400)
            .send({ status: false, message: "subject is mandatory" })

      if (!isValidType(subject))
         return res
            .status(400)
            .send({ status: false, message: "subject is must be in string and can't empty" })


      if (!userId)
         return res
            .status(400)
            .send({ status: false, message: "userId is mandatory" })


      if (!mongoose.isValidObjectId(userId))
         return res
            .status(400)
            .send({ status: false, msg: "invalid userId format" });


       if(userId !==req.decode.toString())return res
       .status(403)
       .send({satus:false, message:"not Authorized User!!!"})

      let user = await userModel.findById(userId)

      if (!user)
         return res
            .status(404)
            .send({ status: false, msg: "user doesn't exist" })


      if (!marks)
         return res
            .status(400)
            .send({ status: false, message: "marks is mandatory" })

      if (!isValidNumber(marks))
         return res
            .status(400)
            .send({ status: false, message: "marks must be in Number" })

      if (isdeleted == true) {
         deletedAt = Date.now()
      }

      const findStudent = await StudentModel
         .findOne({ firstName: fname, lastName: lname, subject: subject, userId: userId })
      if (findStudent) {
         const updateStudent = await StudentModel
            .findOneAndUpdate({ firstName: fname, lastName: lname, subject: subject, userId: userId },
               { $inc: { marks: +marks } }, { new: true })
         return res
            .status(200)
            .send({ status: true, message: "successfully ", data: updateStudent })
      }

      const studentData = await StudentModel.create(data)
      return res
         .status(201)
         .send({ status: true, message: 'student created successfully', data: studentData })

   } catch (err) {
      return res
         .status(500)
         .send({ status: false, message: "server error", error: err.message })
   }
}




const getStudent = async function (req, res) {

   try {
      let userId = req.params.userId

      if (!mongoose.isValidObjectId(userId))
         return res
            .status(400)
            .send({ status: false, msg: "invalid userId format" })

      if(userId !==req.decode.toString())return res
      .status(403)
      .send({satus:false, message:"not Authorized User!!!"})
      
      let allstudent = await StudentModel.find({userId:userId,isDeleted:false}).select({_id:0,fname:1,lname:1,marks:1,subject:1})
      if (!allstudent) 
      return res
         .status(404)
         .send({ satus: false, message: "studentId does not Exist" })

      return res
         .status(200)
         .send({ status: true, message: "data fetched successfully", data: allstudent })
   }
   catch (error) {
      return res
         .status(500)
         .send({ status: false, message: "server error", Error: error.message })
   }
}



const updateStudent = async function (req, res) {

   try {
      const data = req.body

      let studentId = req.params.studentId

      const { fname, lname, subject, marks } = data

      let obj = {}


      if (!mongoose.isValidObjectId(studentId))
         return res
            .status(400)
            .send({ status: false, message: "please provide valid studentId" })
      if (Object.keys(data).length == 0)
         return res
            .status(400)
            .send({ satus: false, message: "for updation data is required" })

      let student = await StudentModel.findById(studentId)
      if (!student)
         return res
            .status(404)
            .send({ status: false, message: "student does not found" })

            if(student.userId.toString() !==req.decode.toString())
            return res
       .status(403)
       .send({satus:false, message:"not Authorized User!!!"})

      if (fname) {
         if (!isValidType(fname))
            return res
               .status(400)
               .send({ status: false, message: "first name shoud be in string" })

         if (!nameRegex.test(fname))
            return res
               .status(400)
               .send({ status: false, message: "Please Provide Valid firstName" })

         obj.fname = fname
      }

      if (lname) {

         if (!isValidType(lname))
            return res
               .status(400)
               .send({ status: false, message: "last name shoud be in string" })

         if (!nameRegex.test(lname))
            return res
               .status(400)
               .send({ status: false, message: "Please Provide Valid lastName" })

         obj.lname = lname
      }

      if (subject) {

         if (!isValidType(subject))
            return res
               .status(400)
               .send({ status: false, message: "subject should be a string" })

         obj.subject = subject
      }

      if (marks) {

         if (!isValidNumber(marks))
            return res
               .status(400)
               .send({ status: false, message: "marks should be a Number" })

         obj.marks = marks
      }

      const updateStudent = await StudentModel.findOneAndUpdate({ _id: studentId }, { $set: obj }, { new: true })

      return res
      .status(200)
      .send({ status: true, message: "Student update is successful", data: updateStudent })

   }
   catch (error) {
      return res
      .status(500)
      .send({ status: false, Error: error.message })
   }
}


const deleteStudent = async function(req, res){

   try{
       let studentId = req.params.studentId

       if (!mongoose.isValidObjectId(studentId)){
           return res
           .status(400)
           .send({ status: false, message: "please provide valid studentId" })
       }

       const student = await StudentModel.findOne({ _id: studentId, isDeleted: false })
       if (!student) {
           return res
           .status(404)
           .send({ status: false, message: "student does not found" })
       }

       if(student.userId.toString() !==req.decode.toString())return res
       .status(403)
       .send({satus:false, message:"not Authorized User!!!"})

       await StudentModel.updateOne({ _id: studentId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date()}})
       return res.status(200).send({ status: true, message: "student deleted successfully" })
   }
   catch(error){
     return  res
     .status(500)
     .send({status : false,message:"server error" ,Error : error.message})
   }
}



module.exports = { createStudent, getStudent,updateStudent,deleteStudent }