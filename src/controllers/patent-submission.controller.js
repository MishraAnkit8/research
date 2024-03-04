const patentSubmissionservice = require('../services/patent-submission.service');


module.exports.renderPatentSubMissionAndGrant = async(req, res, next) =>{
   const patentSubmissionList = await patentSubmissionservice.fetchPatentForm();
   console.log('patentSubmissionList ===>>>', patentSubmissionList.patentSubmissions.rows);
   console.log('employee List ====>>>', patentSubmissionList.employeesList.rows);
   if(patentSubmissionList){
    
    res.render('patent-submission', {
        patentList : patentSubmissionList.patentSubmissions.rows,
        rowCount : patentSubmissionList.patentSubmissions.rowCount,
        employeesList : patentSubmissionList.employeesList.rows
      })
}
};

module.exports.insertPatentsubmission = async(req, res, next) => {
        console.log('patentData in Controller', req.body);

        const patentData = req.body;
       
        console.log('patentFilesData ===>>>>::::', req.files)
        const patentDataSubmission = await patentSubmissionservice.insertPatentFormData(req.body, req.files);
        // console.log('externalAuthorsr in  controller ==>>', patentDataSubmission.externalAuthors);
        console.log('patentDataSubmission ====>>>', patentDataSubmission)
        const authorName  = patentDataSubmission.authorName
        console.log('authorName ===>>>>', authorName)
        const patentFilesData = patentDataSubmission.patentDataBaseFiles;
        const patentId = patentDataSubmission.patentId;
        console.log('id in controller  ==>>', patentId)
        console.log('v files string in controller ===>>>', patentFilesData)

        if(patentDataSubmission && patentId){
            res.json({
            status : 'done',
            massage : 'data inserted suceessfully',
            patentFilesData,
            patentData,
            patentId,
            authorName
            
        })

        }
}
module.exports.updatePatentSubMissiom = async(req, res, next) => {
    console.log('data in controller' , req.body);
    console.log('ID in controller ==>', req.body.patentId);
    const updatedPatentData = req.body;
    const  patentId = req.body.patentId;
    const authorName = !updatedPatentData.internalAuthors && !updatedPatentData.externalAuthors ? updatedPatentData.authorName : updatedPatentData.internalAuthors ?? updatedPatentData.externalAuthors;
    console.log('authorName in controller ====>>>', authorName);
    if(req.files) {
        console.log(' updated file in Cotroller ', req.files);
        const updatedPatentSubmissionData = await patentSubmissionservice.updatPatentSubmission(req.body, patentId, req.files);
        const patentDocument = updatedPatentSubmissionData.patentDataFiles;
        console.log('updated patentDocument ===>>>', patentDocument);
        if(updatedPatentSubmissionData.status === 'done'){
            res.json({
                status : 'done',
                massage : 'Data updated successfully',
                updatedPatentData : updatedPatentData,
                patentDocument,
                authorName
            })
        }
    }
    else{
        const updatedPatentSubmissionData = await patentSubmissionservice.updatPatentSubmission(req.body, patentId);
        if(updatedPatentSubmissionData.status === 'done'){
            res.json({
                status : 'done',
                massage : 'Data updated successfully',
                updatedPatentData : updatedPatentData,
                authorName  
            })
        }
    }
}

module.exports.deletePatentData = async(req, res, next) => {
    const patentId = req.body;
    const deletePatentsubMission = await patentSubmissionservice.deletePatentSubmission(patentId);
    if(deletePatentsubMission.status === 'done'){
        res.status(200).send({
            status : deletePatentsubMission.status,
            massage : deletePatentsubMission.massage
        })
    }
    else{
        res.status(500).send({
            status : deletePatentsubMission.status,
            massage : deletePatentsubMission.massage
        })
    }
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