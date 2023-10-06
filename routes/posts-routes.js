const express = require('express');
const { check } = require('express-validator');

const postsControllers = require('../controllers/posts-controllers');

const router = express.Router();

router.get('/', postsControllers.getAllPost);

router.get('/user/:uid', postsControllers.getPostsByUserId);

router.post('/', postsControllers.createPost);

module.exports = router;
