const researchCunsultancyModel = require('../models/research-project-grant.models');

module.exports.fetchResearConsultacyData = async() => {
    const researchConsultancyData = await researchCunsultancyModel.fetchResearchConsultancy();
    console.log('researchConsultancyData in services ===>>>>>',researchConsultancyData.researchConsultancyList.rows)
    // Logging for debugging
    const reseachProjectGrantList = researchConsultancyData.researchConsultancyList.rows;
    const externalEmpList = researchConsultancyData.externalEmpList.rows;
    const internalEmpList = researchConsultancyData.internalEmpList.rows;

    // Extract author names from patentList
    const authorNameArray = researchConsultancyData.researchConsultancyList.rows.map(research => research.faculty_type);
    // console.log('authorNameArray ===>>>>', authorNameArray)
    // Consolidate internal and external employee lists with additional info
    const resultArray = [
        ...researchConsultancyData.internalEmpList.rows.map(emp => ({ authorName: emp.employee_name, table: 'internalEmpList' })),
        ...researchConsultancyData.externalEmpList.rows.map(emp => ({ authorName: emp.external_emp_name, table: 'externalEmpList' }))
    ];

    console.log('resultArray ====>>>>>>', resultArray)

     reseachProjectGrantList.map(project => {
        console.log('project in service====>>>>', project.faculty_type);
        const facultyTypeAuthors = project.faculty_type;
        console.log('facultyTypeAuthors ===>>>>', facultyTypeAuthors);
        const matchedAuthor = resultArray.find(item => item.authorName === facultyTypeAuthors);
        project.faculty_type = matchedAuthor ? matchedAuthor : { authorName:facultyTypeAuthors, table : "internalEmpList"}
        console.log('matchedAuthor ====>>>>', matchedAuthor)
        
    });
    console.log('reseachProjectGrantList ===>>>', reseachProjectGrantList)
    console.log('researchConsultancyData in  ankit services ===>>>>>',researchConsultancyData)
    const rowCount = researchConsultancyData.researchConsultancyList.rowCount;
    console.log('rowCount ===>>>', rowCount)

    return {
        reseachProjectGrantList : reseachProjectGrantList,
        internalEmpList : internalEmpList,
        externalEmpList : externalEmpList,
        rowCount : rowCount
    }
}

module.exports.insertResearchConsultancyData = async(body , files) => {
    const researchCunsultancyData = body
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
    console.log("Internal Names updated:", internalNamesString);
    console.log("External Names updated:", externalNamesString);
    const consultancyDataFiles = files?.map(file => file.filename).join(',');
    // for (let i = 0; i <= files.length - 1; i++){
    //       if(files[i].filename){
    //         consultancyDataFiles += files[i].filename + ',';
    //       }
    // }
    console.log('consultancyDataFiles ===>>>>', consultancyDataFiles)
    const researchProjectConsultancy = await researchCunsultancyModel.insertResearhcProjectConstancyData(researchCunsultancyData , consultancyDataFiles, internalNamesString, externalNamesString, authorNameString);
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
  const authorNameArray = JSON.parse(body.authorName);
  console.log('authorNameArray ===>>>', authorNameArray)

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
  console.log("Internal Names updated:", internalNamesString);
  console.log("External Names updated:", externalNamesString);
  const updatedConsultantFilesData = files ?.map(file => file.filename).join(',')
  const updateResearchProjectConstant = await researchCunsultancyModel.updateResearchConsultantData(consultantId ,updatedResearchGrant, updatedConsultantFilesData, internalNamesString, externalNamesString);
  console.log('updateResearchProjectConstant =====>>>>>', updateResearchProjectConstant);
  return updateResearchProjectConstant.status === "Done" ? 
   {
    status : updateResearchProjectConstant.status,
    message : updateResearchProjectConstant.message,
    updateResearchProjectConstant,
    updatedConsultantFilesData,
    authorNameString : authorNameString,
    externalTableName : externalNamesString ? 'externalEmpList' : null,
    intenalTableName : internalNamesString ? 'internalEmpList' : null
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