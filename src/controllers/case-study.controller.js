const caseStudyService = require('../services/case-study.service');
const { validationResult } = require('express-validator');

module.exports.renderCaseStudy = async(req, res, next) => {
    const caseStudiesDataList = await caseStudyService.createCaseStudy();
    console.log('data in controller' , caseStudiesDataList);
    res.render('case-study', {
        caseStudiesData : caseStudiesDataList
    } );
};

module.exports.insertCaseStudies  = async(req, res, next) => {
    console.log('caseStudy template data ==>>', req.body);
    const insertCaseStudy = await caseStudyService.insertCaseStudies(req.body);
    console.log('caseStudyId ==>>' , insertCaseStudy.rows[0].id);
    if(insertCaseStudy && insertCaseStudy.rows[0].id){
        res.status(200).send({
            status : 'done',
            caseStudyId : insertCaseStudy.rows[0].id
        })

    }
    else{
        res.status(500).send({
            status : 'failed',
            massage : 'Data is Not inserted'
        })
    }
}

module.exports.delCaseStudies = async(req, res, next) => {
    const caseStudyId = req.body.caseStudyId;
    console.log('ID ==>', caseStudyId);
    const caseStudies = await caseStudyService.delCaseStudies(caseStudyId);
    if(caseStudies.status === 'done'){
        res.status(200).send({
            status : 'done',
            massage : caseStudies.massage 
        })
    }
    else{
        res.status(500).send({
            status : 'failed',
            massage : caseStudies.massage
        })
    }
}

module.exports.caseStudyView = async (req, res, next) => {
    const casestudyId = req.body.caseStudyId;
    console.log('CaseID For View' ,casestudyId);
    const caseStudiesView = await caseStudyService.viewCaseStudies(casestudyId);
    console.log('data for view', caseStudiesView)
    if(caseStudiesView){
        res.status(200).send(caseStudiesView)
    }
    else{
        res.staus(500).send({
            status : 'Failed',
            massage : 'failed to view caseStudy'

        })
    }
}

module.exports.updatedCaseStudies = async(req, res, next) => {
    const updatedCaseStudies = req.body;
    const caseStudyId = req.body.caseStudyId;
    console.log('caseId For Updation ::', caseStudyId);
    const updatdeCaseStudiesData = await caseStudyService.updatedCaseStudies({caseStudyId, updatedCaseStudies});
    if(updatdeCaseStudiesData.status === 'done'){
        res.status(200).send({
            status : 'done',
            massage : updatdeCaseStudiesData.massage
        })
    }
    else{
        res.status(500).send({
            status : 'failed',
            massage : updatdeCaseStudiesData.massage
        })
    }
}