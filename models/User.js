const { Shema, model } = require("mongoose");

const User = new Shema({
  email: {type:String,required:true,unique:true}
})

module.exports = model('User',user);
