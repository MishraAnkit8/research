const patentSubmissionservice = require('../services/patent-submission.service');
const clientScript = require('../../public/js/client');
const path = require('path');

module.exports.renderPatentSubMissionAndGrant = async(req, res, next) =>{
    // const fileuploadStatus = req.app.locals.fileuploadStatus;
    // console.log('fileuploadStatus===>',req.app.locals.fileuploadStatus )
    // const docuploadStatus = req.app.locals.docuploadStatus;
    // console.log('docuploadStatus ==>',req.app.locals.docuploadStatus )
    // const htmlVal = res.app.locals.htmlVal;
    // console.log('htmlVal ==>>', res.app.locals.htmlVal);
    // const errorMsg = res.app.locals.errorMsg;
    // req.app.locals.fileuploadStatus = false;
    // req.app.locals.docuploadStatus = false;
    // res.app.locals.htmlVal = '';
    // clientScript.includeHtml(htmlVal);
   const patentSubmissionList = await patentSubmissionservice.fetchPatentForm();
   if(patentSubmissionList){
    
    res.render('patent-submission', {
        // title: 'File Upload Using Multer in Node.js and Express',
        // utils: clientScript,
        // fileuploadStatus: fileuploadStatus,
        // docuploadStatus: docuploadStatus,
        // errorMsg: errorMsg,
        // htmlVal: htmlVal,
        patentList : patentSubmissionList.rows,
        rowCount : patentSubmissionList.rowCount
      })
}
};

module.exports.insertPatentsubmission = async(req, res, next) => {
        console.log('patentData in Controller', req.body);
        const patentData = req.body;
        // const { filename, path: filePath } = req.files;
        // console.log('file data ==>>', req.files);
        // const patentFilesData = req.files;
        console.log('patentFilesData ===>>>>::::', req.files)
        const patentDataSubmission = await patentSubmissionservice.insertPatentFormData(req.body, req.files);
        console.log('patentDataSubmission row controller ==>>', patentDataSubmission.patentDataBaseFiles);
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
            // filePath: path.join('/', filePath),
            patentId
            
        })

        }
}
module.exports.updatePatentSubMissiom = async(req, res, next) => {
    console.log('data in controller' , req.body);
    console.log('ID in controller ==>', req.body.patentId);
    const updatedPatentData = req.body;
    const  patentId = req.body.patentId;
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
                patentDocument
            })
        }
    }
    else{
        const updatedPatentSubmissionData = await patentSubmissionservice.updatPatentSubmission(req.body, patentId);
        if(updatedPatentSubmissionData.status === 'done'){
            res.json({
                status : 'done',
                massage : 'Data updated successfully',
                updatedPatentData : updatedPatentData  
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
    
    const {patentId} = req.body;
    const viewPatentsubmissionData = await patentSubmissionservice.viewPatentsubmission(patentId);
    console.log('data in controller ==>', viewPatentsubmissionData.rows );
    if(viewPatentsubmissionData){
        res.status(200).send({
            status : 'done',
            patentData : viewPatentsubmissionData.rows
        })
    }
}