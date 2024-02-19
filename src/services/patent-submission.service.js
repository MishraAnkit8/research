const patentFormsModels = require('../models/patent-submission.models');


module.exports.fetchPatentForm = async() => {
    const patentSubmissionForm = await patentFormsModels.fetchPatentSubMissionForms();
    return patentSubmissionForm;
}

module.exports.insertPatentFormData = async(body , files) => {
    console.log('patentData in service', body);
    console.log('file name in service ==>>', files);
    const patentFilesData = files;
    console.log('patentFilesData ===>>>>', patentFilesData);
    var patentDataBaseFiles = '';
    for (let i = 0 ; i<= patentFilesData.length-1; i++){
        if(patentFilesData[i] && patentFilesData[i].filename){
            patentDataBaseFiles += patentFilesData[i].filename + ',';
        }
    }
    console.log('patentDataBaseFiles patent file stringfy data inside service ==>>>', patentDataBaseFiles)
    const insertPatentData = await patentFormsModels.insertPatentData(body, patentDataBaseFiles);
    console.log('insert Id ', insertPatentData.rows[0])
    const patentId = insertPatentData.rows[0];
    return { insertPatentData,
            patentDataBaseFiles,
            patentId 
    }
}


module.exports.updatPatentSubmission = async(body, patentId, files) => {
    console.log('updated Data in Service ::', body)
    const updatedPatentData = body;
    console.log('updatedPatentData ====>>>', updatedPatentData);
    console.log('patentId ===>>>', patentId);
    if(files){
        console.log('files ===>>>', files)
        const patentDocument = files;
        var patentDataFiles = '';
        for(let i = 0; i<= patentDocument.length-1; i++){
            if(patentDocument[i] && patentDocument[i].filename){
                patentDataFiles += patentDocument[i].filename + ',';
            }
        }
        console.log('patentDataFiles ===>>>', patentDataFiles)
        console.log('file name  In service ==>>', patentDocument)
        console.log('ID in service >>', body.patentId)
        const upadtedPatentSubmissionData = await patentFormsModels.updatePatentsubmissionData(updatedPatentData, patentId, patentDataFiles);
        console.log('Id for updation  ==>>', patentId);
        if(upadtedPatentSubmissionData && upadtedPatentSubmissionData.rowCount === 1){
            return{
                status : 'done',
                massage : 'data updated successFully',
                patentDataFiles
            }
        }
    }
    else{
        console.log('ID in service >>', body.patentId)
        const upadtedPatentSubmissionData = await patentFormsModels.updatePatentsubmissionData(updatedPatentData, patentId);
        console.log('Id for updation  ==>>', patentId);
        if(upadtedPatentSubmissionData && upadtedPatentSubmissionData.rowCount === 1){
            return{
                status : 'done',
                massage : 'data updated successFully'
            }
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