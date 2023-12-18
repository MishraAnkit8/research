const patentSubmissionservice = require('../services/patent-submission.service');
const clientScript = require('../../public/js/client');
const path = require('path');

module.exports.renderPatentSubMissionAndGrant = async(req, res, next) =>{
    const fileuploadStatus = req.app.locals.fileuploadStatus;
    console.log('fileuploadStatus===>',req.app.locals.fileuploadStatus )
    const docuploadStatus = req.app.locals.docuploadStatus;
    console.log('docuploadStatus ==>',req.app.locals.docuploadStatus )
    const htmlVal = res.app.locals.htmlVal;
    console.log('htmlVal ==>>', res.app.locals.htmlVal);
    const errorMsg = res.app.locals.errorMsg;
    req.app.locals.fileuploadStatus = false;
    req.app.locals.docuploadStatus = false;
    res.app.locals.htmlVal = '';
    clientScript.includeHtml(htmlVal);
   const patentSubmissionList = await patentSubmissionservice.fetchPatentForm();
   if(patentSubmissionList){
    
    res.render('patent-submission', {
        title: 'File Upload Using Multer in Node.js and Express',
        utils: clientScript,
        fileuploadStatus: fileuploadStatus,
        docuploadStatus: docuploadStatus,
        errorMsg: errorMsg,
        htmlVal: htmlVal,
        patentList : patentSubmissionList
      })
}
};

module.exports.insertPatentsubmission = async(req, res, next) => {
    const patentData = req.body
    console.log('patentData in Controller', req.body);
    const patentSubmissionData = await patentSubmissionservice.insertPatentFormData(req.body);
    if(patentSubmissionData && patentSubmissionData.rows[0].id){
       res.status(200).send({
        status : 'done',
        massage : 'data insetde suceessfully',
        patentId : patentSubmissionData.rows[0].id
       })

    }
}

module.exports.handleFileConversion = (req, res) => {
    // Assuming that the file details are stored in req.file
    const { filename, path: filePath } = req.file;
    console.log('Controller for handleFileConversion ==>>',req.file )

    // Respond to the client
    res.json({
        status: 'done',
        message: 'File converted successfully',
        fileDetails: {
            filename,
            filePath: path.join('/', filePath), // Return the file path with a leading '/'
        },
    });
};