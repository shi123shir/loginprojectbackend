const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


function isvalidObjectId(ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId);
}

authentication = function (req, res, next) {
  try {
    let tokenCheck = req.rawHeaders[1].replace("Bearer ", "");

    if (!tokenCheck) {
      return res
        .status(400)
        .send({ status: false, msg: "Token is required in bearer" });
    }
   

    jwt.verify(tokenCheck, "loginMe", (err, decode) => {
      if (err) {
        let msg =
          err.message == "jwt expired"
            ? "Token is Expired !!! "
            : "Token is Invalid !!!";

        return res.status(401).send({ status: false, msg: msg });
      }

      req["decode"] = decode.userId;

      next();
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      msg: "Server Error  authentication!!!",
      ErrMsg: err.message,
    });
  }
};




module.exports = {authentication,}