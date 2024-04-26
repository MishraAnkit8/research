
const researchAwardServices = require('../services/research-award.services');
module.exports.renderResearchAward = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);
    
    const researchAwardRenderedData = await researchAwardServices.renderResearchAwardData(userName);
    console.log('researchAwardRenderedData :::::', researchAwardRenderedData);
    res.render('research-award' , {
        status : researchAwardRenderedData.status,
        message : researchAwardRenderedData.message,
        rowCount : researchAwardRenderedData.rowCount,
        researchAwardData : researchAwardRenderedData.researchAwardData ? researchAwardRenderedData.researchAwardData : null
    })
}


module.exports.insertResearchAwardFormData = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    console.log('data in controller ===>>>>>', req.body);

    const researchAwardData = await researchAwardServices.insertResearchAwardData(req.body, req.files, userName);
    console.log('researchAwardData ===>>>>>', researchAwardData);

    const statusCode = researchAwardData.status === "Done" ? 200 : (researchAwardData.errorCode ? 400 : 500)

    res.status(statusCode).send({
        status : researchAwardData.status,
        message : researchAwardData.message,
        researchAwardData : researchAwardData.researchAwardData,
        awardId : researchAwardData.awardId,
        awardFiles : researchAwardData.awardFiles,
        rowCount : researchAwardData.rowCount,
        errorCode : researchAwardData.errorCode ? researchAwardData.errorCode : null
    })
}

module.exports.updateResearchAwardData = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    console.log('Data Comming From Template ===>>>', req.body);

    const udateResearchAward = await researchAwardServices.updateResearchAward(req.body, req.files, userName);

    console.log('udateResearchAward ===>>>>>', udateResearchAward);
    const statusCode = udateResearchAward.status === "Done" ? 200 : (udateResearchAward.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : udateResearchAward.status,
        message : udateResearchAward.message,
        updatedAwardData : udateResearchAward.updatedAwardData,
        researchAwardDocuments : udateResearchAward.updatedReseachAwardDocuments,
        errorCode : udateResearchAward.errorCode ? udateResearchAward.errorCode : null
    })

}


module.exports.deleteResearchAwardRow = async(req, res, next) => {
    console.log('Award Id in Controllor :: >>>>>', req.body);

    const deleteResearchAwardData = await researchAwardServices.deleteResearchAwardData(req.body);

    console.log('deleteResearchAwardData ===>>>>>', deleteResearchAwardData);
    const statusCode = deleteResearchAwardData.status === "Done" ? 200 : (deleteResearchAwardData.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : deleteResearchAwardData.status,
        message : deleteResearchAwardData.message,
        errorCode : deleteResearchAwardData.errorCode ? deleteResearchAwardData.errorCode : null
    })
}

module.exports.viewResearchAwardData = async(req,res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    console.log('award Id In Controller ===>>>', req.body);

    const viewReseachAward = await researchAwardServices.viewResearchRowData(req.body, userName);

    console.log('viewReseachAward data in controller ===>>>', viewReseachAward);
    const statusCode = viewReseachAward.status === "Done" ? 200 : (viewReseachAward.errorCode ? 400 : 500)
    res.status(statusCode).send({
        status : viewReseachAward.status,
        message : viewReseachAward.message,
        veiwResearchAwardRow : viewReseachAward.veiwResearchAwardRow,
        errorCode : viewReseachAward.errorCode ? viewReseachAward.errorCode : null
    })
}