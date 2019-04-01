const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/task-model');

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=20
//GET /tasks?sortBy=createdAt_asc
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};
    if(req.query.completed) {
        match.completed = req.query.completed === true;
    }
    if(req.query.sortBy) {
        const parts = req.query.sortBy.split('_');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    try {
        // const tasks = await Task.find({owner: req.user._id}).exec();
        //paginating data!!
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        return res.status(200).send(req.user.tasks);
    } catch (e) {
        return res.status(400).send(e);
    }
});
router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const task = await Task.findOne({_id, owner: req.user._id}).exec();
        if (!task) {
            return res.status(404).send('Task not found');
        }
        return res.status(200).send(task);
    } catch (e) {
        return res.status(400).send(e);
    }
});
router.post('/tasks', auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        });
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValid = updates.every(update => allowedUpdates.includes(update));
    if (!isValid) {
        return res.status(400).send('Cannot update, Bad request');
    }
    try {
        console.log(req.body);
        console.log(req.params.id);
        // const task = await Task.findById(req.params.id);
        const task = await Task.findOne({_id:req.params.id, owner: req.user._id});
        if (!task) {
            return res.status(404).send('User not found');
        }
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        return res.status(200).send(task);
    } catch (e) {
        console.log(e);
        return res.status(400).send('Bad request! Cannot update task');
    }
});
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id:req.params.id, owner: req.user._id});
        if (!task) {
            return res.status(404).send('Task not found!');
        }
        return res.status(200).send(task);
    } catch (e) {
        return res.status(400).send('Bad request! Cannot delete task');
    }
});
module.exports = router;