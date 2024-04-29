const teachingExecellanceService = require('../services/teaching-excellance.service')

module.exports.renderTeachingExecellance = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const teachingExecellance = await teachingExecellanceService.fetchTeachingExecellanceData(userName);
    console.log('teachingExecellance ==>>', teachingExecellance.rows);
        res.render('teaching-excellance' , {
            teachingExecellance : teachingExecellance.rows,
            rowCount : teachingExecellance.rowCount
        });
}

module.exports.insertTeachingExecellance = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    console.log('data ===>>', req.body);
    const teachingExecellance = req.body
    // const {pedagogyInnovationFile, fdpProgramFile, workShopFile, invitingFacultyFile, programOrientationFile} = req.files
    // console.log('pedagogyInnovationFile',  pedagogyInnovationFile[0].filename);
    console.log('files in controller ===>>>>', req.files)
    const teachingExecellanceData = await teachingExecellanceService.insertTeachingExecellance(teachingExecellance, req.files, userName);
    console.log('teachingExecellanceData ===>>>', teachingExecellanceData);
    // files names also sending  by status
    const pedagogyInnovationFile  = teachingExecellanceData.teachingFilesArrayData.pedagogyInnovationFileString;
    const fdpProgramFile = teachingExecellanceData.teachingFilesArrayData.fdpProgramFileString;
    const workShopFile = teachingExecellanceData.teachingFilesArrayData.workShopFileString; 
    const invitingFacultyFile = teachingExecellanceData.teachingFilesArrayData.invitingFacultyFileString;
    const programOrientationFile = teachingExecellanceData.teachingFilesArrayData.programOrientationFileString;

    console.log('ID in controller ==>>', teachingExecellanceData);

    if(teachingExecellanceData){
        res.status(200).send({
            status : 'done',
            teachingId : teachingExecellanceData.teachingId,
            teachingData : teachingExecellance,
            pedagogyInnovationFile,
            fdpProgramFile,
            workShopFile, 
            invitingFacultyFile,
            programOrientationFile,
            rowCount : teachingExecellanceData.rowCount
        })
    }
};

module.exports.updatTeachingData = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    console.log('id ==>', req.body.teachingId);
    const teachingId = req.body.teachingId;
    const updatedTeachingExecellance = req.body;
    console.log('data for updation in controller  ==>>', updatedTeachingExecellance);
    // const {pedagogyInnovationFile, fdpProgramFile, workShopFile, invitingFacultyFile, programOrientationFile} = req.files;

    // const teachingDocumentToBeUpdate = {pedagogyInnovationFile, fdpProgramFile, workShopFile, invitingFacultyFile, programOrientationFile}
    const updatedTeachingExecellanceData = await teachingExecellanceService.updatedTeachingExecellance(teachingId, updatedTeachingExecellance, req.files, userName);
    const pedagogyInnovationFile  = updatedTeachingExecellanceData.teachingDocumentToBeUpdate.pedagogyInnovationFileString;
    const fdpProgramFile = updatedTeachingExecellanceData.teachingDocumentToBeUpdate.fdpProgramFileString;
    const workShopFile = updatedTeachingExecellanceData.teachingDocumentToBeUpdate.workShopFileString; 
    const invitingFacultyFile = updatedTeachingExecellanceData.teachingDocumentToBeUpdate.invitingFacultyFileString;
    const programOrientationFile = updatedTeachingExecellanceData.teachingDocumentToBeUpdate.programOrientationFileString;
    if(updatedTeachingExecellanceData){
        res.status(200).send({
            status : 'done',
            pedagogyInnovationFile,
            fdpProgramFile,
            workShopFile, 
            invitingFacultyFile,
            programOrientationFile,
            updatedTeachingExecellance : updatedTeachingExecellance
        })
    }
}

module.exports.deleteTeachingExecellance = async(req, res, next) => {
    const {teachingId} = req.body;
    console.log('teachingId ==>', teachingId);
    const teachingExecellance = await teachingExecellanceService.deleteTeachingExecellance(teachingId);
    if(teachingExecellance){
        res.status(200).send({
            status : 'done',
            massage : 'deleted successfully'
        })
    }
}

module.exports.viewTeachingExecellance = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    console.log('Id ==>>', req.body);
    const {teachingId} = req.body;
    const teachingExecellanceView = await teachingExecellanceService.viewTeachingExecellance(teachingId, userName);
    if(teachingExecellanceView){
        res.status(200).send({
            status : 'done',
            teachingExecellanceView : teachingExecellanceView
        })
    }

}