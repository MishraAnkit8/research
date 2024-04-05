const patentSubmissionservice = require('../services/patent-submission.service');


module.exports.renderPatentSubMissionAndGrant = async(req, res, next) =>{

    const patentSubmissionList = await patentSubmissionservice.fetchPatentForm();

    // console.log('patentSubmissionList Data In controller  ===>>>', patentSubmissionList)

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

        const patentData = req.body;
       
        console.log('patentFilesData ===>>>>::::', req.files)
        const patentDataSubmission = await patentSubmissionservice.insertPatentFormData(req.body, req.files);
        console.log('patentDataSubmission ===>>>>', patentDataSubmission);
        // .replace(/,/g, ' ')
        console.log('authorNameString ==')
        const statusCode = patentDataSubmission.status === "Done" ? 200 : (patentDataSubmission.errorCode ? 400 : 500);
        res.status(statusCode).send({
            status : patentDataSubmission.status,
            message : patentDataSubmission.message,
            patentData : patentDataSubmission.status === "Done" ? patentData : null,
            patentFilesData : patentDataSubmission.status === "Done" ? patentDataSubmission.patentDataFilesString : null,
            externalEmpId :  patentDataSubmission.status === "Done" ?patentDataSubmission.externalEmpId : null,
            patentId : patentDataSubmission.status === "Done" ? patentDataSubmission.patentId : null,
            authorNameString : patentDataSubmission.status === "Done" ? patentDataSubmission.authorNameString.replace(/,/g, ' ') : null ,
            internalNamesString : patentDataSubmission.status === "Done" ? patentDataSubmission.internalNamesString : null,
            externalNamesString : patentDataSubmission.status === "Done" ? patentDataSubmission.externalNamesString : null,
            rowCount : patentDataSubmission.status === "Done" ? patentDataSubmission.rowCount : null,
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
        status : updatedPatentSubmissionData.status,
        message : updatedPatentSubmissionData.message,
        patentDocument : updatedPatentSubmissionData.patentDataFiles ? updatedPatentSubmissionData.patentDataFiles : null,
        updatedPatentData : updatedPatentSubmissionData.updatedPatentData ? updatedPatentSubmissionData.updatedPatentData : null,
        authorNameString : updatedPatentSubmissionData.authorNameString ? updatedPatentSubmissionData.authorNameString : null,
        externalNamesString : updatedPatentSubmissionData.externalNamesString ? updatedPatentSubmissionData.externalNamesString : null,
        internalNamesString : updatedPatentSubmissionData.internalNamesString ? updatedPatentSubmissionData.internalNamesString : null,
        existingNameString : updatedPatentSubmissionData.existingNameString ? updatedPatentSubmissionData.existingNameString : null,
        externalEmpId : updatedPatentSubmissionData.externalEmpId ? updatedPatentSubmissionData.externalEmpId : null,
        errorCode : updatedPatentSubmissionData.errorCode ? updatedPatentSubmissionData.errorCode : null
    })
}

module.exports.deletePatentData = async(req, res, next) => {
    const patentId = req.body;
    const deletePatentsubMission = await patentSubmissionservice.deletePatentSubmission(patentId);

    console.log('deletePatentsubMission in controller ===>>>', deletePatentsubMission)
    const statusCode = deletePatentsubMission.status === "Done" ? 200 : (deletePatentsubMission.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : deletePatentsubMission.status,
        message : deletePatentsubMission.message,
        errorCode : deletePatentsubMission.errorCode ? deletePatentsubMission.errorCode : null
    })
    // if(deletePatentsubMission.status === 'done'){
    //     res.status(200).send({
    //         status : deletePatentsubMission.status,
    //         massage : deletePatentsubMission.massage
    //     })
    // }
    // else{
    //     res.status(500).send({
    //         status : deletePatentsubMission.status,
    //         massage : deletePatentsubMission.massage
    //     })
    // }
}

module.exports.viewPatentSubmissionData = async(req, res, next) => {
    console.log('data comming from frontent ===>>>', req.body.patentId)
    const {patentId} = req.body;
    console.log('patentId ===>>>>', patentId)
    const viewPatentsubmissionData = await patentSubmissionservice.viewPatentsubmission(patentId);
    console.log('data in controller ==>', viewPatentsubmissionData.rows );
    if(viewPatentsubmissionData){
        res.status(200).send({
            status : 'done',
            patentData : viewPatentsubmissionData.rows
        })
    }
}