const express = require('express');
const { getWorks, getWorkById, createWork, updateWork, deleteWork, getTasks, getTaskById, createTask, updateTask, deleteTask } = require('../controllers/worksController');
const worksRouter = express.Router();

// Get works
worksRouter.get('/works', getWorks);                // All works
worksRouter.get('/work/:workId', getWorkById);     // Single work by workId
worksRouter.post('/work', createWork);             // Create
worksRouter.put('/work/:workId', updateWork);      // Update
worksRouter.delete('/work/:workId', deleteWork);   // Delete


worksRouter.get('/tasks/:workId', getTasks);
worksRouter.get('/task/:workId/:status/:taskId', getTaskById);
worksRouter.post('/task/:workId/:status', createTask);
worksRouter.put('/task/:workId/:status', updateTask);
worksRouter.delete('/task/:workId/:status/:taskId', deleteTask);

module.exports = worksRouter;