const { getRedisData } = require('../../utils/redis.utils');
const iprServices = require('../services/IPR.services')
module.exports.renderIPR = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const iprList = await iprServices.fetchPatentForm(userName);

    // console.log('iprList ===>>>', iprList);
    console.log('iprList.iprData ===>>>>>>', iprList.iprData);
    console.log('iprList.internalEmpList ===>>>>>>', iprList.internalEmpList);
    // console.log('iprList.inventiontype ===>>>>>>', iprList.inventiontype);
    console.log('iprList.patentStatus ===>>>>>>', iprList.patentStatus);
    console.log('iprList.schoolList ===>>>>>>', iprList.schoolList);
    console.log('iprList.schoolList ===>>>>>>', iprList.schoolList);

    res.render('IPR', {
            IPRDataList : iprList.iprData,
            internalEmpList : iprList.internalEmpList,
            rowCount : iprList.rowCount,
            internalFacultyData : iprList.internalEmpList,
            inventionTypData : iprList.inventionTypData,
            patentStatus : iprList.patentStatus,
            nmimsSchoolList : iprList.schoolList,
            nmimsCampusList : iprList.campusList,

        })
}


module.exports.IPRInsertedData = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    console.log('data in controller ====>>>>', req.body);
    console.log('files in controller ===>>>>>', req.files);

    const IPRInsertedData = await iprServices.IprInsertDataService(req.body, req.files, userName);

    console.log('IPRInsertedData ===>>> in controller', IPRInsertedData);
    
    const statusCode =IPRInsertedData.status === "Done" ? 200 : (IPRInsertedData.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : IPRInsertedData.status ,
        message : IPRInsertedData.message,
        rowCount : IPRInsertedData.rowCount,
        iprId : IPRInsertedData.iprId,
        iprGrantsIds : IPRInsertedData.iprGrantsIds,
        iprSchoolIds : IPRInsertedData.iprSchoolIds,
        iprCampusIds : IPRInsertedData.iprCampusIds,
        iprInvetionIds : IPRInsertedData.insertIprInventiontypeIds,
        iprtatusIds : IPRInsertedData.iprstatusIds,
        documentIds : IPRInsertedData.documentIds,
        iprDocumentsIds : IPRInsertedData.iprDocumentsIds,
        IprData : IPRInsertedData.IprData,
        schoolNames : IPRInsertedData.schoolNames,
        campusNames : IPRInsertedData.campusNames,
        invetionTypeNames : IPRInsertedData.invetionTypeNames,
        statusTypeName : IPRInsertedData.statusTypeName,
        iprFilesNamesArray : IPRInsertedData.iprFilesNamesArray,
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
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    console.log('data in controller ===>>>', req.body);
    const iprId = req.body.iprId;
    const iprRowDataToBeUpdated = await iprServices.updatedIprData(iprId, req.body, req.files, userName);

    console.log('iprRowDataToBeUpdated updated data in controller ====>>>>', iprRowDataToBeUpdated);

    const statusCode = iprRowDataToBeUpdated.status === "Done" ? 200 : (iprRowDataToBeUpdated.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : iprRowDataToBeUpdated.status,
        message : iprRowDataToBeUpdated.message,
        iprDocumentsIds : iprRowDataToBeUpdated.iprDocumentsIds,
        insertIprCampusIds: iprRowDataToBeUpdated.insertIprCampusIds,
        insertIprInventiontypeIds: iprRowDataToBeUpdated.insertIprInventiontypeIds,
        insertIprStatusIds: iprRowDataToBeUpdated.insertIprStatusIds,
        schoolNames: iprRowDataToBeUpdated.schoolNames,
        campusNames: iprRowDataToBeUpdated.campusNames,
        documentIds: iprRowDataToBeUpdated.documentIds,
        invetionTypeNames: iprRowDataToBeUpdated.invetionTypeNames,
        statusTypeName: iprRowDataToBeUpdated.statusTypeName,
        updatedIPRData : iprRowDataToBeUpdated.updatedIPRData,
        errorCode : iprRowDataToBeUpdated.errorCode ? iprRowDataToBeUpdated.errorCode : null
    })
}


module.exports.viewIprRecordData = async(req, res, next) => {
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in controller  ===>>>>>>', userName);

    console.log('Data In Controller :::>>>>>', req.body);
    const iprId = req.body.iprId;

    const iprRowToBeViewed = await iprServices.viewIprRecordDataRecord(iprId, userName);

    console.log('iprRowToBeViewed ===>>>>>', iprRowToBeViewed);
    const statusCode = iprRowToBeViewed.status === "Done" ? 200 : (iprRowToBeViewed.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : iprRowToBeViewed.status,
        message : iprRowToBeViewed.message,
        IPRData : iprRowToBeViewed.IPRData,
        facultyData : iprRowToBeViewed.facultyData,
        iprNmimsSchoolList : iprRowToBeViewed.iprNmimsSchoolList,
        iprNmimsCampusList : iprRowToBeViewed.iprNmimsCampusList,
        iprInventionList : iprRowToBeViewed.iprInventionList,
        iprStatusList : iprRowToBeViewed.iprStatusList,
        iprDocumentsList : iprRowToBeViewed.iprDocumentsList,
        errorCode : iprRowToBeViewed.errorCode
    })
}