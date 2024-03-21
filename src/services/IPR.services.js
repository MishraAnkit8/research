const IPRModels = require('../models/IPR.models');


module.exports.fetchPatentForm = async() => {
    const IPRFormData = await IPRModels.fetchIPRData();
    const IPRDataList = IPRFormData.IPRList.rows;
    const externalEmpList = IPRFormData.externalEmpList.rows;
    const internalEmpList = IPRFormData.internalEmpList.rows;
    console.log('IPRDataList ===>>>>', IPRDataList);
    // Extract author DetailsArray from patentList investorDetailsArray
    const investorDetailsArray = IPRFormData.IPRList.rows.map(ipr => ipr.investor_details);
    const resultArray = [
        ...IPRFormData.internalEmpList.rows.map(emp => ({ investorDetails: emp.employee_name, table: 'internalEmpList' })),
        ...IPRFormData.externalEmpList.rows.map(emp => ({ investorDetails: emp.external_emp_name, table: 'externalEmpList' }))
    ];

    console.log('resultArray ====>>>>>>', resultArray)

    IPRDataList.map(IPR => {
        console.log('project in service====>>>>', IPR.investor_details);
        const investorDetails = IPR.investor_details;
        console.log('facultyTypeAuthors ===>>>>', investorDetails);
        const matchedAuthor = resultArray.find(item => item.investorDetails === investorDetails);
        IPR.investor_details = matchedAuthor ? matchedAuthor : { investorDetails:investorDetails, table : "internalEmpList"}
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
    const iprFilesString = files ?.map(file => file.filename).join(',');
    console.log('iprFilesString ====>>>>', iprFilesString);
    const IprData = body;
    // console.log('IprData in services ====>>>>>', IprData);
    const investorDetailsArray = JSON.parse(body.investorDetails);
    //for storing internalDetailsArray and externalDetailsArray faculty name
    const internalDetailsArray = [];
    const externalDetailsArray = [];
    investorDetailsArray.forEach((item) => {
        item.internalEmpList ? internalDetailsArray.push(item.internalEmpList) : null;
        item.externalEmpList ? externalDetailsArray.push(item.externalEmpList) : null;
    });
    // convert array into string
    const internalDetailsArrayString = internalDetailsArray.join(", ");
    const externalDetailsArrayString = externalDetailsArray.join(", ");
    const investorDetailsString = internalDetailsArrayString + externalDetailsArrayString;
    console.log('investorDetailsString ====>>>', internalDetailsArrayString + externalDetailsArrayString)
    console.log("Internal DetailsArray updated:", internalDetailsArrayString);
    console.log("External DetailsArray updated:", externalDetailsArrayString);

    const insertIprData = await IPRModels.InsetIPRDataModels(IprData, iprFilesString, internalDetailsArrayString, externalDetailsArrayString);

    console.log('insertIprData ===>>>>', insertIprData);
    return insertIprData.status === "Done" ? {
        status : insertIprData.status ,
        message : insertIprData.message,
        rowCount : insertIprData.rowCount,
        investorDetailsString : investorDetailsString,
        internalDetailsArrayString : internalDetailsArrayString,
        externalDetailsArrayString : externalDetailsArrayString,
        iprFilesString : iprFilesString,
        IprData : IprData,
        iprId : insertIprData.iprId

    } : {
        status : insertIprData.status,
        message : insertIprData.message,
        errorCode : insertIprData.errorCode
    }
}

module.exports.deleteIPRRow = async(iprId) => {

    const IprRowDataToBeDeleted = await IPRModels.deleteIPRData(iprId);

    return IprRowDataToBeDeleted.status === "Done" ? {
        status : IprRowDataToBeDeleted.status,
        message : IprRowDataToBeDeleted.message
    } : {
        status : IprRowDataToBeDeleted.status,
        message : IprRowDataToBeDeleted.message,
        errorCode : IprRowDataToBeDeleted.errorCode
    }
}


module.exports.updatedIprData = async(iprId, body, files) => {
    console.log('iprId in service ===>>>', iprId);
    const iprFilesString = files ?.map(file => file.filename).join(',');
    console.log('iprFilesString ====>>>>', iprFilesString);
    const updatedIPRData = body;
    console.log('IprData in services ====>>>>>', updatedIPRData);
    const investorDetails = JSON.parse(body.investorDetails);
    console.log('investorDetails ===>>>', investorDetails);
    const internalDetailsArray = [];
    const externalDetailsArray = [];
    const existingDetailsArray = [];

    investorDetails.forEach((item) => {
        item.internalEmpList ? internalDetailsArray.push(item.internalEmpList) : null;
        item.externalEmpList ? externalDetailsArray.push(item.externalEmpList) : null;
        item.existingInvestorDetails ? existingDetailsArray.push(item.existingInvestorDetails) : null;
    });
    // convert array into string
    const internalDetailsString = internalDetailsArray.join(", ");
    const externalDetailsString = externalDetailsArray.join(", ");
    const existingDetailsString = existingDetailsArray.join(",");
    // const investorDetailsString = internalDetailsString + externalDetailsString + existingDetailsString;
    // console.log('investorDetailsString ===>>>>', investorDetailsString)

    const iprDataToBeUpdated = await IPRModels.updateIPRRecordData(iprId, updatedIPRData, iprFilesString, internalDetailsString, externalDetailsString,  existingDetailsString);

    console.log('iprDataToBeUpdated ====>>>>', iprDataToBeUpdated);
    return iprDataToBeUpdated.status === "Done" ? {
        status : iprDataToBeUpdated.status,
        message : iprDataToBeUpdated.message,
        // investorDetailsString : investorDetailsString,
        internalDetailsString : internalDetailsString,
        externalDetailsString : externalDetailsString,
        existingDetailsString : existingDetailsString,
        updatedIPRData : updatedIPRData,
        iprFilesString : iprFilesString ? iprFilesString : null

    } : {
        status : iprDataToBeUpdated.status,
        message : iprDataToBeUpdated.message,
        errorCode : iprDataToBeUpdated.errorCode
    };

}

module.exports.viewIprRecordDataRecord = async(iprId) => {
    console.log('iprId in service ===>>>>', iprId);

    const viewIprRowData = await IPRModels.iprRecordToBeViewed(iprId);

    console.log('viewIprRowData ===>>>', viewIprRowData);
    return viewIprRowData.status === "Done" ? {
        status : viewIprRowData.status,
        message : viewIprRowData.message,
        IPRData : viewIprRowData.IPRData,

    } : {
        status : viewIprRowData.status,
        message : viewIprRowData.message,
        errorCode : viewIprRowData.errorCode
    };
}