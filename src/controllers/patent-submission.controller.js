const patentSubmissionservice = require('../services/patent-submission.service');


module.exports.renderPatentSubMissionAndGrant = async(req, res, next) =>{
    console.log('data in controller ')
    const patentSubmissionList = await patentSubmissionservice.fetchPatentForm();
    console.log('patentSubmissionList ===>>>>', patentSubmissionList);

    res.render('patent-submission', {
        status : patentSubmissionList.status,
        message : patentSubmissionList.rowCount,
        patentData : patentSubmissionList.patentData,
        patentSubmissionsData : patentSubmissionList.patentSubmissionsData,
        rowCount : patentSubmissionList.rowCount,
        patentStagData : patentSubmissionList.patentStagData,
        patentSubmissionsDataList : patentSubmissionList.patentSubmissionsDataList,
        internalFacultyData : patentSubmissionList.internalFacultyData,
        patentSdgGoalData : patentSubmissionList.patentSdgGoalData,
        patentInventionTypeData : patentSubmissionList.patentInventionTypeData,
        patentData : patentSubmissionList.patentData,
        internalPatentFacultyId : patentSubmissionList.internalPatentFacultyId,
        externalPatentFacultyId : patentSubmissionList.externalPatentFacultyId,
        patentGrantFacultyIdContainer : patentSubmissionList.patentGrantFacultyIdContainer,
        patentGrantFacultyIds : patentSubmissionList.patentGrantFacultyIds,
        errorCode : patentSubmissionList.errorCode
        })
};


module.exports.insertPatentsubmission = async(req, res, next) => {
        console.log('patentData in Controller', req.body);
        console.log('patentFilesData ===>>>>::::', req.files);

        const patentDataSubmission = await patentSubmissionservice.insertPatentFormData(req.body, req.files);

        console.log('patentDataSubmission ===>>>>', patentDataSubmission);

        const statusCode = patentDataSubmission.status === "Done" ? 200 : (patentDataSubmission.errorCode ? 400 : 500);
        res.status(statusCode).send({
            status : patentDataSubmission.status,
            message : patentDataSubmission.message,
            status : patentDataSubmission.status,
            message : patentDataSubmission.message,
            patentId : patentDataSubmission.patentId,
            patentDataFilesString : patentDataSubmission.patentDataFilesString,
            patentGrantIds: patentDataSubmission.patentGrantIds,
            sdgGoalsIds : patentDataSubmission.sdgGoalsIds,
            inventionTypeIds : patentDataSubmission.inventionTypeIds,
            patentStatusId : patentDataSubmission.patentStatusId,
            patentData : patentDataSubmission.patentData,
            rowCount : patentDataSubmission.rowCount,
            errorCode : patentDataSubmission.errorCode ? patentDataSubmission.errorCode : null
        })
}


// for update patent submission
module.exports.updatePatentSubMissiom = async(req, res, next) => {
    console.log('data in controller' , req.body);
    console.log('ID in controller ==>', req.body.patentId);
    const  patentId = req.body.patentId;

    const updatedPatentSubmissionData = await patentSubmissionservice.updatPatentSubmission(req.body, patentId, req.files);

    console.log('updatedPatentSubmissionData in controller ====>>>>>', updatedPatentSubmissionData);
    const statusCode = updatedPatentSubmissionData.status === "Done" ? 200 : (updatedPatentSubmissionData.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : "Done",
            message : updatedPatentSubmissionData.message,
            patentDataFiles : updatedPatentSubmissionData.patentDataFiles,
            patentId : updatedPatentSubmissionData.patentId,
            patentStageId : updatedPatentSubmissionData.patentStageId,
            patentGrantIds : updatedPatentSubmissionData.patentGrantIds,
            inventionTypeIds : updatedPatentSubmissionData.inventionTypeIds,
            sdgGoalsIds : updatedPatentSubmissionData.sdgGoalsIds,
            updatedPatentData : updatedPatentSubmissionData.updatedPatentData,
            errorCode : updatedPatentSubmissionData.errorCode ? updatedPatentSubmissionData.errorCode : null
    })
}

module.exports.deletePatentData = async(req, res, next) => {
    const patentId = req.body;
    console.log('patentId ===>>>>>', patentId);

    const deletePatentsubMission = await patentSubmissionservice.deletePatentSubmission(patentId);

    console.log('deletePatentsubMission in controller ===>>>', deletePatentsubMission);

    const statusCode = deletePatentsubMission.status === "Done" ? 200 : (deletePatentsubMission.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : deletePatentsubMission.status,
        message : deletePatentsubMission.message,
        errorCode : deletePatentsubMission.errorCode ? deletePatentsubMission.errorCode : null
    })
  
}

module.exports.viewPatentSubmissionData = async(req, res, next) => {
    const {patentId} = req.body;
    console.log('patentId in controller  ===>>>>', patentId);

    const viewPatentsubmissionData = await patentSubmissionservice.viewPatentsubmission(patentId);

    console.log('viewPatentsubmissionData ====>>>>>>', viewPatentsubmissionData);

    const statusCode = viewPatentsubmissionData.status === "Done" ? 200 : (viewPatentsubmissionData.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : viewPatentsubmissionData.status,
        message : viewPatentsubmissionData.message,
        facultyData : viewPatentsubmissionData.facultyData,
        sdgGoalsData : viewPatentsubmissionData.sdgGoalsData,
        inventionTypeData : viewPatentsubmissionData.inventionTypeData,
        patentSubmissionsData : viewPatentsubmissionData.patentSubmissionsData,
        errorCode : viewPatentsubmissionData.errorCode ? viewPatentsubmissionData.errorCode : null
    })
}