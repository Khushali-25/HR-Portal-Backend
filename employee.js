const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  companyName: String,
  companyEmail: String,
  companyContact: String,
  companyAddress: String,
  companyPassword: String,
  username: String,
  planType: String,
  country: String,
  state: String,
  town: String,
  zip: String,
  token: String,
  planStart: Number,
  planEnd: Number,
  card_details: [],
  createddate: Number,
  noOfUser: Number,
  remainingUser: Number,
  plan: String,
  cronMail: String,
});

const Employee = mongoose.model('employee', EmployeeSchema);

module.exports = Employee;
