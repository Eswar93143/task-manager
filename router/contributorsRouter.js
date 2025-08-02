const express = require('express');
const { getContributors, getContributorById, addContributor, updateContributor, deleteContributor } = require('../controllers/contributorsController');
const contributorRouter = express.Router();

// Over all get call
contributorRouter.route('/contributors').get(getContributors);

// Single get call
contributorRouter.route('/contributors/:id').get(getContributorById);

// Add contributor
contributorRouter.route('/contributors').post(addContributor);

// Update contributor
contributorRouter.route('/contributors/:id').put(updateContributor);

// Delete contributor
contributorRouter.route('/contributors/:id').delete(deleteContributor);

// Update profile url

module.exports = contributorRouter;