const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/jwt');

// @type    GET
// @route   /
// @desc    route for home page
// @access  PUBLIC
router.get('/', (req, res) => {
    res.render('index');
});

// @type    POST
// @route   /router/register
// @desc    route for register of users
// @access  PUBLIC

router.post('/signup', async(req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.genrateAuthToken();

        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

// @type    POST
// @route   /router/login
// @desc    route for login of users
// @access  PUBLIC

router.post('/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );

        const token = await user.genrateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;