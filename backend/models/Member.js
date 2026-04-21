const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: String,
  roll: String,
  year: String,
  degree: String,
  aboutProject: String,
  hobbies: String,
  certificate: String,
  internship: String,
  aboutYourAim: String,
  image: String,
  document: String,

}, { timestamps: true });

module.exports = mongoose.model('Member', MemberSchema);