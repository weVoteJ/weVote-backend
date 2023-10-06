const express = require('express');
const { check } = require('express-validator');

const votesControllers = require('../controllers/votes-controllers');

const router = express.Router();

router.patch('/:pid', votesControllers.castVote);

module.exports = router;
