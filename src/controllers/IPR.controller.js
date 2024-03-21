const iprServices = require('../services/IPR.services')
module.exports.renderIPR = async(req, res, next) => {

    const iprList = await iprServices.fetchPatentForm();

    console.log('iprList ===>>>', iprList);
    console.log('iprList.IPRDataList ====>>>', iprList.IPRDataList[0].investor_details.authorName)
    res.render('IPR', {
            IPRDataList : iprList.IPRDataList,
            internalEmpList : iprList.internalEmpList,
            externalEmpList : iprList.externalEmpList,
            rowCount : iprList.rowCount
        })
}


module.exports.IPRInsertedData = async(req, res, next) => {
    console.log('data in controller ====>>>>', req.body);
    console.log('files in controller ===>>>>>', req.files);
    const IPRInsertedData = await iprServices.IprInsertDataService(req.body, req.files);
    console.log('IPRInsertedData ===>>> in controller', IPRInsertedData);
    
    const statusCode =IPRInsertedData.status === "Done" ? 200 : (IPRInsertedData.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : IPRInsertedData.status ,
        message : IPRInsertedData.message,
        rowCount : IPRInsertedData.rowCount,
        investorDetailsString : IPRInsertedData.investorDetailsString,
        internalNamesString : IPRInsertedData.internalNamesString,
        externalNamesString : IPRInsertedData.externalNamesString,
        iprFilesString : IPRInsertedData.iprFilesString,
        IprData : IPRInsertedData.IprData,
        iprId : IPRInsertedData.iprId,
        errorCode : IPRInsertedData.errorCode ? IPRInsertedData.errorCode : null
    })
   
}


module.exports.deleteIPRData = async(req, res, next) => {
    console.log('data in controller ===>>>', req.body);
    const iprId = req.body.iprId;

    const iprRowToBeDeleted = await iprServices.deleteIPRRow(iprId);

    const statusCode = iprRowToBeDeleted.status === "Done" ? 200 : (iprRowToBeDeleted.errorCode ? 400 : 500);

    res.status(statusCode).send({
        status : iprRowToBeDeleted.status,
        message : iprRowToBeDeleted.message,
        errorCode : iprRowToBeDeleted.errorCode ? iprRowToBeDeleted.errorCode : null
    })

}

module.exports.updateIPRRowData = async(req, res, next) => {

    console.log('data in controller ===>>>', req.body);
    const iprId = req.body.iprId;
    const iprRowDataToBeUpdated = await iprServices.updatedIprData(iprId, req.body, req.files);

    console.log('iprRowDataToBeUpdated updated data in controller ====>>>>', iprRowDataToBeUpdated);
    const statusCode = iprRowDataToBeUpdated.status === "Done" ? 200 : (iprRowDataToBeUpdated.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : iprRowDataToBeUpdated.status,
        message : iprRowDataToBeUpdated.message,
        investorDetailsString : iprRowDataToBeUpdated.investorDetailsString,
        internalDetailsString : iprRowDataToBeUpdated.internalDetailsString,
        externalDetailsString : iprRowDataToBeUpdated.externalDetailsString,
        existingDetailsString : iprRowDataToBeUpdated.existingDetailsString,
        updatedIPRData : iprRowDataToBeUpdated.updatedIPRData,
        iprFilesString : iprRowDataToBeUpdated.iprFilesString,
        errorCode : iprRowDataToBeUpdated.errorCode ? iprRowDataToBeUpdated.errorCode : null
    })
}


module.exports.viewIprRecordData = async(req, res, next) => {
    console.log('Data In Controller :::>>>>>', req.body);
    const iprId = req.body.iprId;

    const iprRowToBeViewed = await iprServices.viewIprRecordDataRecord(iprId);

    console.log('iprRowToBeViewed ===>>>>>', iprRowToBeViewed);
    const statusCode = iprRowToBeViewed.status === "Done" ? 200 : (iprRowToBeViewed.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : iprRowToBeViewed.status,
        message : iprRowToBeViewed.message,
        IPRData : iprRowToBeViewed.IPRData,
        errorCode : iprRowToBeViewed.errorCode
    })
}