const caseStudyService = require('../services/case-study.service');
const validator = require('../middleware/express-validator/case-study.validator');

module.exports.renderCaseStudy = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const caseStudiesDataList = await caseStudyService.createCaseStudy(userName);
    console.log('data in controller' , caseStudiesDataList);
    res.render('case-study', {
        caseStudiesData : caseStudiesDataList.rows,
        rowCount : caseStudiesDataList.rowCount
    } );
};

module.exports.insertCaseStudies  = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);
    console.log('caseStudy template data ==>>', req.body);

    const insertCaseStudy = await caseStudyService.insertCaseStudies(req.body, req.files, userName);


    const statusCode = insertCaseStudy.status === "Done" ? 200 : (insertCaseStudy.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : insertCaseStudy.status,
        message : insertCaseStudy.message,
        caseStudyId : insertCaseStudy.caseStudyId,
        caseStudyFiles : insertCaseStudy.caseStudyFiles,
        caseStudyData : insertCaseStudy.caseStudyData,
        rowCount : insertCaseStudy.rowCount,
        errorCode : insertCaseStudy.errorCode ? insertCaseStudy.errorCode : null

    })
    // console.log('caseStudyId ==>>' , insertCaseStudy.rows[0].id);
    // if(insertCaseStudy && insertCaseStudy.rows[0].id){
    //     res.status(200).send({
    //         status : 'done',
    //         caseStudyId : insertCaseStudy.rows[0].id
    //     })

    // }
    // else{
    //     res.status(500).send({
    //         status : 'failed',
    //         massage : 'Data is Not inserted'
    //     })
    // }
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
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const casestudyId = req.body.caseStudyId;
    console.log('CaseID For View' ,casestudyId);
    const caseStudiesView = await caseStudyService.viewCaseStudies(casestudyId, userName);
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
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const updatedCaseStudies = req.body;
    console.log('updatedCaseStudies ====>>>>>>>>', updatedCaseStudies);
    const caseStudyId = req.body.caseStudyId;
    console.log('caseId For Updation ::', caseStudyId);
    const updatdeCaseStudiesData = await caseStudyService.updatedCaseStudies(caseStudyId, updatedCaseStudies, userName, req.files);

    const statusCode = updatdeCaseStudiesData.status === 'Done' ? 200 : (updatdeCaseStudiesData.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : updatdeCaseStudiesData.status,
        message : updatdeCaseStudiesData.message,
        updatedCaseStudies : updatdeCaseStudiesData.updatedCaseStudies,
        caseStudyFiles : updatdeCaseStudiesData.caseStudyFiles,
        errorCode : updatdeCaseStudiesData.errorCode ? updatdeCaseStudiesData.errorCode : null
    })

}