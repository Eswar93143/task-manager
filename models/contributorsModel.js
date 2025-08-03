const mongoose = require('mongoose');
const contributorsSchema = mongoose.Schema({
    profilePic: String,
	contributorId: {type: String, required: true, unique: true},
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	email: String,
	dob: {type:String, unique: true, required: true},
	role: {type: Number, required: true},
	status: {type: Number, required: true},
	Department: Number
});

const contributorModel = mongoose.model('contributor', contributorsSchema);

module.exports = contributorModel;