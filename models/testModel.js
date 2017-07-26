var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var testSchema = new Schema({
  username: {
    type: String
  },
  // _id: {
  //   type: Schema.Types.ObjectId 
  // },

  password: {
  	type: String
  },
  
  email: {
    type: String,
    unique: true,
    match: [/.+\@.+\..+/, "Please enter a valid e-mail address"]
  }
});

var Test = mongoose.model("Test", testSchema);
module.exports = Test;