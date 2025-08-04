const contributorModel = require("../models/contributorsModel");

exports.getContributors = async (req, res, next) => {
    let { page, size } = req.params;
    page = page ? page : 1;
    const contributors = await contributorModel.find({},{}, {limit: page, skip: (page - 1) * size});
    res.json({
        status: 'success',
        contributors
    });
}

exports.getContributorById = async (req, res, next) => {
    const contributor = await contributorModel.findOne({ contributorId: req.params.id });
    res.json({
        status: 'success',
        contributor
    });
}

exports.addContributor = async (req, res, next) => {
    if (!req.body) {
        res.status(503).json({ status: 'failed', error: 'Request data must' })
    }
    const { contributorId, firstName, lastName, role, status } = req.body;

    if (!contributorId) {
        res.status(400).json({ status: 'failure', error: 'contributor id required' })
    }

    if (!firstName) {
        res.status(400).json({ status: 'failure', error: 'first name id required' })
    }

    if (!lastName) {
        res.status(400).json({ status: 'failure', error: 'last name id required' })
    }

    if (!role) {
        res.status(400).json({ status: 'failure', error: 'Role id required' })
    }

    if (!status) {
        res.status(400).json({ status: 'failure', error: 'status id required' })
    }

    try {
        const contributor = new contributorModel(req.body);
        await contributor.save();

        res.status(201).json({ status: 'success', contributor });
    } catch (err) {
        res.status(412).json({ status: 'failed', error: 'Something went wrong' });
    }
}

exports.updateContributor = async (req, res, next) => {
    try {
        const updatedData = await contributorModel.findOneAndUpdate({ contributorId: req.params.id }, { $set: req.body }, { new: true });
        if(!updatedData){
            res.status(404).json({status: 'failed', message: 'not found'});
        }
        res.status(200).json({ status: 'success', updatedData });
    } catch {
        res.status(400).json({ status: 'failed', message: 'Update failed' });
    }
}

exports.deleteContributor = async (req, res, next) => {
    try {
        const deletedData = await contributorModel.findOneAndDelete({ contributorId: req.params.id });

        if (!deletedData) {
            return res.status(404).json({ status: 'failed', message: 'Contributor not found' });
        }

        res.status(200).json({ status: 'success', message: 'Contributor deleted' });
    } catch (err) {
        res.status(500).json({ status: 'failed', message: 'Delete failed', error: err.message });
    }
};
