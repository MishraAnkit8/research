const researchConsultancyService = require('../services/research-consultancy.service');
const clientScript = require('../../public/js/client');
const path = require('path');

module.exports.renderResearchProjectConsultancy = async(req, res, next) => {

    const researchcConsultancyData = await researchConsultancyService.fetchResearConsultacyData();
    if(researchcConsultancyData){
        res.render('research-project-consultancy' , {
            reseachConsultancyDataList : researchcConsultancyData.rows,
            rowCount : researchcConsultancyData.rowCount
        })
    }
    
}

module.exports.insertResearchConsultancyData = async(req, res, next) => {
    const researchConsultantData =  req.body;
    console.log('researchConsultantData ==>>', researchConsultantData);
    // const {filename} = req.file;
    // console.log('file name ', filename);
    console.log('files in controllerr ==>>>', req.files);
    const researchConsultancyData = await researchConsultancyService.insertResearchConsultancyData(req.body, req.files);
    console.log('consultantId',researchConsultancyData.consultantId)
    const consultancyFileName = researchConsultancyData.consultancyDataFiles;
    if(researchConsultancyData){
        res.status(200).send({
            status : 'done',
            massage : 'data inserted successfully',
            consultancyFileName,
            consultantId : researchConsultancyData.consultantId,
            researchConsultantData : researchConsultantData

        })
    }

}

module.exports.updatedConsultantData = async(req, res, next) => {
    console.log('data comming from templates ==>>', req.body);
    if(req.files){
        console.log(' updated file name ==>', req.files);
        const consultantId = req.body.consultantId
        const updatedConsultant = req.body;
        const updateResearchConstantData = await researchConsultancyService.updateResearchConstant(consultantId, updatedConsultant, req.files);
        const updatedConsultantFilesString = updateResearchConstantData.updatedConsultantFilesData;
        console.log('updated files string in controller ====>>>>>', updatedConsultantFilesString)
        if(updateResearchConstantData){
            res.status(200).send({
                status : 'done',
                massage : 'updated successfully',
                updatedConsultant,
                updatedConsultantFilesString
            })
        }
    }

    else{
        const consultantId = req.body.consultantId
        const updatedConsultant = req.body;
        const updateResearchConstantData = await researchConsultancyService.updateResearchConstant(consultantId, updatedConsultant);
        if(updateResearchConstantData){
            res.status(200).send({
                status : 'done',
                massage : 'updated successfully',
                updatedConsultant
            })
        }
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