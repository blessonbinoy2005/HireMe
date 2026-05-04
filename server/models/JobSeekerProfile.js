const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  school:    { type: String, default: "" },
  degree:    { type: String, default: "" },
  field:     { type: String, default: "" },
  startDate: { type: String, default: "" },
  endDate:   { type: String, default: "" },
  current:   { type: Boolean, default: false },
}, { _id: true });

const experienceSchema = new mongoose.Schema({
  title:   { type: String, default: "" },
  company: { type: String, default: "" },
  employmentType: {
    type: String,
    enum: ["", "full-time", "part-time", "internship", "contract", "freelance"],
    default: "",
  },
  location:    { type: String, default: "" },
  startDate:   { type: String, default: "" },
  endDate:     { type: String, default: "" },
  current:     { type: Boolean, default: false },
  description: { type: String, default: "" },
}, { _id: true });

const JobSeekerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  headline: { type: String, default: "", trim: true },
  locationCity: { type: String, default: "", trim: true },
  currentStatus: {
    type: String,
    enum: ["", "student", "new-grad", "unemployed", "employed"],
    default: "",
  },
  country: { type: String, default: "", trim: true },
  zipCode: { type: String, default: "", trim: true },
  phoneNumber: { type: String, default: "", trim: true },
  resume: { type: String, default: "", trim: true },
  education: { type: [educationSchema], default: [] },
  experience: { type: [experienceSchema], default: [] },
  skills: { type: [String], default: [] },
});

module.exports = mongoose.model("JobSeekerProfile", JobSeekerProfileSchema);
