const chronicleService = require('../services/chronicle-editor.service');

module.exports.renderChronicleEdition = async(req, res, next) => {
     const chronicleData = await chronicleService.renderChronicleEdition();
     res.render("chronicle-edition", {
       vcEditor: chronicleData.rows,
     });
}


module.exports.insertVcData = async(req, res, next) => {
    console.log('data comming from frontend in insertVcData  ==>>', req.body);
    const insertVcEditorData  = await chronicleService.insertVcDataService(req.body);
    console.log('insertVcEditorData vc data controller ==>>', insertVcEditorData);
    if(insertVcEditorData){
        res.status(200).send({
            status : 'done'

        })
    }
}

module.exports.insertResearchData = async(req, res, next) => {
    console.log('data comming from frontend in insertResearchData  ==>>', req.body);
    const insertResearchEditorData = await chronicleService.insertResearchDataService(req.body);
    console.log('chronicleDataToBeInserted in controller ==>>', insertResearchEditorData)
    if(insertResearchEditorData){
        res.status(200).send({
            status : 'done'

        })
    }
}

module.exports.insertMeetingData = async(req, res, next) => {
    console.log('data comming from frontend in insertMeetingData  ==>>', req.body);
    const insertMeetingEditorData = await chronicleService.insertMeetingDataService(req.body);
    console.log('chronicleDataToBeInserted in controller ==>>', insertMeetingEditorData)
    if(insertMeetingEditorData){
        res.status(200).send({
            status : 'done'

        })
    }
}

module.exports.insertBrandingData = async(req, res, next) => {
    console.log('data comming from frontend in Branding  ==>>', req.body);
    const insertBrandingEditorData = await chronicleService.insertBrandingDataService(req.body);
    console.log('chronicleDataToBeInserted in controller ==>>', insertBrandingEditorData);
    if(insertBrandingEditorData){
        res.status(200).send({
            status : 'done'

        })
    }

}