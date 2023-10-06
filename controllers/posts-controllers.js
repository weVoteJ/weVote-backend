const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Post = require('../models/post');
const User = require('../models/user');

const getAllPost = async (req, res, next) => {
  let posts;
  try {
    posts = await Post.find({}).populate('voters.objectId');
  } catch (err) {
    const error = new HttpError(
      'Fetching posts failed, please try again later'
    );
    return next(error);
  }

  res.json({ posts: posts.map((post) => post.toObject({ getters: true })) });
};

const createPost = async (req, res, next) => {
  const { title, description, country, voteLeftValue, voteRightValue } =
    req.body;

  const createdPost = new Post({
    title,
    description,
    country,
    voteLeftValue,
    voteRightValue,
    voteLeft: 0,
    voteRight: 0,
    creator: '651ef4700a9d7dbd4c13eb61',
    voters: [],
  });

  let user;
  try {
    // user = await User.findById(req.userData.userId);
    user = await User.findById('651ef4700a9d7dbd4c13eb61');
  } catch (err) {
    const error = new HttpError('Creating post failed, please try again', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPost.save({ session: sess });
    user.posts.push(createdPost);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError('Creating post failed, please try again', 500);
    return next(error);
  }

  res.status(201).json({ post: createdPost.toObject({ getters: true }) });
};

const getPostsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let posts;
  try {
    posts = await Post.find({ creator: userId }).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Fetching posts failed, please try again later',
      500
      // 500 any things goes wrong with the request
    );
    return next(error);
  }
  console.log(posts);

  if (!posts || posts.length === 0) {
    // return res
    //   .status(404)
    //   .json({ message: 'Could not find a place for the provided user id.' });

    return next(
      new HttpError('Could not find a post for the provided user id.', 404)
    );
  }

  res.json({
    posts: posts.map((post) => post.toObject({ getters: true })),
  });
};

exports.createPost = createPost;
exports.getPostsByUserId = getPostsByUserId;
exports.getAllPost = getAllPost;
