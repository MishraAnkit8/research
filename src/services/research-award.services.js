

const researchawardModels = require('../models/research-award.models');

module.exports.renderResearchAwardData = async(userName) => {

    const researchAwardData = await researchawardModels.fetchResearchAward(userName);
    console.log('data in service ===>>>>', researchAwardData.rowCount);
    return  researchAwardData ? {
        status : "Done",
        message : "Data Fetch Successfully",
        researchAwardData : researchAwardData.rows,
        rowCount : researchAwardData.rowCount
    } : {
        status : "Failed",
        message : "Unable To Fetch Data"
    }
}


module.exports.insertResearchAwardData = async(body, files, userName) => {
    const awardFiles = files ?.map(file => file.filename).join(',');
    const researchAwardData = body;
    console.log('awardFiles ===>>>>>', awardFiles);
    console.log('researchAwardData in service ==>>>', researchAwardData)

    const insertAwardData = await researchawardModels.insertResearchAwardRow(awardFiles, researchAwardData, userName);
    console.log('insertAwardData ===>>>>', insertAwardData)

    return insertAwardData.status === "Done" ? {
        status : insertAwardData.status,
        message : insertAwardData.message,
        researchAwardData : researchAwardData,
        awardId : insertAwardData.awardId,
        awardFiles : awardFiles,
        rowCount : insertAwardData.rowCount
    } : {
        status : insertAwardData.status,
        message : insertAwardData.message,
        errorCode : insertAwardData.errorCode
    }
}


module.exports.updateResearchAward = async( body, files, userName) => {
    const updatedReseachAwardDocuments = files ?.map(file => file.filename).join(',');
    const updatedAwardData = body;
    const awardId = body.awardId;
    console.log('awardId ===>>>>', awardId);

    const updatedAwardRowData = await researchawardModels.updatedResearchRowData(awardId, updatedReseachAwardDocuments, updatedAwardData, userName);
    console.log('updatedAwardRowData ===>>>>', updatedAwardRowData);

    return updatedAwardRowData.status === "Done" ? {
        status : updatedAwardRowData.status,
        message : updatedAwardRowData.message,
        rowCount : updatedAwardRowData.rowCount,
        updatedAwardData : updatedAwardData,
        updatedReseachAwardDocuments : updatedReseachAwardDocuments,
        awardId : awardId

    } : {
        status : updatedAwardRowData.status,
        message : updatedAwardRowData.message,
        errorCode : updatedAwardRowData.errorCode
    };
}


module.exports.deleteResearchAwardData = async(body) => {
    const awardId = body.awardId;
    console.log('awardId in service ===>>>', awardId)
    const deletedAwardData = await researchawardModels.deleteResearchawardRow(awardId);

    console.log('deletedAwardData ===>>>>', deletedAwardData);
    return deletedAwardData.status === "Done" ? {
        status : deletedAwardData.status,
        message : deletedAwardData.message
    } : {
        status : deletedAwardData.status,
        message : deletedAwardData.message,
        errorCode : deletedAwardData.errorCode
    }
}

module.exports.viewResearchRowData = async(body, userName) => {
    const awardId = body.awardId;
    console.log('awardId ===>>>', awardId)

    const researchAwardDataView = await researchawardModels.veiwResearchAwardRow(awardId, userName);

    console.log('researchAwardDataView ===>>>>', researchAwardDataView);
    return researchAwardDataView.status === "Done" ? {
        status : researchAwardDataView.status,
        message : researchAwardDataView.message,
        veiwResearchAwardRow : researchAwardDataView.veiwResearchAwardRow
    } : {
        status : researchAwardDataView.status,
        message : researchAwardDataView.message,
        errorCode : researchAwardDataView.errorCode
    }
}