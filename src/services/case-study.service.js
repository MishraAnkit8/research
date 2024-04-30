const caseStudyModel = require('../models/case-study.model');

module.exports.createCaseStudy = async (userName) => {
    const caseStudyFetchData = await caseStudyModel.fetchCaseStudy(userName);
    console.log(caseStudyFetchData.rows);
    return caseStudyFetchData;
}

module.exports.insertCaseStudies = async (body, files, userName) => {
    const caseStudyFiles = files?.map(file => file.filename).join(',');
    const caseStudyData = body;
    console.log('inserted data in service ==>>', body);
    const createCaseStudies = await caseStudyModel.insertDataIntoCaseStudies(caseStudyData, caseStudyFiles, userName);

    console.log('createCaseStudies ===>>>>>', createCaseStudies);

    return createCaseStudies.status === "Done" ? {
        status : createCaseStudies.status,
        message : createCaseStudies.message,
        caseStudyId : createCaseStudies.caseStudyId,
        caseStudyFiles : caseStudyFiles,
        caseStudyData : caseStudyData,
        rowCount : createCaseStudies.rowCount

    } : {
        status : createCaseStudies.status,
        message : createCaseStudies.message,
        errorCode : createCaseStudies.errorCode
    }
    return createCaseStudies ;
}

module.exports.delCaseStudies = async(caseStudyId) => {
    const caseStudiesData = await caseStudyModel.deleteCaseStudies({caseStudyId});
    if(caseStudiesData.rowCount === 1){
        return {
            status : 'done',
            massage : ' data deleted successfully'
        }
    }
    else{
        return {
            status : 'failed',
            massage : 'failed to delete data'
        }
    }
}

module.exports.viewCaseStudies = async(caseStudyId, userName) => {
    console.log("ID :::::::::::::::::::::",caseStudyId);
    const caseStudyViewData = await caseStudyModel.viewCaseStudyData(caseStudyId, userName);
    console.log('View inService =>>' ,caseStudyViewData.caseStudyData);

    return caseStudyViewData.status === "Done" ? {
        status : caseStudyViewData.status,
        message : caseStudyViewData.message,
        caseStudyData : caseStudyViewData.caseStudyData,
        rowCount : caseStudyViewData.rowCount
    } : {
        status : caseStudyViewData.status,
        message : caseStudyViewData.message,
        errorCode : caseStudyViewData.errorCode
    }
    // if(caseStudyViewData.rowCount === 1){
    //     return caseStudyViewData.rows
    // }
    // else{
    //     return {
    //         status : 'failed',
    //         massage : 'failed to view'
    //     }
    // }
}

module.exports.updatedCaseStudies = async(caseStudyId, updatedCaseStudies, userName, files) => {
    console.log('updatedCaseStudies ===>>>>>>>', updatedCaseStudies);
    const caseStudyFiles = files?.map(file => file.filename).join(',');

    const updateCaseStudy = await caseStudyModel.updateCaseStudies(caseStudyId, updatedCaseStudies, userName, caseStudyFiles);

    return updateCaseStudy.status === "Done" ? {
        status : updateCaseStudy.status,
        message : updateCaseStudy.message,
        updatedCaseStudies : updatedCaseStudies,
        caseStudyFiles : caseStudyFiles

    } : {
        status : updateCaseStudy.status,
        message : updateCaseStudy.message,
        errorCode : updateCaseStudy.errorCode
    }
    // console.log('data in service for updation' , updateCaseStudy.rows);



    // if(updateCaseStudy.rowCount === 1){
    //     return {
    //         status : 'done' ,
    //         massage : 'data updated successfully'
    //     }
    // }
    // else{
    //     return {
    //         status : 'failed',
    //         massage : 'error to update data'
    //     }
    // }

};
