const eContentService = require('../services/e-content-development.service')

module.exports.renderEContentDevelopmentPage = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const renderEcontentData = await eContentService.renderEContentDevelopmentModel(userName);

    console.log('Data In Controller ===>>>>', renderEcontentData);

    res.render('e-content-development.ejs', {
        eContentData : renderEcontentData.eContentData,
        rowCount : renderEcontentData.rowCount,
        userName : userName
    });
}


module.exports.insertEContentData = async (req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);
    console.log('Data in controller req.body ====>>>', req.body);

    const insertDataEcontentDeveolpment = await eContentService.insertEcontentRow(req.body, userName);

    console.log('insertDataEcontentDeveolpment ===>>>>', insertDataEcontentDeveolpment);
    const statusCode = insertDataEcontentDeveolpment.status === 'Done' ? 200 : (insertDataEcontentDeveolpment.errorCode ? 400 : 500)
    res.status(statusCode).send({
        status : insertDataEcontentDeveolpment.status,
        message : insertDataEcontentDeveolpment.message,
        eContentId : insertDataEcontentDeveolpment.eContentId,
        EcontentData : insertDataEcontentDeveolpment.EcontentData,
        rowCount : insertDataEcontentDeveolpment.rowCount,
        errorCode : insertDataEcontentDeveolpment.errorCode ? insertDataEcontentDeveolpment.errorCode : null
    })
}


module.exports.updateEcontentData = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);
    console.log('data in controllerrr ====>>>>', req.body)

    const updateEContentRowData = await eContentService.updateEContentReconrd(req.body, userName);

    console.log('updateEContentRowData ===>>>>', updateEContentRowData);
    const statusCode = updateEContentRowData.status === "Done" ? 200 : (updateEContentRowData.errorCode ? 400 : 500);

    res.status(statusCode).send({
        status : updateEContentRowData.status,
        message : updateEContentRowData.message,
        updatedEContentData : updateEContentRowData.updatedEContentData,
        rowCount : updateEContentRowData.rowCount,
        errorCode : updateEContentRowData.errorCode ? updateEContentRowData.errorCode : null
    })
}

module.exports.deleteEcontentRowData = async(req, res, next) => {
    console.log('data id for delete  in controller ===>>>', req.body);

    const deleteEContentRecord = await eContentService.deleteEcontentData(req.body);

    console.log('deleteEContentRecord ===>>>>', deleteEContentRecord);
    const statusCode = deleteEContentRecord.status === "Done" ? 200 : (deleteEContentRecord.errorCode ? 400 : 500)

    res.status(statusCode).send({
        status : deleteEContentRecord.status,
        message : deleteEContentRecord.message,
        errorCode : deleteEContentRecord.errorCode ? deleteEContentRecord.errorCode : null
    })
}

module.exports.viewEContentData = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);
    console.log('id in controller  ===>>>>>', req.body);

    const eContentData = await eContentService.viewEContentRecordData(req.body, userName);

    console.log('eContentData ====>>>>', eContentData)
    const statusCode = eContentData.status === "Done" ? 200 :(eContentData.errorCode ? 400 : 500)
    res.status(statusCode).send({
        status : eContentData.status,
        message : eContentData.message,
        viewEcontentData : eContentData.viewEcontentData,
        errorCode : eContentData.errorCode ? eContentData.errorCode : null
    })
}