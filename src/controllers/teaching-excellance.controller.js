const teachingExecellanceService = require('../services/teaching-excellance.service')

module.exports.renderTeachingExecellance = async(req, res, next) => {
    const teachingExecellance = await teachingExecellanceService.fetchTeachingExecellanceData();
    console.log('teachingExecellance ==>>', teachingExecellance.rows);
        res.render('teaching-excellance' , {
            teachingExecellance : teachingExecellance.rows,
            rowCount : teachingExecellance.rowCount
        });
}

module.exports.insertTeachingExecellance = async(req, res, next) => {
    console.log('data ===>>', req.body);
    const teachingExecellance = req.body
    const {pedagogyInnovationFile, fdpProgramFile, workShopFile, invitingFacultyFile, programOrientationFile} = req.files
    console.log('pedagogyInnovationFile',  pedagogyInnovationFile[0].filename);
    const teachingExecellanceData = await teachingExecellanceService.insertTeachingExecellance(teachingExecellance, req.files);
    console.log('ID in controller ==>>', teachingExecellanceData);
    if(teachingExecellanceData){
        res.status(200).send({
            status : 'done',
            teachingId : teachingExecellanceData.teachingId,
            pedagogyInnovationFile : pedagogyInnovationFile,
            fdpProgramFile : fdpProgramFile,
            workShopFile : workShopFile, 
            invitingFacultyFile : invitingFacultyFile,
            programOrientationFile : programOrientationFile,
            teachingData : teachingExecellance
        })
    }
};

module.exports.updatTeachingData = async(req, res, next) => {
    console.log('id ==>', req.body.teachingId);
    const teachingId = req.body.teachingId;
    const updatedTeachingExecellance = req.body;
    console.log('data for updation in controller  ==>>', updatedTeachingExecellance);
    const {pedagogyInnovationFile, fdpProgramFile, workShopFile, invitingFacultyFile, programOrientationFile} = req.files;

    const teachingDocumentToBeUpdate = {pedagogyInnovationFile, fdpProgramFile, workShopFile, invitingFacultyFile, programOrientationFile}
    const updatedTeachingExecellanceData = await teachingExecellanceService.updatedTeachingExecellance(teachingId, updatedTeachingExecellance, teachingDocumentToBeUpdate);
    if(updatedTeachingExecellanceData){
        res.status(200).send({
            status : 'done',
            pedagogyInnovationFile : pedagogyInnovationFile,
            fdpProgramFile : fdpProgramFile,
            workShopFile : workShopFile, 
            invitingFacultyFile : invitingFacultyFile,
            programOrientationFile : programOrientationFile,
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
    console.log('Id ==>>', req.body);
    const {teachingId} = req.body;
    const teachingExecellanceView = await teachingExecellanceService.viewTeachingExecellance(teachingId);
    if(teachingExecellanceView){
        res.status(200).send({
            status : 'done',
            teachingExecellanceView : teachingExecellanceView
        })
    }

}