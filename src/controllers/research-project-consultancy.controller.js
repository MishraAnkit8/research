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
    console.log(' updated file name ==>', req.file);
    const consultantId = req.body.consultantId
    const updatedConsultant = req.body;
    const updateFileName = req.file.filename;
    const updateResearchConstantData = await researchConsultancyService.updateResearchConstant(consultantId, updatedConsultant, updateFileName);
    if(updateResearchConstantData){
        res.status(200).send({
            status : 'done',
            massage : 'updated successfully',
            updatedConsultant,
            updateFileName
        })
    }
}

module.exports.deleteResearchConsultant = async(req, res, next) => {
    console.log('body' , req.body);
    const consultantId = req.body;
    const deleteConstantData = await researchConsultancyService.deleteResearchConsultant(consultantId);
    if(deleteConstantData.status === 'done'){
        res.status(200).send({
            status : 'done',
            massage : 'deleted successfully'
        })
    }
    else{
        res.status(500).send({
            status : 'failed',
            massage : 'internal server issue'
        })
    }
}

module.exports.viewResearchProjectConsultancy = async(req, res, next) => {
    const {consultantId} = req.body;
    console.log('consultantId  in controller ==>>', consultantId);
    const viewResearchConsultantData = await researchConsultancyService.viewReseachProjectData(consultantId);
    console.log('viewResearchConsultantData in controller ===>>', viewResearchConsultantData)
    if(viewResearchConsultantData){
        res.status(200).send({
            status : 'done',
            massage : 'successfull',
            consultantData : viewResearchConsultantData
        })
    }
}