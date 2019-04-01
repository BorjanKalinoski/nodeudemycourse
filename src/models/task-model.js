const mongoose = require('mongoose');
const taskSchema = require('./schemas/taskSchema');
const TaskModel = mongoose.model('Task', taskSchema);
module.exports = TaskModel;