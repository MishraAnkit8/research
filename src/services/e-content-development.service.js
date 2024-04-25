
const eContentModels = require('../models/e-content-development.models');


module.exports.renderEContentDevelopmentModel = async(userName) => {
    const eContentFetchedData = await eContentModels.fetchEContentDevelopmentData(userName);

    console.log('eContentFetchedData =====>>>>', eContentFetchedData)
    return {
        eContentData : eContentFetchedData.rows,
        rowCount : eContentFetchedData.rowCount
    }
}


module.exports.insertEcontentRow = async(body, userName) => {
    const EcontentFormData = body.EcontentFormData;
    console.log('EcontentFormData  in service ===>>>', EcontentFormData)

    const EcontentRecordInserted = await eContentModels.insertEContentRecord(EcontentFormData, userName);

    console.log('EcontentRecordInserted ===>>>>', EcontentRecordInserted);
    return EcontentRecordInserted.status === 'Done' ? {
        status : EcontentRecordInserted.status,
        message : EcontentRecordInserted.message,
        eContentId : EcontentRecordInserted.eContentId,
        EcontentData : EcontentFormData,
        rowCount : EcontentRecordInserted.rowCount,

    } : {
        status : EcontentRecordInserted.status,
        message : EcontentRecordInserted.message,
        errorCode : EcontentRecordInserted.errorCode
    }
}

module.exports.updateEContentReconrd = async(body, userName) => {
    const eContentId = body.updatedEContentData.eContentId;
    console.log('eContentId ====>>>', eContentId)
    const updatedEContentData = body.updatedEContentData;
    console.log('updatedEContentData ===>>>>', updatedEContentData);

    const updateEcontentDevelopmentData = await eContentModels.updateEcontentRow(updatedEContentData, eContentId, userName);

    console.log('updateEcontentDevelopmentData ===>>>>', updateEcontentDevelopmentData);
    return updateEcontentDevelopmentData.status === "Done" ? {
        status : updateEcontentDevelopmentData.status,
        message : updateEcontentDevelopmentData.message,
        updatedEContentData : updatedEContentData,
        rowCount : updateEcontentDevelopmentData.rowCount
    } : {
        status : updateEcontentDevelopmentData.status,
        message : updateEcontentDevelopmentData.message,
        errorCode : updateEcontentDevelopmentData.errorCode
    }
}


module.exports.deleteEcontentData = async(body) => {
    const eContentId = body.eContentId;
    console.log('eContentId ===>>>>', eContentId);

    const deletedEContentRecordRow = await eContentModels.deleteEContentRowData(eContentId);

    console.log('deletedEContentRecordRow ===>>>>', deletedEContentRecordRow);
    return deletedEContentRecordRow.status === "Done" ? {
        status : deletedEContentRecordRow.status,
        message : deletedEContentRecordRow.message
    } : {
        status : deletedEContentRecordRow.status,
        message : deletedEContentRecordRow.message,
        errorCode : deletedEContentRecordRow.errorCode
    }
}

module.exports.viewEContentRecordData = async(body, userName) => {
    const eContentId = body.eContentId;

    const EcontentDataToBeViewed = await eContentModels.viewEContentDevelopmentData(eContentId, userName);

    console.log('EcontentDataToBeViewed ===>>>>', EcontentDataToBeViewed);
    return EcontentDataToBeViewed.status === "Done" ? {
        status : EcontentDataToBeViewed.status,
        message : EcontentDataToBeViewed.message,
        viewEcontentData : EcontentDataToBeViewed.viewEcontentData
    } : {
        status : EcontentDataToBeViewed.status,
        message : EcontentDataToBeViewed.message,
        errorCode : EcontentDataToBeViewed.errorCode
    }
}