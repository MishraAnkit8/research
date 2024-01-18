const patentFormsModels = require('../models/patent-submission.models');

module.exports.fetchPatentForm = async() => {
    const patentSubmissionForm = await patentFormsModels.fetchPatentSubMissionForms();
    return patentSubmissionForm;
}

module.exports.insertPatentFormData = async(body , file) => {
    console.log('patentData in service', body);
    console.log('file name in service ==>>', file);
    const insertPatentData = await patentFormsModels.insertPatentData(body, file);
    console.log('insert Id ', insertPatentData.rows[0])
    return insertPatentData; 
}


module.exports.updatPatentSubmission = async(body) => {
    console.log('updated Data in Service ::', body)
    const updatedPatentData = body;
    const patentId = body.patentId;
    const patentDocument = body.patentDocument;
    console.log('file name  In service ==>>', patentDocument)
    console.log('ID in service >>', body.patentId)
    const upadtedPatentSubmissionData = await patentFormsModels.updatePatentsubmissionData(updatedPatentData, patentId, patentDocument );
    console.log('Id for updation  ==>>', patentId);
    if(upadtedPatentSubmissionData && upadtedPatentSubmissionData.rowCount === 1){
        return{
            status : 'done',
            massage : 'data updated successFully'
        }
    }
}

module.exports.deletePatentSubmission = async(body) => {
    const {patentId} = body;
    console.log('patent Id in Service for deletion ', patentId);
    const deletePatentData = await patentFormsModels.deletePatentSubmissionData(patentId);
    if(deletePatentData.rowCount === 1){
        return {
            status : 'done',
            massage : 'data Deleted Successfully'
        }
    }
    else{
        return {
            status : 'failed',
            massage : 'failed to delete'
        }
    }
}

module.exports.viewPatentsubmission = async(patentId) => {
    console.log('id', patentId)
    const patentDataViewed = await patentFormsModels.viewPatentSubmission(patentId);
    if(patentDataViewed && patentDataViewed.rowCount === 1){
        return patentDataViewed
    }
}