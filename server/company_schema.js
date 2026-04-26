const mongoose = require('mongoose');


const companyschema = new mongoose.Schema({
companyName: { type: String, required: true },
companyID: {type: String, required:true},
companyLocation: String,
companyWebsite: String
});


module.exports = mongoose.model('company', companyschema);