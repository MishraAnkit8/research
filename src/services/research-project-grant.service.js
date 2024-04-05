const researchCunsultancyModel = require('../models/research-project-grant.models');

module.exports.fetchResearConsultacyData = async() => {
    const researchConsultancyData = await researchCunsultancyModel.fetchResearchConsultancy();
    console.log('researchConsultancyData in services ===>>>>>',researchConsultancyData.researchData);
    console.log('facultTableData in services :::::===>>>>>',researchConsultancyData.facultTableData);
    console.log('research_project_grant_faculty Data In Service ::: ==>>>>', researchConsultancyData.researchPojectGrantFacultyData)
    console.log('facultTableData in services :::::===>>>>>',researchConsultancyData.extrnalFacultyData);
    console.log('researchGrantExternalIds ===>>>>', researchConsultancyData.researchGrantExternalIds);
    console.log('researchInternalIds ===>>>>>>', researchConsultancyData.researchInternalIds)

    // console.log('reseachGrantIdsContainer ::: >>>>>', researchConsultancyData.reseachGrantIdsContainer)
   const reseachGrantIdsContainer = researchConsultancyData.reseachGrantIdsContainer;
   const idContainerArray = {};



    for (const item of reseachGrantIdsContainer) {
      if (!idContainerArray[item.research_project_grant_id]) {
        idContainerArray[item.research_project_grant_id] = {
          research_project_grant_id: item.research_project_grant_id,
          faculty_id: [],
          id: []
        };
      }
      
      idContainerArray[item.research_project_grant_id].faculty_id.push(item.faculty_id);
      idContainerArray[item.research_project_grant_id].id.push(item.id);
    }

    const reseachProjectIds = Object.values(idContainerArray);
    console.log('idContainerArray ===>>>>', idContainerArray);
    console.log('reseachProjectIds ====>>>>', reseachProjectIds);

    return researchConsultancyData.status === "Done" ? {
        status : researchConsultancyData.status,
        researchData : researchConsultancyData.researchData,
        InternalFaculty : researchConsultancyData.facultTableData,
        researchPojectGrantFacultyData : researchConsultancyData.researchPojectGrantFacultyData,
        reseachProjectIds : reseachProjectIds,
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
    //for storing internalFacultyId in Array and exeternalFacultyRecord  in array
    const internalFacultyIdArray = [];
    const exeternalFacultyRecord = [];
    facultyDataContainer ? facultyDataContainer.forEach((item) => {
        item.internalFaculty ?  internalFacultyIdArray.push(...item.internalFaculty) : null;
        item.externalEmpList ? exeternalFacultyRecord.push(...item.externalEmpList) : null;
    }) : null;

    const filteredData = exeternalFacultyRecord ?  exeternalFacultyRecord.filter(obj => {
        return Object.keys(obj).length !== 0 && obj.constructor === Object && Object.values(obj).some(val => val !== '');
      }) : null;
  
      console.log('filteredData ===>>>>>>', filteredData);
      const facultyNamearray = [];
      const facultyDsgArray = [];
      const facultyAddrArray = [];
      
      filteredData ? filteredData.forEach(({ facultyName, facultyDsg, facultyAddr }) => {
        facultyName && facultyName != 'undefined' ? facultyNamearray.push(facultyName) : null;
        facultyDsg  && facultyDsg != 'undefined'? facultyDsgArray.push(facultyDsg) : null;
        facultyAddr && facultyAddr != 'undefined' ? facultyAddrArray.push(facultyAddr) : null;
      })  : null;
      
      const externalFacultyData = facultyNamearray.length === facultyDsgArray.length && facultyDsgArray.length === facultyAddrArray.length
      ? facultyNamearray.map((_, i) => [
          { "facultyName": facultyNamearray[i], "facultyDsg": facultyDsgArray[i], "facultyAddr": facultyAddrArray[i]  },
        ])
      : [];
    
      console.log('facultyNamearray ===>>>>', facultyNamearray);
      console.log('facultyDsgArray ===>>>>', facultyDsgArray);
      console.log('facultyAddrArray ===>>>>', facultyAddrArray);
      console.log('externalFacultyData ===>>>>', externalFacultyData);

      console.log('internalFacultyIdArray ===>>>>', internalFacultyIdArray);
      console.log('exeternalFacultyRecord ===>>>', exeternalFacultyRecord);
      const consultancyDataFiles = files?.map(file => file.filename).join(',');
      console.log('consultancyDataFiles ===>>>>', consultancyDataFiles)

      const researchProjectConsultancy = await researchCunsultancyModel.insertResearhcProjectConstancyData(researchCunsultancyData , consultancyDataFiles, internalFacultyIdArray, externalFacultyData);

      console.log('researchProjectConsultancy ===>>>' , researchProjectConsultancy);
      return researchProjectConsultancy.status === "Done" ? {
          status : "Done",
          externalEmpIds : researchProjectConsultancy.externalEmpIds,
          consultantId : researchProjectConsultancy.consultantId,
          rowCount : researchProjectConsultancy.rowCount,
          researchProjectGrantFacultyIds : researchProjectConsultancy.researchProjectGrantFacultyIds,
          message : researchProjectConsultancy.message,
          consultancyDataFiles : consultancyDataFiles
      } :
      {   status : researchProjectConsultancy.status,
          message : researchProjectConsultancy.message,
          errorCode : researchProjectConsultancy.errorCode
      }
}


module.exports.updateResearchConstant = async(consultantId, body, files) => {
  console.log('data in service ====>>>>>>>', body);
  const updatedResearchGrant = body;
  // console.log('data in service =====>>>>', updatedResearchGrant.internalEmpId)
  const updatedFacultyDataContainer = JSON.parse(body.updatedFacultyDataContainer);
  console.log('updatedFacultyDataContainer ====>>>', updatedFacultyDataContainer);

  //for storing internalFacultyId in Array and exeternalFacultyRecord  in array
  const internalFacultyIdArray = [];
  const exeternalFacultyRecord = [];
  updatedFacultyDataContainer ? updatedFacultyDataContainer.forEach((item) => {
    console.log('item.internalFaculty ===>>>>>>', item)
      item != null  && item.internalFaculty ?  internalFacultyIdArray.push(...item.internalFaculty) : null;
      item != null  && item.externalEmpList ? exeternalFacultyRecord.push(...item.externalEmpList) : null;
  }) : null;

  const filteredData = exeternalFacultyRecord ? exeternalFacultyRecord.filter(obj => {
      return Object.keys(obj).length !== 0 && obj.constructor === Object && Object.values(obj).some(val => val !== '');
    }) : null;

    console.log('filteredData ===>>>>>>', filteredData);
    const facultyNamearray = [];
    const facultyDsgArray = [];
    const facultyAddrArray = [];
    
    filteredData ? filteredData.forEach(({ facultyName, facultyDsg, facultyAddr }) => {
      facultyName && facultyName != 'undefined' ? facultyNamearray.push(facultyName) : null;
      facultyDsg  && facultyDsg != 'undefined'? facultyDsgArray.push(facultyDsg) : null;
      facultyAddr && facultyAddr != 'undefined' ? facultyAddrArray.push(facultyAddr) : null;
    }) : null;
    
    const externalFacultyData = facultyNamearray.length === facultyDsgArray.length && facultyDsgArray.length === facultyAddrArray.length
    ? facultyNamearray.map((_, i) => [
        { "facultyName": facultyNamearray[i], "facultyDsg": facultyDsgArray[i], "facultyAddr": facultyAddrArray[i]  },
      ])
    : [];
  
    console.log('facultyNamearray ===>>>>', facultyNamearray);
    console.log('facultyDsgArray ===>>>>', facultyDsgArray);
    console.log('facultyAddrArray ===>>>>', facultyAddrArray);
    console.log('externalFacultyData ===>>>>', externalFacultyData);

    console.log('internalFacultyIdArray ===>>>>', internalFacultyIdArray);
    console.log('exeternalFacultyRecord ===>>>', exeternalFacultyRecord);

    const updatedConsultantFilesData = files ?.map(file => file.filename).join(',')
    const updateResearchProjectConstant = await researchCunsultancyModel.updateResearchConsultantData(consultantId ,updatedResearchGrant, updatedConsultantFilesData, internalFacultyIdArray, externalFacultyData);
    console.log('updateResearchProjectConstant =====>>>>>', updateResearchProjectConstant);
    return updateResearchProjectConstant.status === "Done" ? 
    {
      status : updateResearchProjectConstant.status,
      message : updateResearchProjectConstant.message,
      updateResearchProjectConstant,
      updatedConsultantFilesData,
      facultyTableId : updateResearchProjectConstant.facultyTableId,
      externalEmpIds : updateResearchProjectConstant.facultyTableId,
      researchProjectGrantFacultyIds : updateResearchProjectConstant.researchProjectGrantFacultyIds
    }:{
      status: updateResearchProjectConstant.status,
      message: updateResearchProjectConstant.message,
      errorCode  : updateResearchProjectConstant.errorCode
    };
  
}

module.exports.deleteResearchConsultant = async({consultantId}) => {
    console.log('Id in serevice for delete ', consultantId);

    const deleteRseachConsultancy = await researchCunsultancyModel.deleteResearchConsultantData(consultantId);

    console.log('deleteRseachConsultancy ====>>>>', deleteRseachConsultancy);
    return deleteRseachConsultancy.status === "Done" ? {
            status :  deleteRseachConsultancy.status,
            message : deleteRseachConsultancy.message,
            rowCount : deleteRseachConsultancy.rowCount,
            grantFacultyRowCount : deleteRseachConsultancy.grantFacultyRowCount
    } : {
      status :  deleteRseachConsultancy.status,
      message : deleteRseachConsultancy.message,
      errorCode : deleteRseachConsultancy.errorCode
    }


}

module.exports.viewReseachProjectData = async(consultantId) => {
    console.log('consultantId in servicve ===>>>', consultantId)
    const researchConsultancy = await researchCunsultancyModel.viewResearchConsultancy(consultantId);

    console.log('researchConsultancy ==>>', researchConsultancy);

    const facultyInfoArray = researchConsultancy && researchConsultancy.researchData ? 
    researchConsultancy.researchData.map(row => ({
      facultyName: row.faculty_name,
      designation: row.designation,
      address: row.address,
      employeeId : row.employee_id
    })) : null;

    console.log('facultyInfoArray ===>>>>', facultyInfoArray);
  
    return researchConsultancy.status === 'Done' ? {
      status : researchConsultancy.status,
      message : researchConsultancy.message,
      researchData : researchConsultancy.researchData[0],
      rowCount : researchConsultancy.rowCount,
      facultyInfoArray : facultyInfoArray
    } : {
      status : researchConsultancy.status,
      message : researchConsultancy.message,
      errorCode : researchConsultancy.errorCode
    }
}