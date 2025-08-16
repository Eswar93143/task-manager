// worksController.js
const { TaskModel, WorkModel, sinlgeTaskModel } = require('../models/worksModel');

exports.getWorks = async (req, res) => {
    try {
        const works = await WorkModel.find({});
        res.status(200).json(works);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getWorkById = async (req, res) => {
    const { workId } = req.params;
    try {
        const work = await WorkModel.findOne({ workId });
        if (!work) return res.status(404).json({ message: 'Work not found' });
        res.status(200).json(work);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.createWork = async (req, res, next) => {
    try {
        console.log('bbhvh ', req.body)

        const newWork = new WorkModel(req.body); // workId auto-generated
        const savedWork = await newWork.save();
        const tasks = new TaskModel({
            workId: savedWork.workId,
            tasks: [
                {
                    status: 'new',
                    taskItems: []
                },
                {
                    status: 'Inprogress',
                    taskItems: []
                },
                {
                    status: 'Done',
                    taskItems: []
                }
            ]
        });
        await tasks.save();
        res.status(201).json(savedWork);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateWork = async (req, res) => {
    const { workId } = req.params;
    try {
        const updatedWork = await WorkModel.findOneAndUpdate(
            { workId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedWork) return res.status(404).json({ message: 'Work not found' });
        res.status(200).json(updatedWork);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteWork = async (req, res) => {
    const { workId } = req.params;
    try {
        const deleted = await WorkModel.findOneAndDelete({ workId });
        await TaskModel.findOneAndDelete({ workId });
        if (!deleted) return res.status(404).json({ message: 'Work not found' });
        res.status(200).json({ message: 'Work deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Task
// Get all tasks
exports.getTasks = async (req, res) => {
    try {
        const workId = req.params.workId;
        const tasks = await TaskModel.findOne({ workId: workId });
        res.status(200).json(tasks.tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single task by taskId
exports.getTaskById = async (req, res) => {
    try {
        const workId = req.params.workId;
        const status = req.params.status;
        const taskId = req.params.taskId;
        const task = await TaskModel.findOne({ workId: workId });
        let requestedTask;
        if (task) {
            const tasksInParticularStatus = task.tasks.find(statuses => statuses.status === status);
            if (tasksInParticularStatus) {
                requestedTask = tasksInParticularStatus.taskItems.find(task => task.taskId === taskId)
            }
        }
        if (!requestedTask) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(requestedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const workId = req.params.workId;
        const status = req.params.status;
        let allTaskOfThisWork = await TaskModel.findOne({ workId });
        if (allTaskOfThisWork) {
            const indexOfStatus = allTaskOfThisWork.tasks.findIndex(statuses => statuses.status === status);
            const statusToCreateTask = allTaskOfThisWork.tasks[indexOfStatus];
            const taskToCreate = new sinlgeTaskModel(
                req.body
            );
            statusToCreateTask.taskItems.unshift(taskToCreate);
            allTaskOfThisWork = { ...allTaskOfThisWork };
            const savedTask = await TaskModel.findOneAndUpdate({ workId },
                allTaskOfThisWork,
                { new: true });
            res.status(201).json(taskToCreate);
        } else {
            // work item based tasks not exist
            let task = new TaskModel({
                workId: savedWork.workId,
                tasks: [
                    {
                        status: 'new',
                        taskItems: []
                    },
                    {
                        status: 'Inprogress',
                        taskItems: []
                    },
                    {
                        status: 'Done',
                        taskItems: []
                    }
                ]
            });
            const taskToCreate = new sinlgeTaskModel(
                req.body
            );
            if (status === 'Done') {
                task.tasks[2].taskItems.push(taskToCreate);
            } else if (status === 'Inprogress') {
                task.tasks[1].taskItems.push(taskToCreate);
            } else {
                task.tasks[0].taskItems.push(taskToCreate);
            }
            let statusToCreate = new TaskModel(task);
            const savedTask = await statusToCreate.save();
            res.status(201).json(taskToCreate);
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update task by taskId
exports.updateTask = async (req, res) => {
    try {
        const workId = req.params.workId;
        const status = req.params.status;
        let allTaskOfThisWork = await TaskModel.findOne({ workId });
        if (allTaskOfThisWork) {
            const indexOfStatus = allTaskOfThisWork.tasks.findIndex(statuses => statuses.status === status);
            const statusToCreateTask = allTaskOfThisWork.tasks[indexOfStatus];
            const taskInd = statusToCreateTask.taskItems.findIndex(x => x.taskId === req.body.taskId)
            if (taskInd != -1) {
                const updatedTask = Object.assign(statusToCreateTask.taskItems[taskInd], req.body)
                statusToCreateTask.taskItems.splice(taskInd, 1, updatedTask);
                allTaskOfThisWork = { ...allTaskOfThisWork };
                const savedTask = await TaskModel.findOneAndUpdate({ workId },
                    allTaskOfThisWork,
                    { new: true });
                res.status(200).json(statusToCreateTask.taskItems[taskInd]);
            } else {
                return res.status(404).json({ message: 'Task not found' });
            }
        } else {
            return res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete task by taskId
exports.deleteTask = async (req, res) => {
    try {
        const workId = req.params.workId;
        const status = req.params.status;
        const taskId = req.params.taskId;
        let allTaskOfThisWork = await TaskModel.findOne({ workId });
        if (allTaskOfThisWork) {
            const indexOfStatus = allTaskOfThisWork.tasks.findIndex(statuses => statuses.status === status);
            const statusToCreateTask = allTaskOfThisWork.tasks[indexOfStatus];
            const taskInd = statusToCreateTask.taskItems.findIndex(x => x.taskId === taskId);
            if (taskInd != -1) {
                statusToCreateTask.taskItems.splice(taskInd, 0);
                allTaskOfThisWork = { ...allTaskOfThisWork };
                const savedTask = await TaskModel.findOneAndUpdate({ workId },
                    allTaskOfThisWork,
                    { new: true });
                res.status(200).json(statusToCreateTask.taskItems[taskInd]);
            } else {
                return res.status(404).json({ message: 'Task not found' });
            }
        } else {
            return res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
