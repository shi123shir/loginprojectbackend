const Usermodel = require("../model/UserModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

var passwordregex =/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}$/
var emailregex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

const createUser = async function (req, res) {
   try {

      let data = req.body
      const { fname, lname, email, password } = data

      if (Object.keys(data).length === 0)
         return res
            .status(400)
            .send({ status: false, message: "data is required fild" })

      if (!fname)
         return res
            .status(400)
            .send({ status: false, message: "first name is required" })

      if (!/^[a-zA-Z ]{2,30}$/.test(fname))
         return res
            .status(400)
            .send({ status: false, message: "enter firstname in correct format" })

      if (!lname)
         return res
            .status(400)
            .send({ status: false, message: "lastname is required" })

      if (!/^[a-zA-Z ]{2,30}$/.test(lname))
         return res
            .status(400)
            .send({ status: false, message: "enter lastname  in correct format" })

      if (!email)
         return res
            .status(400)
            .send({ status: false, message: "email is mandatory" })

      if (!emailregex.test(email))
         return res
            .status(400)
            .send({ status: false, message: "Invalid Email Id" });

      let validEmail = await Usermodel.findOne({ email: email });
      if (validEmail)
         return res
            .status(400)
            .send({ status: false, message: "E-mail already taken" });

      if (!password)
         return res
            .status(400)
            .send({ status: false, message: "please enter password" })

      if (!passwordregex.test(password))
         return res
            .status(400)
            .send({ status: false, message: "please enter password in valid fromat", });

      data.password = await bcrypt.hash(password, 10)

      let savedData = await Usermodel.create(data)

      return res.
      status(201).
      send({ statsu: true, message: "user created sucessfully", data: savedData })

   } catch (err) {
      return res
         .status(500)
         .send({ status: false, message: err.message })
   }
}


const loginUser = async function(req,res){
   try {
      let data = req.body
      const { email, password } = data

      if (Object.keys(data).length === 0) 
       return res
       .status(400)
       .send({ status: false, message: 'please provide some data'})
      

      if (!email) 
      return res
      .status(400)
      .send({ status: false, message: 'Email is required'})

      if (!emailregex.test(email))
         return res
            .status(400)
            .send({ status: false, message: "Invalid Email Id" });


      if (!password) 
      return res
      .status(400)
      .send({ status: false, message: 'password is required'})

      if (!passwordregex.test(password))
      return res
         .status(400)
         .send({ status: false, message: "please enter password in valid format", });


        let user = await Usermodel.findOne({email:email })

      if (!user){
       return res
       .status(404)
       .send({ status: false, message: "user not found"})
      }
      let hashedPassword = await bcrypt.compare(password, user.password)
      if (!hashedPassword) 
      return res
      .status(400)
      .send({ status: false, message: "password is incorrect"})

      let token = jwt.sign(
         {
           userId: user._id,
           iat: new Date().getTime(),
           exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60,
         },
        "loginMe"
       )

     return res
     .status(201)
     .send({ status: true, message: 'token created successfully', data: { userId: user._id, token: token}})
   }
   catch (error) {
     return res
     .status(500)
     .send({ status: false, Error: error.message })
   }
}



module.exports = { createUser,loginUser }





