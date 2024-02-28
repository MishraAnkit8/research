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

//update vc office data
module.exports.updatedVcOfficeData = async(body) => {
    console.log('body data in service =====>>>>>', body);
    const updateVcOfficeContent = await chronicleModels.updateVcData(body);
    if(updateVcOfficeContent.rowCount === 1){
        console.log('updateVcOfficeContent in service ===>>>', updateVcOfficeContent);
        return updateVcOfficeContent
    }
    else{
        return {
            status :'failed',
            massage : 'Unable To Update Vc Editor Content'
        }
    }


};

//update meeting content
module.exports.updatedMeetingStackholder = async(body) => {
    const updateMeetingContent = await chronicleModels.updateMeetingData(body);
    if(updateMeetingContent.rowCount === 1){
        return updateMeetingContent
    }
    else{
        return {
            status :'failed',
            massage : 'Unable To Update Meeting Editor Content'
        }
    }

}

//update research content
module.exports.updatedResearch = async(body) => {
    const updateRearchContent = await chronicleModels.updateResearchData(body);
    if(updateRearchContent.rowCount === 1){
        return updateRearchContent
    }
    else{
        return {
            status :'failed',
            massage : 'Unable To Update Research Editor Content'
        }
    }

};

//update branding content
module.exports.updatedBrandingAdvertising = async(body) => {
    const updateBrandingContent = await chronicleModels.updateBrandingData(body);
    if(updateBrandingContent.rowCount === 1){
        return updateBrandingContent
    }
    else{
        return {
            status :'failed',
            massage : 'Unable To Update Branding Editor Content'
        }
    }
}


module.exports.deleteVcContent = async(body) => {
    console.log('data in service', body);
    const vcContentDelete = await chronicleModels.deleteVcEditorContent(body);
    return vcContentDelete;
}

module.exports.deleteMeetingContent = async(body) => {
    console.log('data in service', body)
    const meetingContentDelete = await chronicleModels.deleteMeetingEditorContent(body);
    return meetingContentDelete
}

module.exports.deleteResearchContent = async(body) => {
    console.log('data in service', body);
    const researchContentDelete = await chronicleModels.deleteResearchEditorContent(body);
    return researchContentDelete;
}

module.exports.deleteBrandingContent = async(body) => {
    console.log('data in service', body);
    const brandingContentDelete = await chronicleModels.deleteBrandingEditorContnent(body);
    return brandingContentDelete;
}