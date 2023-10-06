const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  country: { type: String, required: true },
  voteLeftValue: { type: String, require: true },
  voteRightValue: { type: String, require: true },
  voteLeft: { type: Number, required: true },
  voteRight: { type: Number, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  voters: [
    {
      objectId: { type: mongoose.Types.ObjectId, ref: 'User' },
      voteValue: { type: Boolean },
    },
  ],
});

module.exports = mongoose.model('Post', postSchema);
