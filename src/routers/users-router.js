const router = require('express').Router();
const User = require('../models/user-model');

const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp|tiff)$/)) {
            cb(new Error('Invalid file type!'));
        }
        cb(undefined, true);
    }
});
router.post('/users/avatar', auth, upload.single('avatar'), async (req, res) => {
    try {
        req.user.avatar = sharp(req.file.buffer).webp().toBuffer();
        const size = await avatar.metadata().size;
        if (size > 1000000) {
            throw new Error();
        }
        await req.user.save();
        return res.status(200).send();
    } catch (e) {
        return res.status(400).send(e.message);
    }
});
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar){
            throw new Error();
        }
        res.set('Content-Type', 'image/webp');
        res.send(user.avatar);
    }catch (e) {
        return res.status(400).send(e.message);
    }
});


router.post('/users/login', async (req, res) => {
    try {
        // console.log(req.body.email, req.body.password);
        const user = await User.findByCredentials(req.body.email, req.body.password);
        console.log(user);
        const token = await user.generateAuthToken();
        user.tokens = user.tokens.concat({token});
        await user.save();

        return res.status(200).send({user,token});
    }catch (e) {
        res.status(400).send(e);
    }
});
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        console.log('user is ' + user);

        const token = await user.generateAuthToken();
        res.status(201).send({user,token});
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.send('Logged out');
    }catch (e) {
        res.status(500).send('Failed to log out!');
    }
});
router.post('/users/logoutALL', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send('Logged out out of everything');
    }catch (e) {
        res.status(500).send();
    }
});
router.get('/users/me', auth, async (req, res) => {
    return res.status(200).send(req.user);
});
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const isValid = updates.every(update => allowedUpdates.includes(update));
    if (!isValid) {
        return res.status(400).send('Cannot update, Bad request');
    }
    try {
        // const user = await User.findById(req.params.id);
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        return res.status(200).send(req.user);
    } catch (e) {
        return res.status(400).send(e)
    }
});
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        return res.status(200).send(req.user);
    } catch (e) {
        return res.status(400).send('Bad request! Cannot delete user');
    }
});
module.exports = router;