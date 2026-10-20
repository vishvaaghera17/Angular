const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({

username:{
type:String,
required:true
},

email:{
type:String,
required:true
},

phone:{
type:String
},

password:{
type:String,
required:true
}

});

module.exports = mongoose.model("Admin",AdminSchema);