const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const workSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    contributors: [String],
    status: String,
    startDate: Date,
    dueDate: Date,
    createdBy: { type: Date, default: Date.now },
    workId: { type: String, unique: true, default: uuidv4 }
}, {
    timestamps: true
});

const WorkModel = mongoose.model('Work', workSchema);

const taskItemSchema = new mongoose.Schema({
    taskId: { type: String, default: uuidv4 }, // remove `unique` here
    title: { type: String, required: true },
    description: String,
    assigneeTo: [String],
    priority: { type: String, enum: ["Low", "Medium", "High"] },
    status: { type: String, enum: ["To Do", "In Progress", "Done"] },
    order: Number,
    startDate: Date,
    dueDate: Date,
    createdBy: String,
    createdAt: { type: Date, default: Date.now }
});

const sinlgeTaskModel = mongoose.model('singleTask', taskItemSchema);

const taskSchema = new mongoose.Schema({
    workId: { type: String, required: true },
    tasks: [
        {
            status: String,
            taskItems: [taskItemSchema]
        }
    ]
});


const TaskModel = mongoose.model('Task', taskSchema);

module.exports = { TaskModel, WorkModel, sinlgeTaskModel};