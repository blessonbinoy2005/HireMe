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
  description: {
    type: String,
    trim: true,
    default: "",
  },
  industry: {
    type: String,
    trim: true,
    default: "",
  },
  logoUrl: {
    type: String,
    trim: true,
    default: "",
  },
  size: {
    type: String,
    enum: ["", "1-10", "11-50", "51-200", "201-1000", "1000+"],
    default: "",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Company", CompanySchema);