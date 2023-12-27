const researchConsultancyService = require('../services/research-consultancy.service');
const clientScript = require('../../public/js/client');
const path = require('path');

module.exports.renderResearchProjectConsultancy = async(req, res, next) => {
    const fileuploadStatus = req.app.locals.fileuploadStatus;
    const docuploadStatus = req.app.locals.docuploadStatus;
    const htmlVal = res.app.locals.htmlVal;
    const errorMsg = res.app.locals.errorMsg;
    req.app.locals.fileuploadStatus = false;
    res.app.locals.htmlVal = '';
    clientScript.includeHtml(htmlVal);
    const researchcConsultancyData = await researchConsultancyService.fetchResearConsultacyData();
    if(researchcConsultancyData){
        res.render('research-project-consultancy' , {
            title: 'File Upload Using Multer in Node.js and Express',
            utils: clientScript,
            fileuploadStatus: fileuploadStatus,
            errorMsg: errorMsg,
            htmlVal: htmlVal,
            reseachConsultancyDataList : researchcConsultancyData
        })
    }
    
}

module.exports.insertResearchConsultancyData = async(req, res, next) => {
    const researchConsultantData =  req.body;
    console.log('researchConsultantData ==>>', researchConsultantData);
    const {filename} = req.file;
    console.log('file name ', filename);
    const researchConsultancyData = await researchConsultancyService.insertResearchConsultancyData(req.body, filename);
    console.log('consultantId',researchConsultancyData.consultantId)
    if(researchConsultancyData){
        res.status(200).send({
            status : 'done',
            massage : 'data inserted successfully',
            filename,
            consultantId : researchConsultancyData.consultantId,
            researchConsultantData : researchConsultantData

        })
    }

}

module.exports.updatedConsultantData = async(req, res, next) => {
    console.log('data comming from templates ==>>', req.body);
    console.log()
}