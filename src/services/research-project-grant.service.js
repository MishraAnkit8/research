const researchCunsultancyModel = require('../models/research-project-grant.models');

module.exports.fetchResearConsultacyData = async() => {
    const researchConsultancyData = await researchCunsultancyModel.fetchResearchConsultancy();
    console.log('researchConsultancyData in services ===>>>>>',researchConsultancyData.researchData);
    console.log('facultTableData in services :::::===>>>>>',researchConsultancyData.facultTableData);


    // Logging for debugging
    // const reseachProjectGrantList = researchConsultancyData.researchConsultancyList.rows;
    // const externalEmpList = researchConsultancyData.externalEmpList.rows;
    // const internalEmpList = researchConsultancyData.internalEmpList.rows;

    // // Extract author names from patentList
    // const authorNameArray = researchConsultancyData.researchConsultancyList.rows.map(research => research.faculty_type);
    // // console.log('authorNameArray ===>>>>', authorNameArray)
    // // Consolidate internal and external employee lists with additional info
    // const resultArray = [
    //     ...researchConsultancyData.internalEmpList.rows.map(emp => ({ authorName: emp.employee_name, table: 'internalEmpList' })),
    //     ...researchConsultancyData.externalEmpList.rows.map(emp => ({ authorName: emp.external_emp_name, table: 'externalEmpList' }))
    // ];

    // console.log('resultArray ====>>>>>>', resultArray)

    //  reseachProjectGrantList.map(project => {
    //     console.log('project in service====>>>>', project.faculty_type);
    //     const facultyTypeAuthors = project.faculty_type;
    //     console.log('facultyTypeAuthors ===>>>>', facultyTypeAuthors);
    //     const matchedAuthor = resultArray.find(item => item.authorName === facultyTypeAuthors);
    //     project.faculty_type = matchedAuthor ? matchedAuthor : { authorName:facultyTypeAuthors, table : "internalEmpList"}
    //     console.log('matchedAuthor ====>>>>', matchedAuthor)
        
    // });
    // console.log('reseachProjectGrantList ===>>>', reseachProjectGrantList)
    // console.log('researchConsultancyData in  ankit services ===>>>>>',researchConsultancyData)
    // const rowCount = researchConsultancyData.researchConsultancyList.rowCount;
    // console.log('rowCount ===>>>', rowCount)

    // return {
    //     reseachProjectGrantList : reseachProjectGrantList,
    //     internalEmpList : internalEmpList,
    //     externalEmpList : externalEmpList,
    //     rowCount : rowCount
    // }

    return researchConsultancyData.status === "Done" ? {
        status : researchConsultancyData.status,
        researchData : researchConsultancyData.researchData,
        InternalFaculty : researchConsultancyData.facultTableData,
        message : researchConsultancyData.message,
        rowCount : researchConsultancyData.rowCount,
        errorCode : researchConsultancyData.errorCode
    } : {
        status : researchConsultancyData.status,
        message : researchConsultancyData.message,
        errorCode : researchConsultancyData.errorCode
    }

}

