const IPRModels = require('../models/IPR.models');


module.exports.fetchPatentForm = async(userName) => {
    const IPRFormData = await IPRModels.fetchIPRData(userName);
    console.log('IPRFormData ===>>>>>', IPRFormData);

    const iprData = IPRFormData.iprData;
    console.log('iprData ====>>>>>', iprData);

    return IPRFormData.status === "Done" ? {
        status : IPRFormData.status,
        message : IPRFormData.message,
        rowCount : IPRFormData.rowCount,
        iprData : IPRFormData.iprData,
        internalEmpList : IPRFormData.internalEmpList,
        inventionTypData : IPRFormData.inventionTypData,
        patentStatus : IPRFormData.patentStatus,
        schoolList : IPRFormData.nmimsSchoolList,
        campusList : IPRFormData.nmimsCampusList,
        supportingDocumnets : IPRFormData.supportingdocumnets

    } : {}

}


module.exports.IprInsertDataService = async(body, files, userName) => {
    const iprFilesNamesArray = files ?.map(file => file.filename);
    console.log('iprFilesNamesArray ====>>>>', iprFilesNamesArray);
    const IprData = body;

    console.log('IprData in services ===>>>>', IprData);
    const statusIds = [parseInt(IprData.patentStage)];
    console.log('statusIds ===>>>>>', statusIds);
    //parsing data coming from frontend 
    const facultyData = JSON.parse(IprData.facultyDataContainer);
    const inventionTypeData = JSON.parse(IprData.typeOfInvention);
    const nmimsSchoolIds = JSON.parse(IprData.nmimsSchoolIds);
    const nmimsCampusIds = JSON.parse(IprData.nmimsCampusIds);

    // Extract internalFaculty and externalEmpList arrays
    const internalFaculty = facultyData.find(item => item !== null && item.internalFaculty)?.internalFaculty || [];
    const externalEmpList = facultyData.find(item => item  !== null && item.externalEmpList )?.externalEmpList || [];
    const internalFacultyList =  internalFaculty.map(Number)
    const FacultydataArray = [...externalEmpList, ...internalFacultyList];
    const patentStatus = [parseInt(IprData.patentStage)];

    const schoolIdsArray = (nmimsSchoolIds.nmimsSchool || []).map(id => parseInt(id));
    const campusIdsArray = (nmimsCampusIds.nmimsCampus || []).map(id => parseInt(id));
    const inventionTypeIdsArray = (inventionTypeData.typeOfInventions || []).map(id => parseInt(id));


    console.log('schoolIdsArray ===>>>>>', schoolIdsArray);
    console.log('campusIdsArray ===>>>>>', campusIdsArray);
    console.log('inventionTypeIdsArray ===>>>>>', inventionTypeIdsArray);

    const insertIprData = await IPRModels.InsetIPRDataModels(IprData, iprFilesNamesArray, FacultydataArray, schoolIdsArray, campusIdsArray, inventionTypeIdsArray, patentStatus, userName);

    console.log('insertIprData ===>>>>', insertIprData);
    console.log('schoolDataList ===>>>>', insertIprData.schoolNames);

    
    return insertIprData.status === "Done" ? {
        status : insertIprData.status ,
        message : insertIprData.message,
        rowCount : insertIprData.rowCount,
        iprId : insertIprData.iprId,
        iprGrantsIds : insertIprData.insertIprFacultyIds,
        iprSchoolIds : insertIprData.insertIprSchoolIds,
        iprCampusIds : insertIprData.insertIprCampusIds,
        insertIprInventiontypeIds : insertIprData.insertIprInventiontypeIds,
        iprstatusIds : insertIprData.insertIprStatusIds,
        documentIds : insertIprData.documentIds,
        iprFilesNamesArray : iprFilesNamesArray,
        iprDocumentsIds : insertIprData.iprDocumentsIds,
        IprData : IprData,
        schoolNames : insertIprData.schoolNames,
        campusNames : insertIprData.campusNames,
        invetionTypeNames : insertIprData.invetionTypeNames,
        statusTypeName : insertIprData.statusTypeName,
        statusIds : IprData.patentStage

    } : {
        status : insertIprData.status,
        message : insertIprData.message,
        errorCode : insertIprData.errorCode
    }
}

module.exports.deleteIPRRow = async(iprId) => {
    console.log('iprId in servicess ===>>>>', iprId);

    const IprRowDataToBeDeleted = await IPRModels.deleteIPRData(iprId);

    console.log('IprRowDataToBeDeleted ===>>>>>', IprRowDataToBeDeleted);

    return IprRowDataToBeDeleted.status === "Done" ? {
        status : IprRowDataToBeDeleted.status,
        message : IprRowDataToBeDeleted.message
    } : {
        status : IprRowDataToBeDeleted.status,
        message : IprRowDataToBeDeleted.message,
        errorCode : IprRowDataToBeDeleted.errorCode
    }
}


