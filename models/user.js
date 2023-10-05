const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  country: { type: String, required: true },
  // image: { type: String, required: true },
  posts: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }],
  //   votes: [
  //     {
  //       objectId: { type: mongoose.Types.ObjectId, required: true, ref: 'Vote' },
  //       value: { type: Number, required: true },
  //     },
  //   ],
  // votesCount: { type: Number, required: true },
  votes: [
    {
      objectId: { type: mongoose.Types.ObjectId, required: true, ref: 'Vote' },
    },
  ],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
