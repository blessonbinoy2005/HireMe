const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  companyLocation: {
    type: String,
    trim: true,
  },
  companyWebsite: {
    type: String,
    trim: true,
  },
  companyDescription: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Company", CompanySchema);