module.exports.insertResearchConsultancyData = async(body , files) => {
    const researchCunsultancyData = body;
    // console.log('data in service =====>>>>', researchCunsultancyData.internalEmpId)
    const facultyDataContainer = JSON.parse(body.facultyDataContainer);
    console.log('facultyDataContainer ====>>>', facultyDataContainer);
    //for storing internalNames and externalNames faculty name
    const internalFacultyId = [];
    const exeternalFacultyRecord = [];
    facultyDataContainer.forEach((item) => {
        item.internalFaculty ?  internalFacultyId.push(...item.internalFaculty) : null;
        item.externalEmpList ? exeternalFacultyRecord.push(...item.externalEmpList) : null;
    });

    const filteredData = exeternalFacultyRecord.filter(obj => {
        return Object.keys(obj).length !== 0 && obj.constructor === Object && Object.values(obj).some(val => val !== '');
      });
  
      console.log('filteredData ===>>>>>>', filteredData);
      const facultyNamearray = [];
      const facultyDsgArray = [];
      const facultyAddrArray = [];
      
      filteredData.forEach(({ facultyName, facultyDsg, facultyAddr }) => {
        facultyName && facultyName != 'undefined' ? facultyNamearray.push(facultyName) : null;
        facultyDsg  && facultyDsg != 'undefined'? facultyDsgArray.push(facultyDsg) : null;
        facultyAddr && facultyAddr != 'undefined' ? facultyAddrArray.push(facultyAddr) : null;
      });
      
      let arraycontaner =  [];
      if(facultyNamearray.length === facultyDsgArray.length && facultyDsgArray.length  === facultyAddrArray.length ){
        for(let  i = 0; i <= facultyNamearray.length -1 ; i++){
            const arrarData = []
            arrarData.push(facultyNamearray[i], facultyDsgArray[i], facultyAddrArray[i]);
            arraycontaner.push(arrarData)
        }
      }
      console.log('facultyNamearray ===>>>>', facultyNamearray);
      console.log('facultyDsgArray ===>>>>', facultyDsgArray);
      console.log('facultyAddrArray ===>>>>', facultyAddrArray);
      console.log('arraycontaner ===>>>>', arraycontaner)

      

    console.log('internalFacultyId ===>>>>', internalFacultyId);
    console.log('exeternalFacultyRecord ===>>>', exeternalFacultyRecord);
    const consultancyDataFiles = files?.map(file => file.filename).join(',');
    console.log('consultancyDataFiles ===>>>>', consultancyDataFiles)
    const researchProjectConsultancy = await researchCunsultancyModel.insertResearhcProjectConstancyData(researchCunsultancyData , consultancyDataFiles, internalFacultyId, exeternalFacultyRecord);
    console.log('researchProjectConsultancy ===>>>' , researchProjectConsultancy);
    return researchProjectConsultancy.status === "Done" ? {
        status : "Done",
        externalEmpId : researchProjectConsultancy.externalEmpId,
        consultantId : researchProjectConsultancy.consultantId,
        rowCount : researchProjectConsultancy.rowCount,
        message : researchProjectConsultancy.message,
        authorNameString : authorNameString,
        externalNamesString : externalNamesString,
        internalNamesString : internalNamesString,
        consultancyDataFiles : consultancyDataFiles
    } :
    {   status : researchProjectConsultancy.status,
        message : researchProjectConsultancy.message,
        errorCode : researchProjectConsultancy.errorCode
    }
}

module.exports.updateResearchConstant = async(consultantId, body, files) => {
  const updatedResearchGrant = body;
  console.log('body ====>>>>', body);
  console.log('body type ==>> ' , typeof  body.authorName)
  const authorNameArray = JSON.parse(body.authorName) ? JSON.parse(body.authorName) : body.authorName ;
 console.log('authorNameArray ===>>>', authorNameArray)

  const internalNames = [];
  const externalNames = [];
  const existingName = [];

  authorNameArray.forEach((item) => {
    item.internalEmpList ? internalNames.push(item.internalEmpList) : null;
    item.externalEmpList ? externalNames.push(item.externalEmpList) : null;
    item.existingNameValue ? existingName.push(item.existingNameValue) : null;
  });
  // convert array into string
  const internalNamesString = internalNames.join(", ");
  const externalNamesString = externalNames.join(", ");
  const existingNameString = existingName.join(",");
  const authorNameString = internalNamesString + externalNamesString + existingNameString;
  console.log("Internal Names updated:", internalNamesString);
  console.log("External Names updated:", externalNamesString);
  console.log('storedNameString ===>>>', existingNameString);
  console.log('authorNameString ====>>>', authorNameString);
  const updatedConsultantFilesData = files ?.map(file => file.filename).join(',')
  const updateResearchProjectConstant = await researchCunsultancyModel.updateResearchConsultantData(consultantId ,updatedResearchGrant, updatedConsultantFilesData, existingNameString, internalNamesString, externalNamesString);
  console.log('updateResearchProjectConstant =====>>>>>', updateResearchProjectConstant);
  return updateResearchProjectConstant.status === "Done" ? 
   {
    status : updateResearchProjectConstant.status,
    message : updateResearchProjectConstant.message,
    updateResearchProjectConstant,
    updatedConsultantFilesData,
    authorNameString : authorNameString,
    externalTableName : externalNamesString ? 'externalEmpList' : null,
    intenalTableName : internalNamesString ? 'internalEmpList' : null,
    existingNameString : existingNameString ? 'existingNameValue' : null,
  }:{
    status: updateResearchProjectConstant.status,
    message: updateResearchProjectConstant.message,
    errorCode  : updateResearchProjectConstant.errorCode
  };
    
}

module.exports.deleteResearchConsultant = async({consultantId}) => {
    console.log('Id in serevice for delete ', consultantId)
    const deleteRseachConsultancy = await researchCunsultancyModel.deleteResearchConsultantData(consultantId);
    if(deleteRseachConsultancy.rowCount === 1){
        return {
            status : 'Done',
            massage : 'Deleted Successfully'
        }
    }
}

module.exports.viewReseachProjectData = async(consultantId) => {
    console.log('consultantId in servicve ===>>>', consultantId)
    const researchConsultancy = await researchCunsultancyModel.viewResearchConsultancy(consultantId);
    console.log('researchConsultancy ==>>', researchConsultancy.rows[0])
    return researchConsultancy.rows[0]
}