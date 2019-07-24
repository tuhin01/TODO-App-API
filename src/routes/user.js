const express = require("express");
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({
    dest: 'avatars'
});

const router = new express.Router();

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.getAuthenticatedToken();
        res.send({user, token});
    } catch (e) {
        res.status(400).send();
    }
});


router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/users/me', auth, async (req, res) => {
    const user = req.user;
    res.send({user});
});

router.post('/users/me/avatar', upload.single('avatar'), async (req, res) => {
    res.send();
});

router.post('/users/logout', auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        })
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }

});

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email', 'password'];

    const isValid = updates.every((update) => allowedUpdates.includes(update));

    if (!isValid) {
        return res.status(400).send({'error': 'Invalid updates!'});
    }

    try {
        const user = req.user;
        updates.forEach(field => user[field] = req.body[field]);
        await user.save();
        res.send(user);
    } catch (e) {
        res.status(400).send();
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(user);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
