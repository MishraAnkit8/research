const teachingExecellanceModel = require('../models/teaching-excellance.model');
const fs = require('fs');
const path = require('path');

// uploaded file path for dowload
const uploadFolder = path.join(__dirname, '..', '..', 'uploads');
console.log('uploadFolder in side teaching service ==>>', uploadFolder)
module.exports.fetchTeachingExecellanceData = async() => {
    const teachingExecellanceData = await teachingExecellanceModel.fetchTeachingExecellance();
    return teachingExecellanceData;
}

module.exports.insertTeachingExecellance = async(teachingExecellance, files) => {
    const pedagogyInnovationFile = files.pedagogyInnovationFile[0].filename;
    const fdpProgramFile = files.fdpProgramFile [0].filename;
    const workShopFile = files.workShopFile[0].filename;
    const invitingFacultyFile = files.invitingFacultyFile[0].filename;
    const programOrientationFile = files.programOrientationFile[0].filename;
    const teachingExecellanceData = await teachingExecellanceModel.insertTeachingExecellanceData(teachingExecellance, pedagogyInnovationFile, fdpProgramFile, workShopFile, invitingFacultyFile, programOrientationFile);
    if(teachingExecellanceData){
        return {
            status : 'done',
            teachingId : teachingExecellanceData.rows[0].id
        }
    }
}

module.exports.updatedTeachingExecellance = async(teachingId, updatedTeachingExecellance, files) => {
    const pedagogyInnovationFile = files.pedagogyInnovationFile[0].filename;
    const fdpProgramFile = files.fdpProgramFile [0].filename;
    const workShopFile = files.workShopFile[0].filename;
    const invitingFacultyFile = files.invitingFacultyFile[0].filename;
    const programOrientationFile = files.programOrientationFile[0].filename; 
    const updatedTeachingExecellanceData = await teachingExecellanceModel.updateTeachingExecellance(teachingId, updatedTeachingExecellance, pedagogyInnovationFile, fdpProgramFile, workShopFile, invitingFacultyFile, programOrientationFile);
    if(updatedTeachingExecellanceData && updatedTeachingExecellanceData.rowCount === 1){
        return {
            status : 'done',
            massage : ' updated successfully'
        }
    }    

}

module.exports.deleteTeachingExecellance = async (teachingId) => {
    console.log('Id in Service ==>', teachingId);
    const teachingExecellance = await teachingExecellanceModel.deleteTeachingExecellance(teachingId);
    if(teachingExecellance.rowCount === 1 && teachingExecellance){
        return{
            status : 'done',
            massage : 'deleted successfully'
        }
    }
}

module.exports.viewTeachingExecellance = async(teachingId) => {
    const teachingExecellanceViewData = await teachingExecellanceModel.teachingExecellanceView(teachingId);
    console.log('teachingExecellanceViewData' , teachingExecellanceViewData.rows[0]);
    if(teachingExecellanceViewData && teachingExecellanceViewData.rowCount === 1){
        return teachingExecellanceViewData.rows[0]
    }
}
