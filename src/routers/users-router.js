const express = require('express');
const router = new express.Router();
const User = require('../models/user-model');
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        return res.status(200).send(user);
    }catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().exec();
        return res.status(200).send(users);
    }catch (e) {
        return res.status(400).send(e);
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
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const isValid = updates.every(update => allowedUpdates.includes(update));
    if (!isValid) {
        return res.status(400).send('Cannot update, Bad request');
    }
    try {
        const user = await User.findById(req.params.id);
        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();
        if (!user) {
            return res.status(404).send('User not found');
        }
        return res.status(200).send(user);
    } catch (e) {
        return res.status(400).send(e)
    }
});
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).send('User not found');
        }
        return res.status(200).send(user);
    }catch (e) {
        console.log(e);
        return res.status(400).send('Bad request! Cannot delete user');
    }
});
module.exports = router;