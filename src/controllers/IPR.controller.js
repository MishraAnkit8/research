const iprServices = require('../services/IPR.services')
module.exports.renderIPR = async(req, res, next) => {
    const iprList = await iprServices.fetchPatentForm();
    console.log('iprList ===>>>', iprList);
    res.render('IPR', {
            IPRDataList : iprList.IPRDataList,
            internalEmpList : iprList.internalEmpList,
            externalEmpList : iprList.externalEmpList,
            rowCount : iprList.rowCount
        })
}


module.exports.IPRInsertedData = async(req, res, next) => {
    console.log('data in controller ====>>>>', req.body);
    const IPRInsertedData = await iprServices.IprInsertDataService(req.body, req.files);
    console.log('IPRInsertedData ===>>> in controller', IPRInsertedData)
    const statusCode =IPRInsertedData.status === "Done" ? 200 : (IPRInsertedData.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : IPRInsertedData.status ,
        message : IPRInsertedData.message,
        rowCount : IPRInsertedData.rowCount,
        authorNameString : IPRInsertedData.authorNameString,
        internalNamesString : IPRInsertedData.internalNamesString,
        externalNamesString : IPRInsertedData.externalNamesString,
        iprFilesString : IPRInsertedData.iprFilesString,
        IprData : IPRInsertedData.IprData,
        iprId : IPRInsertedData.iprId,
        errorCode : IPRInsertedData.errorCode ? IPRInsertedData.errorCode : null
    })
   
}