const chronicleModels = require('../models/chronicle-edition.model');


module.exports.renderChronicleEdition = async(req, res, next) => {
    const renderVcEditorData = await chronicleModels.fetchEditorData();
    const fetchVcOfficeData = await chronicleModels.fetchVcOfficeData();
    const fetchResearchData = await chronicleModels.renderResearchData();
    const fetchMeetingData = await chronicleModels.renderMeetingData();
    const fetchBrandingData = await chronicleModels.renderBrandingData();

    // console.log('fetchVcOfficeData in service ===>>>', fetchVcOfficeData)
    return {
        renderVcEditorData,
        fetchVcOfficeData,
        fetchResearchData,
        fetchMeetingData,
        fetchBrandingData
    }
    
}

// module.exports.renderVcOfficeData = async() => {
//     const fetchVcOfficeData = await chronicleModels.fetchVcOfficeData()
//     return fetchVcOfficeData
// }

module.exports.insertVcDataService = async (body) => {
    console.log("data in service ==>>>", body);
    const chronicleEditorData = body.chronicleEditorData;
    console.log('chronicleEditorData  in service ===>>', chronicleEditorData);
    const chronicleDate = body.chronicleDate;
    console.log('chronicleDate in service ===>>>', chronicleDate)

    const vcEditorData = await chronicleModels.insertVcEditorData(chronicleEditorData, chronicleDate);
    console.log("vcEditorData in service ==>>>", vcEditorData);
    return vcEditorData;
};

module.exports.insertResearchDataService = async(body) => {
    console.log('insertResearchDataService Data in service  ==>>', body);
    const chronicleEditorData = body.chronicleEditorData;
    console.log('chronicleEditorData  in service ===>>', chronicleEditorData);
    const chronicleDate = body.chronicleDate;
    console.log('chronicleDate in service ===>>>', chronicleDate)
    const researchEditorData = await chronicleModels.insertResearchEditor(chronicleEditorData, chronicleDate);
    console.log('researchEditorData in service ==>>>', researchEditorData)
    return researchEditorData
}

module.exports.insertMeetingDataService = async(body) => {
    const chronicleEditorData = body.chronicleEditorData;
    const chronicleDate = body.chronicleDate;
    // console.log('chronicleDate in service ===>>>', chronicleDate)
    const meetingEditorData = await chronicleModels.insertMeetingEditor(chronicleEditorData, chronicleDate);
    // console.log('meetingEditorData in service ==>>>', meetingEditorData)
    return meetingEditorData
}

module.exports.insertBrandingDataService = async(body) => {
    console.log('insertBrandingDataService  Data in service  ==>>', body);
    const chronicleEditorData = body.chronicleEditorData;
    console.log('chronicleEditorData  in service ===>>', chronicleEditorData);
    const chronicleDate = body.chronicleDate;
    console.log('chronicleDate in service ===>>>', chronicleDate)
    const brandingEditorData = await chronicleModels.insertBrandingeditor(chronicleEditorData, chronicleDate);
    console.log('brandingEditorData in service ==>>>', brandingEditorData)
    return brandingEditorData
}