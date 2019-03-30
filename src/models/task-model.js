const mongoose = require('mongoose');
const TaskModel = mongoose.model('Tasks', {
    description:{
        type: String,
        required:true,
        minlength: 1,
        trim: true
    },
    completed:{
        type:Boolean,
        default:false
    }
});
module.exports = TaskModel;