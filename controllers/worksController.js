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
        if(!tasks) return res.status(404).json({status: 'Not found'});
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
                const savedTask = await TaskModel.findOneAndDelete({ workId },
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


// Status
// req.body = {
//     statusFrom: '',
//     statusTo: '',
//     workId: '',
//     taskId: ''
//     newIndex: 0
// }
exports.dragTask = async (req, res) => {
    const workId = req.body.workId;
    const taskId = req.body.taskId;
    let allTaskOfThisWork = await TaskModel.findOne({ workId });
    if (allTaskOfThisWork) {
        const allTasksInFrom = allTaskOfThisWork.tasks.find(x => x.status === req.body.statusFrom).taskItems;
        const taskIndToMove = allTasksInFrom.findIndex(x => x.taskId === taskId);
        const taskToMove = allTasksInFrom[taskIndToMove];
        // Add task to new status
        const allTasksInTo = allTaskOfThisWork.tasks.find(x => x.status === req.body.statusTo).taskItems;
        allTasksInTo.splice(req.body.newIndex, 0, taskToMove);
        // Delete task from existing status
        allTasksInFrom.splice(taskIndToMove, 1);
        allTaskOfThisWork = { ...allTaskOfThisWork };
        const updatedStatuses = await TaskModel.findOneAndUpdate({ workId },
            allTaskOfThisWork,
            { new: true }
        );
        res.status(200).json({ status: 'success' });
    } else {
        return res.status(404).json({ message: 'Work not found' });
    }
}

// req.body ={
// statusName: '' 
// statusInd: 0
// }
exports.addStatus = async (req, res) => {
    const workId = req.params.workId;
    const { statusInd, statusName } = req.body;
    let allTaskOfThisWork = await TaskModel.findOne({ workId });
    if (allTaskOfThisWork) {
        allTaskOfThisWork.tasks.splice(statusInd, 0, {
            status: statusName,
            taskItems: []
        });

        res.status(200).json({ status: 'success' });
    } else {
        return res.status(404).json({ message: 'Work not found' });
    }
}

// Update status
// req.body ={
// statusName: '' 
// oldInd: 0,
//  newInd: 0
// }
exports.updateStatus = async (req, res) => {
    const workId = req.params.workId;
    const status= req.params.status;
    const { statusName, oldInd, newInd } = req.body;
    let allTaskOfThisWork = await TaskModel.findOne({ workId });
    if(allTaskOfThisWork){
        if(newInd != oldInd){
            allTaskOfThisWork.tasks.find(x => x.status === status).status = statusName;
            allTaskOfThisWork = [...allTaskOfThisWork];
            await TaskModel.findOneAndUpdate({ workId },
                allTaskOfThisWork,
                { new: true }
            );
            res.status(200).json({ status: 'success' });
        } else {
            const indOfStatus = allTaskOfThisWork.tasks.findIndex(x => x.status === status);
            let statuses = allTaskOfThisWork.tasks[indOfStatus];
            // Remove status from old ind
            allTaskOfThisWork.tasks.splice(indOfStatus, 1);
            // Add status to current ind
            allTaskOfThisWork.tasks.splice(indOfStatus, 0, statuses);
            res.status(200).json({ status: 'drag success' });
        }
    } else {
        return res.status(404).json({ message: 'Work not found' });
    }
}