module.exports.updatedIprData = async(iprId, body, files, userName) => {
    console.log('iprId in service ===>>>', iprId);
    const iprFilesNamesArray = files ?.map(file => file.filename);
    console.log('iprFilesNamesArray ====>>>>', iprFilesNamesArray);
    const updatedIPRData = body;
    // const statusIds = updatedIPRData.patentStage !== '' ? [parseInt(updatedIPRData.patentStage)] : null;
    // console.log('statusIds ===>>>>>', statusIds);
    //parsing data coming from frontend 
    const facultyData = JSON.parse(updatedIPRData.facultyDataContainer);
    const inventionTypeData =  updatedIPRData.typeOfInvention !== 'undefined' ?  JSON.parse(updatedIPRData.typeOfInvention) : null;
    const nmimsSchoolIds = updatedIPRData.nmimsSchoolIds !== 'undefined' ? JSON.parse(updatedIPRData.nmimsSchoolIds) : null;
    const nmimsCampusIds = updatedIPRData.nmimsCampusIds !== 'undefined' ? JSON.parse(updatedIPRData.nmimsCampusIds) : null;
    // Extract internalFaculty and externalEmpList arrays
    const internalFaculty = facultyData.find(item => item !== null && item.internalFaculty)?.internalFaculty || [];
    const externalEmpList = facultyData.find(item => item  !== null && item.externalEmpList )?.externalEmpList || [];
    const internalFacultyList =  internalFaculty.map(Number)
    const FacultydataArray = [...externalEmpList, ...internalFacultyList];
    const patentStatus =  updatedIPRData.patentStage !== '' ? [parseInt(updatedIPRData.patentStage)] : [];

    const schoolIdsArray = updatedIPRData.nmimsSchoolIds !== 'undefined' ? (nmimsSchoolIds.nmimsSchool || []).map(id => parseInt(id)) : [];
    const campusIdsArray = updatedIPRData.nmimsCampusIds !== 'undefined' ? (nmimsCampusIds.nmimsCampus || []).map(id => parseInt(id)) : [];
    const inventionTypeIdsArray = updatedIPRData.typeOfInvention !== 'undefined' ? (inventionTypeData.typeOfInventions || []).map(id => parseInt(id)) : [];

    // console.log('schoolIdsArray ===>>>>>', schoolIdsArray);
    // console.log('campusIdsArray ===>>>>>', campusIdsArray);
    // console.log('inventionTypeIdsArray ===>>>>>', inventionTypeIdsArray);
   
    const iprDataToBeUpdated = await IPRModels.updateIPRRecordData(iprId, updatedIPRData,  iprFilesNamesArray, FacultydataArray, schoolIdsArray, campusIdsArray, inventionTypeIdsArray, patentStatus, userName);

    console.log('iprDataToBeUpdated ====>>>>', iprDataToBeUpdated);

    return iprDataToBeUpdated.status === "Done" ? {
        status : iprDataToBeUpdated.status,
        message : iprDataToBeUpdated.message,
        iprDocumentsIds : iprDataToBeUpdated.iprDocumentsIds,
        insertIprCampusIds: iprDataToBeUpdated.insertIprCampusIds,
        insertIprInventiontypeIds: iprDataToBeUpdated.insertIprInventiontypeIds,
        insertIprStatusIds: iprDataToBeUpdated.insertIprStatusIds,
        schoolNames: iprDataToBeUpdated.schoolNames,
        campusNames: iprDataToBeUpdated.campusNames,
        documentIds: iprDataToBeUpdated.documentIds,
        invetionTypeNames: iprDataToBeUpdated.invetionTypeNames,
        statusTypeName: iprDataToBeUpdated.statusTypeName,
        updatedIPRData : updatedIPRData

    } : {
        status : iprDataToBeUpdated.status,
        message : iprDataToBeUpdated.message,
        errorCode : iprDataToBeUpdated.errorCode
    };

}

module.exports.viewIprRecordDataRecord = async(iprId, userName) => {
    console.log('iprId in service ===>>>>', iprId);

    const viewIprRowData = await IPRModels.iprRecordToBeViewed(iprId, userName);

    console.log('viewIprRowData ===>>>', viewIprRowData);

    return viewIprRowData.status === "Done" ? {
        status : viewIprRowData.status,
        message : viewIprRowData.message,
        IPRData : viewIprRowData.IPRData,
        facultyData : viewIprRowData.facultyData,
        iprNmimsSchoolList : viewIprRowData.iprNmimsSchoolList,
        iprNmimsCampusList : viewIprRowData.iprNmimsCampusList,
        iprInventionList : viewIprRowData.iprInventionList,
        iprStatusList : viewIprRowData.iprStatusList,
        iprDocumentsList : viewIprRowData.iprDocumentsList

    } : {
        status : viewIprRowData.status,
        message : viewIprRowData.message,
        errorCode : viewIprRowData.errorCode
    };
}