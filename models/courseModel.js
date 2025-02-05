const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  instituteName: { type: String, required: true, index: true },
  instituteCity: { type: String, required: true, index: true },
  instituteState: { type: String, required: true, index: true },
  courseName: { type: String, required: true, index: true },
  courseStream: { type: String, required: true, index: true },
  level: { type: String, required: true, index: true },
  fee: { type: Number, required: true },
  feeType: { type: String, required: true },
  courseDuration: { type: Number, required: true },
  durationType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

courseSchema.index({ instituteName: 1, courseStream: 1, level: 1 });

module.exports = mongoose.model('Course', courseSchema);
