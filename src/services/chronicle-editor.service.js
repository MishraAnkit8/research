const chronicleModels = require('../models/chronicle-edition.model');


module.exports.renderChronicleEdition = async(req, res, next) => {
    const renderVcEditorData = await chronicleModels.fetchVcEditorData();
    return renderVcEditorData
    
}

module.exports.insertVcDataService = async(body) => {
    console.log('Chronicle Data in service  ==>>', body);
    const vcEditorData = await chronicleModels.insertVcEditorData(body);
    console.log('vcEditorData in service ==>>>', vcEditorData)
    return vcEditorData
}

module.exports.insertResearchDataService = async(body) => {
    console.log('insertResearchDataService Data in service  ==>>', body);
    const researchEditorData = await chronicleModels.insertResearchEditor(body);
    console.log('researchEditorData in service ==>>>', researchEditorData)
    return researchEditorData
}

module.exports.insertMeetingDataService = async(body) => {
    console.log('insertMeetingDataService Data in service  ==>>', body);
    const meetingEditorData = await chronicleModels.insertMeetingEditor(body);
    console.log('meetingEditorData in service ==>>>', meetingEditorData)
    return meetingEditorData
}

module.exports.insertBrandingDataService = async(body) => {
    console.log('insertBrandingDataService  Data in service  ==>>', body);
    const brandingEditorData = await chronicleModels.insertBrandingeditor(body);
    console.log('brandingEditorData in service ==>>>', brandingEditorData)
    return brandingEditorData
}