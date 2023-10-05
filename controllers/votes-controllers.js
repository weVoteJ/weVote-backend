const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Vote = require('../models/vote');
const User = require('../models/user');

const createVote = async (req, res, next) => {
  const { title, description, country, voteLeftValue, voteRightValue } =
    req.body;

  const createdVote = new Vote({
    title,
    description,
    country,
    voteLeftValue,
    voteRightValue,
    voteLeft: 0,
    voteRight: 0,
    creator: '651ef4700a9d7dbd4c13eb61',
  });

  let user;
  try {
    // user = await User.findById(req.userData.userId);
    user = await User.findById('651ef4700a9d7dbd4c13eb61');
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdVote.save({ session: sess });
    user.posts.push(createdVote);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError('Creating place failed, please try again', 500);
    return next(error);
  }

  res.status(201).json({ vote: createdVote.toObject({ getters: true }) });
};

exports.createVote = createVote;
