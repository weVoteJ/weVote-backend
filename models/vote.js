const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const voteSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  country: { type: String, required: true },
  voteLeftValue: { type: String, require: true },
  voteRightValue: { type: String, require: true },
  voteLeft: { type: Number, required: true },
  voteRight: { type: Number, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

module.exports = mongoose.model('Vote', voteSchema);
