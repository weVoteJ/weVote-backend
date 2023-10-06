const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Post = require('../models/post');
const User = require('../models/user');

const castVote = async (req, res, next) => {
  const { isVoteLeft } = req.body;
  const voteId = req.params.pid;

  let post;
  try {
    post = await Post.findById(voteId);
  } catch (err) {
    const error = new HttpError('Vote action failed, please try again.', 500);
    return next(error);
  }

  if (!post) {
    const error = new HttpError('Could not find post for provided id', 404);
    return next(error);
  }

  let user;
  try {
    user = await User.findById('651ef4700a9d7dbd4c13eb61');
  } catch (err) {
    const error = new HttpError('Vote action failed, please try again.', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user', 404);
    return next(error);
  }

  let voteExist;
  try {
    voteExist = await User.findOne({
      'votes._id': '651f6b5f98dc9a95c17bab64',
    }); // Use 'await' here
  } catch (err) {}

  if (voteExist) {
    const error = new HttpError('This ID has been voted', 500);
    return next(error);
  }

  isVoteLeft ? post.voteLeft++ : post.voteRight++;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    user.votes.push(post);
    await user.save({ session: sess });
    post.voters.push({ objectId: user, voteValue: isVoteLeft });
    await post.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError('Something went wrong, could not vote', 500);
    return next(error);
  }

  res.status(200).json({ post: post.toObject({ getters: true }) });
};

exports.castVote = castVote;
