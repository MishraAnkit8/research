const chronicleEditionService = require('../services/chronicle-editor.service');

module.exports.renderChronicleEditionPage = async(req, res, next)  => {
    const chronicleDataController = await chronicleEditionService.renderChronicleEdition();
    console.log('chronicleDataController ==>>>', chronicleDataController);
        res.render('chronicle-edition-data')
}

