const express = require('express');
const router = express.Router();
const Task = require('../models/task-model');
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().exec();
        return res.status(200).send(tasks);
    }catch (e) {
        return res.status(400).send(e);
    }
});
router.get('/tasks/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const task = await Task.findById(_id).exec();
        if (!task) {
            return res.status(404).send('Task not found');
        }
        return res.status(200).send(task);
    }catch (e) {
        return res.status(400).send(e);
    }
});
router.post('/tasks', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});
router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValid = updates.every(update => allowedUpdates.includes(update));
    if(!isValid) {
        return res.status(400).send('Cannot update, Bad request');
    }
    try {
        console.log(req.body);
        console.log(req.params.id);
        const task = await Task.findById(req.params.id);
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        if(!task){
            return res.status(404).send('User not found');
        }
        return res.status(200).send(task);
    }catch (e) {
        console.log(e);
        return res.status(400).send('Bad request! Cannot update task');
    }
});
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).send('Task not found!');
        }
        return res.status(200).send(task);
    }catch (e) {
        return res.status(400).send('Bad request! Cannot delete task');
    }
});
module.exports = router;