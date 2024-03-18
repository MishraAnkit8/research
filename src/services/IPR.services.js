const IPRModels = require('../models/IPR.models');


module.exports.fetchPatentForm = async() => {
    const IPRFormData = await IPRModels.fetchIPRData();
    const IPRDataList = IPRFormData.IPRList.rows;
    const externalEmpList = IPRFormData.externalEmpList.rows;
    const internalEmpList = IPRFormData.internalEmpList.rows;
    console.log('IPRDataList ===>>>>', IPRDataList);
    // Extract author names from patentList
    const authorNameArray = IPRFormData.IPRList.rows.map(ipr => ipr.applicants_name);
    const resultArray = [
        ...IPRFormData.internalEmpList.rows.map(emp => ({ authorName: emp.employee_name, table: 'internalEmpList' })),
        ...IPRFormData.externalEmpList.rows.map(emp => ({ authorName: emp.external_emp_name, table: 'externalEmpList' }))
    ];

    console.log('resultArray ====>>>>>>', resultArray)

    IPRDataList.map(IPR => {
        console.log('project in service====>>>>', IPR.applicants_name);
        const facultyTypeAuthors = IPR.applicants_name;
        console.log('facultyTypeAuthors ===>>>>', facultyTypeAuthors);
        const matchedAuthor = resultArray.find(item => item.authorName === facultyTypeAuthors);
        IPR.applicants_name = matchedAuthor ? matchedAuthor : { authorName:facultyTypeAuthors, table : "internalEmpList"}
        console.log('matchedAuthor ====>>>>', matchedAuthor)
        
    });
    console.log('IPRDataList ===>>>', IPRDataList)
    const rowCount = IPRFormData.IPRList.rowCount;
    console.log('rowCount ===>>>', rowCount)
    return {
        IPRDataList : IPRDataList,
        internalEmpList : internalEmpList,
        externalEmpList : externalEmpList,
        rowCount : rowCount
    }
}


module.exports.IprInsertDataService = async(body, files) => {
    const iprFilesString = files ?.map(file => file.name).join(',');
    const IprData = body;
    // console.log('IprData in services ====>>>>>', IprData);
    const authorNameArray = JSON.parse(body.authorName);
    //for storing internalNames and externalNames faculty name
    const internalNames = [];
    const externalNames = [];
    authorNameArray.forEach((item) => {
        item.internalEmpList ? internalNames.push(item.internalEmpList) : null;
        item.externalEmpList ? externalNames.push(item.externalEmpList) : null;
    });
    // convert array into string
    const internalNamesString = internalNames.join(", ");
    const externalNamesString = externalNames.join(", ");
    const authorNameString = internalNamesString + externalNamesString;
    console.log('authorNameString ====>>>', internalNamesString + externalNamesString)
    console.log("Internal Names updated:", internalNamesString);
    console.log("External Names updated:", externalNamesString);

    const insertIprData = await IPRModels.InsetIPRDataModels(IprData, iprFilesString, internalNamesString, externalNamesString);

    console.log('insertIprData ===>>>>', insertIprData);
    return insertIprData.status === "Done" ? {
        status : insertIprData.status ,
        message : insertIprData.message,
        rowCount : insertIprData.rowCount,
        authorNameString : authorNameString,
        internalNamesString : internalNamesString,
        externalNamesString : externalNamesString,
        iprFilesString : iprFilesString,
        IprData : IprData,
        iprId : insertIprData.iprId

    } : {
        status : insertIprData.status,
        message : insertIprData.message,
        errorCode : insertIprData.errorCode
    }
}