const { getRedisData } = require('../../utils/redis.utils');
const iprServices = require('../services/IPR.services');

module.exports.renderIPR = async(req, res, next) => {
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);

    const iprList = await iprServices.fetchPatentForm(userName);

    // console.log('iprList ===>>>', iprList);
    // console.log('iprList.iprData ===>>>>>>', iprList.iprData);
    // console.log('iprList.internalEmpList ===>>>>>>', iprList.internalEmpList);
    // console.log('iprList.inventiontype ===>>>>>>', iprList.inventiontype);
    // console.log('iprList.patentStatus ===>>>>>>', iprList.patentStatus);
    // console.log('iprList.schoolList ===>>>>>>', iprList.schoolList);
    // console.log('iprList.schoolList ===>>>>>>', iprList.schoolList);

    res.render('IPR', {
            IPRDataList : iprList.iprData,
            internalEmpList : iprList.internalEmpList,
            rowCount : iprList.rowCount,
            internalFacultyData : iprList.internalEmpList,
            inventionTypData : iprList.inventionTypData,
            patentStatus : iprList.patentStatus,
            nmimsSchoolList : iprList.schoolList,
            nmimsCampusList : iprList.campusList,
            patentSdgGoalData : iprList.patentSdgGoalData,
            userName : userName

        })
}


module.exports.IPRInsertedData = async(req, res, next) => {
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);

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
        iprFacultyIds : IPRInsertedData.iprFacultyIds,
        iprSdgGoalsIds : IPRInsertedData.iprSdgGoalsIds,
        iprInventionIds : IPRInsertedData.iprInventionIds,
        iprStatusIds : IPRInsertedData.iprStatusIds,
        externalIds : IPRInsertedData.externalIds,
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
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);
    
    console.log('data in controller ===>>>', req.body);

    const iprId = req.body.iprId;

    const iprRowDataToBeUpdated = await iprServices.updatedIprData(iprId, req.body, req.files, userName);

    console.log('iprRowDataToBeUpdated updated data in controller ====>>>>', iprRowDataToBeUpdated);

    const statusCode = iprRowDataToBeUpdated.status === "Done" ? 200 : (iprRowDataToBeUpdated.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : iprRowDataToBeUpdated.status,
        message : iprRowDataToBeUpdated.message,
        iprFacultyIds : iprRowDataToBeUpdated.iprFacultyIds,
        iprSdgGoalsIds : iprRowDataToBeUpdated.iprSdgGoalsIds,
        iprInventionIds : iprRowDataToBeUpdated.iprInventionIds,
        iprStatusIds : iprRowDataToBeUpdated.iprStatusIds,
        externalIds : iprRowDataToBeUpdated.externalIds,
        iprRowCount: iprRowDataToBeUpdated.iprRowCount, 
        updatedFacultyRowCount: iprRowDataToBeUpdated.updatedFacultyRowCount ,
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
        sdgGoals : iprRowToBeViewed.sdgGoals,
        errorCode : iprRowToBeViewed.errorCode
    })
}


module.exports.retriveExternalDetails = async(req, res, next) => {
    console.log('data commimg from frontend ====>>>>>', req.body);
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in controller  ===>>>>>>', userName);
  
    const retriveFacultyData = await iprServices.retriveExternalData(req.body, userName);
  
    console.log('retriveFacultyData ====>>>>>>', retriveFacultyData);
    const statusCode = retriveFacultyData.status === "Done" ? 200 : (retriveFacultyData.errorCode ? 400 : 500);
  
    res.status(statusCode).send({
      status : retriveFacultyData.status,
      message : retriveFacultyData.message,
      exetrnalData : retriveFacultyData.exetrnalData,
      rowCount : retriveFacultyData.rowCount,
      errorCode : retriveFacultyData.errorCode ?retriveFacultyData.errorCode : null
    })
  
  
  
  }

module.exports.deletePatentExternalFaculty = async(req, res, next) => {
    console.log('data comming from frontend =====>>>>>>', req.body);
  
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in controller  ===>>>>>>', userName);
  
    const deleteExternalFaculty = await iprServices.deleteExternalFacultyDetails(req.body, userName);
  
    console.log('deleteExternalFaculty ====>>>>>>', deleteExternalFaculty);
    const statusCode = deleteExternalFaculty.status === "Done" ? 200 : (deleteExternalFaculty.errorCode ? 400 : 500);
  
    res.status(statusCode).send({
      status : deleteExternalFaculty.status,
      message : deleteExternalFaculty.message,
      rowCount : deleteExternalFaculty.rowCount,
      errorCode : deleteExternalFaculty.errorCode ?deleteExternalFaculty.errorCode : null
    })
  
  
  
  }


//delete  article school details from drop down
module.exports.deleteInternalFaculty = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('Data Comming from Template' , req.body);
    console.log('userName ====>>>>>>', userName);

    const deleteSchoolStatus = await iprServices.deleteIprInternalFaculty(req.body, userName);

    console.log('deleteSchoolStatus ===>>>>>>', deleteSchoolStatus);
    const statusCode = deleteSchoolStatus.status === "Done" ? 200 : (deleteSchoolStatus.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : deleteSchoolStatus.status,
        message : deleteSchoolStatus.message,
        errorCode : deleteSchoolStatus.errorCode ? deleteSchoolStatus.errorCode : null
    })


}

//delete  article details  campus from drop down
module.exports.deleteSdgGoals = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('Data Comming from Template' , req.body);
    console.log('userName ====>>>>>>', userName);

    const deleteCampusStatus = await iprServices.deleteIprSdgDetails(req.body, userName);

    console.log('deleteCampusStatus ===>>>>>>', deleteCampusStatus);

    const statusCode = deleteCampusStatus.status === "Done" ? 200 : (deleteCampusStatus.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : deleteCampusStatus.status,
        message : deleteCampusStatus.message,
        errorCode : deleteCampusStatus.errorCode ? deleteCampusStatus.errorCode : null
    })

}

//delete  article policy cadre details from drop down
module.exports.deletePatentStage = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('Data Comming from Template' , req.body);
    console.log('userName ====>>>>>>', userName);

    const deleteInternalAuthorsStatus = await iprServices.deleteIprStatusData(req.body, userName);

    console.log('deleteInternalAuthorsStatus ===>>>>>>', deleteInternalAuthorsStatus);

    const statusCode = deleteInternalAuthorsStatus.status === "Done" ? 200 : (deleteInternalAuthorsStatus.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : deleteInternalAuthorsStatus.status,
        message : deleteInternalAuthorsStatus.message,
        errorCode : deleteInternalAuthorsStatus.errorCode ? deleteInternalAuthorsStatus.errorCode : null
    })

}

//delete  article intenal nmims details from drop down
module.exports.deleteInventionDetails = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('Data Comming from Template' , req.body);
    console.log('userName ====>>>>>>', userName);

    const deleteAllAuthorsStatus = await iprServices.deleteIprInventionTypeData(req.body, userName);

    console.log('deleteAllAuthorsStatus ===>>>>>>', deleteAllAuthorsStatus);
    const statusCode = deleteAllAuthorsStatus.status === "Done" ? 200 : (deleteAllAuthorsStatus.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : deleteAllAuthorsStatus.status,
        message : deleteAllAuthorsStatus.message,
        errorCode : deleteAllAuthorsStatus.errorCode ? deleteAllAuthorsStatus.errorCode : null
    })

}