const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const studentSchema = mongoose.Schema({

    fname: {
        type: String,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },

    userId:{
        type:ObjectId,
        ref:"user",
        required:true, 
        tirm:true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    marks: {
        type: Number,
        required : true
    },

    deletedAt : Date,
    isDeleted: {
        type: Boolean,
        default: false
    },


},{timestamps:true})


module.exports = mongoose.model("student",studentSchema)