const teachingExecellanceService = require('../services/teaching-excellance.service')

module.exports.renderTeachingExecellance = async(req, res, next) => {
    const teachingExecellance = await teachingExecellanceService.fetchTeachingExecellanceData();
    console.log('teachingExecellance ==>>', teachingExecellance)
        res.render('teaching-excellance' , {
            teachingExecellance : teachingExecellance
        });
}

module.exports.insertTeachingExecellance = async(req, res, next) => {
    console.log('data ===>>', req.body);
    const teachingExecellance = req.body
    const {pedagogyInnovationFile, fdpProgramFile, workShopFile, invitingFacultyFile, programOrientationFile} = req.files
    console.log('pedagogyInnovationFile',  pedagogyInnovationFile[0].filename);
    const teachingExecellanceData = await teachingExecellanceService.insertTeachingExecellance(teachingExecellance, req.files);
    if(teachingExecellanceData){
        res.status(200).send({
            status : 'done',
            teachingId : teachingExecellanceData,
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
    console.log('data ==>>', updatedTeachingExecellance);
    const {pedagogyInnovationFile, fdpProgramFile, workShopFile, invitingFacultyFile, programOrientationFile} = req.files;
    const updatedTeachingExecellanceData = await teachingExecellanceService.updatedTeachingExecellance(teachingId, updatedTeachingExecellance, req.files);
    if(updatedTeachingExecellanceData){
        res.status(200).send({
            status : 'done',
            pedagogyInnovationFile : pedagogyInnovationFile,
            fdpProgramFile : fdpProgramFile,
            workShopFile : workShopFile, 
            invitingFacultyFile : invitingFacultyFile,
            programOrientationFile : programOrientationFile,
            updatedTeachingExecellance : updatedTeachingExecellance,

        })
    }
}