const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

const insertDbModels = require('./insert-update-records.models');

module.exports.fetchResearchConsultancy = async (userName) => {

  let reseachSql = {
    text: `SELECT DISTINCT
        r.id AS project_id,
        r.title_of_project,
        r.grant_proposal_category,
        r.type_of_research_grant,
        r.thrust_area_of_research,
        r.name_of_funding_agency,
        r.funding_amount,
        r.status_of_research_project,
        r.submission_date,
        r.created_by AS created_by,
        r.updated_by AS updated_by,
        r.supporting_documents,
        r.projectDuration,
        r.scheme,
        r.amountRecieved,
        r.paymentDate,
        r.nmims_campus,
        r.nmims_school,
        string_agg(DISTINCT f.id::text, ', ') AS faculty_id
    FROM 
        research_project_grant AS r
    INNER JOIN 
        research_project_grant_faculty AS rf ON r.id = rf.research_project_grant_id
    LEFT JOIN 
        faculties AS f ON rf.faculty_id = f.id
    LEFT JOIN 
        faculty_types AS ft ON f.faculty_type_id = ft.id          
    WHERE
       r.created_by = $1 and r.active=true and rf.active=true and f.active=true and ft.active=true 
    GROUP BY
        r.id ,
        r.title_of_project,
        r.grant_proposal_category,
        r.type_of_research_grant,
        r.thrust_area_of_research,
        r.name_of_funding_agency,
        r.funding_amount,
        r.status_of_research_project,
        r.submission_date,
        r.created_by ,
        r.updated_by ,
        r.supporting_documents,
        r.projectDuration,
        r.scheme,
        r.nmims_campus,
        r.nmims_school,
        r.amountRecieved,
        r.paymentDate  
    ORDER BY  r.id desc
`,
    values: [userName],
  };

  let internalEmpSql = {
    text: `select *  FROM faculties WHERE faculty_type_id = 1 and active=true`,
  };

  const researchGrantData = await researchDbR.query(reseachSql);
  const internalEmpPromise = await researchDbR.query(internalEmpSql);


 const promises = [researchGrantData, internalEmpPromise]
  return Promise.all(promises)
    .then(([researchGrantData, internalEmpPromise]) => {
      return {
        status: "Done",
        message: "Record Fetched Successfully",
        rowCount: researchGrantData.rowCount,
        researchData: researchGrantData.rows,
        internalEmpList : internalEmpPromise.rows
       
      };
    })
    .catch((error) => {
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
};

module.exports.fetchInternal = async () => {
  let internalFacultySql = {
    text: `SELECT rpgf.id AS research_project_grant_faculty_id, 
    rpgf.research_project_grant_id, 
    rpgf.faculty_id 
    FROM research_project_grant_faculty rpgf
    JOIN faculties f ON rpgf.faculty_id = f.id
    JOIN faculty_types ft ON f.faculty_type_id = ft.id
    WHERE ft.name = 'Internal' and rpgf.active=true and f.active=true and ft.active=true 
    ORDER BY rpgf.id`,
  };

  const internalFaculty = await researchDbR.query(internalFacultySql);

  const promises = [internalFaculty];
  return Promise.all(promises)
    .then(([researchData]) => {
      return {
        status: "Done",
        message: "Record Fetched Successfully",
        rowCount: researchData.rowCount,
        internalFaculty: internalFaculty.rows,
      };
    })
    .catch((error) => {
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
};

module.exports.insertResearhcProjectConstancyData = async (researchCunsultancyData, consultancyDataFiles, facultyIdsContainer, externalFacultyData,  userName) => {
  console.log("researchCunsultancyData inside models ===>>>", researchCunsultancyData);

  const {
    nmimsSchool, nmimsCampus, grantProposalCategory, typeOfGrant, titleOfProject, thurstAreaOfResearch, fundingAgency,
    fundingAmount, statusOfResearchProject, submissionGrantDate, scheme, durationDate, amountReceived, annualPaymentDate
  } = researchCunsultancyData;

  const researchValues = [nmimsSchool, nmimsCampus, grantProposalCategory, typeOfGrant, titleOfProject, thurstAreaOfResearch, fundingAgency,
    fundingAmount, statusOfResearchProject, submissionGrantDate, scheme, durationDate, amountReceived, annualPaymentDate, consultancyDataFiles, userName];

  const researchFields = ['nmims_school', 'nmims_campus', 'grant_proposal_category', 'type_of_research_grant', 'title_of_project', 'thrust_area_of_research', 'name_of_funding_agency',
     'funding_amount', 'status_of_research_project', 'submission_date', 'scheme', 'projectDuration', 'amountRecieved', 'paymentDate', 'supporting_documents', 'created_by'
  ]

  const insertResearchProject = await insertDbModels.insertRecordIntoMainDb('research_project_grant', researchFields, researchValues, userName);
  console.log('insertResearchProject ====>>>>>>', insertResearchProject);
  const grantId = insertResearchProject.insertedId;
  console.log('grantId ===>>>>>', grantId)

  // insert into external faculty
  const facultyfield = ['faculty_type_id', 'faculty_name', 'designation', 'institution_name', 'address', 'created_by'];
  const insertIntoFacultyTable = await insertDbModels.insertExternalFacultyRecord('faculties', facultyfield, externalFacultyData, userName);

  console.log('insertIntoFacultyTable =====>>>>>', insertIntoFacultyTable);
  const externalId = insertIntoFacultyTable.externalId;
  console.log('externalId ===>>>>>', externalId);

  // push external faculty ids into facultyIdsContainer
  facultyIdsContainer.push(...externalId);
  console.log('facultyIdsContainer in patent models ===>>>>>>', facultyIdsContainer);

  //insert into patent faculties table 
  const reseacrhFacultyField = ['research_project_grant_id', 'faculty_id', 'created_by'];

  const insertReseacrhFaculty = await insertDbModels.insertIntoRelationalDb('research_project_grant_faculty', reseacrhFacultyField, grantId, facultyIdsContainer, userName);
  console.log('insertReseacrhFaculty ===>>>>>>', insertReseacrhFaculty);

   // Check if all insertions are successful
   if (
    insertResearchProject.status === 'Done' &&
    insertIntoFacultyTable.status === 'Done' &&
    insertReseacrhFaculty.status === 'Done'
  ) {
    return {
      status: 'Done',
      message: 'All records inserted successfully'
    };
  } else {
    return {
      status: 'Failed',
      message: 'Failed to insert'
    };
  }

};

module.exports.updateResearchConsultantData = async (consultantId, updatedResearchGrant, facultyIdsContainer, externalFacultyDataInsert, updateExternalDetailsArray,
  updatedConsultantFilesData, userName) => {
  console.log("data in models ===>>>>", updatedResearchGrant);

  console.log("updatedConsultantFilesData ====>>>>", updatedConsultantFilesData);

  const {nmimsSchool, nmimsCampus, grantProposalCategory, typeOfGrant, titleOfProject, thurstAreaOfResearch, fundingAgency,
    fundingAmount, statusOfResearchProject, submissionGrantDate, scheme, durationDate, amountReceived, annualPaymentDate
  } = updatedResearchGrant;

  let updateResearchData;

  try {

    if (updatedConsultantFilesData) {
      const researchValues = [nmimsSchool, nmimsCampus, grantProposalCategory, typeOfGrant, titleOfProject, thurstAreaOfResearch, fundingAgency,
        fundingAmount, statusOfResearchProject, submissionGrantDate, scheme, durationDate, amountReceived, annualPaymentDate, updatedConsultantFilesData, userName, consultantId];
    
      const researchFields = ['nmims_school', 'nmims_campus', 'grant_proposal_category', 'type_of_research_grant', 'title_of_project', 'thrust_area_of_research', 'name_of_funding_agency',
         'funding_amount', 'status_of_research_project', 'submission_date', 'scheme', 'projectDuration', 'amountRecieved', 'paymentDate', 'supporting_documents', 'created_by'
      ];
      updateResearchData = await insertDbModels.updateFieldWithFiles('research_project_grant', researchFields, researchValues, userName);
      
    } else {
      const researchValues = [nmimsSchool, nmimsCampus, grantProposalCategory, typeOfGrant, titleOfProject, thurstAreaOfResearch, fundingAgency,
        fundingAmount, statusOfResearchProject, submissionGrantDate, scheme, durationDate, amountReceived, annualPaymentDate, userName, consultantId];
    
      const researchFields = ['nmims_school', 'nmims_campus', 'grant_proposal_category', 'type_of_research_grant', 'title_of_project', 'thrust_area_of_research', 'name_of_funding_agency',
         'funding_amount', 'status_of_research_project', 'submission_date', 'scheme', 'projectDuration', 'amountRecieved', 'paymentDate', 'created_by'
      ];

      updateResearchData = await insertDbModels.updateFieldWithOutFiles('research_project_grant', researchFields, researchValues, userName);
      
    }

    console.log('updateResearchData ===>>>>', updateResearchData);

    // Insert into external faculty
    const facultyField = ['faculty_type_id', 'faculty_name', 'designation', 'institution_name', 'address', 'created_by'];
    const insertIntoFacultyTable = await insertDbModels.insertExternalFacultyRecord('faculties', facultyField, externalFacultyDataInsert, userName);
    const externalIds = insertIntoFacultyTable.externalId;
    console.log('insertIntoFacultyTable ===>>>>>', insertIntoFacultyTable);

    // Append into faculty container
    facultyIdsContainer.push(...externalIds);

    // Update external faculty details
    const updateFacultyField = ['faculty_name', 'designation', 'institution_name', 'address'];
    const updateExternalFacultyData = await insertDbModels.updateExternalFacultyDetails('faculties', updateFacultyField, updateExternalDetailsArray, userName);
    console.log('updateExternalFacultyData ====>>>>>>', updateExternalFacultyData);

    // Update patent faculty tables
    console.log('facultyIdsContainer in patent models ===>>>>>>', facultyIdsContainer);

    // Insert into patent faculties table
    const researchFacultyField = ['research_project_grant_id', 'faculty_id', 'created_by'];
    const updateResearchFaculty = await insertDbModels.insertOrUpdateRelationalDb('research_project_grant_faculty', researchFacultyField, consultantId, facultyIdsContainer, userName);
    console.log('updateResearchFaculty ===>>>>>>', updateResearchFaculty);



    // Check if all updates are done
    if (
      updateResearchData.status === "Done" &&
      updateExternalFacultyData.status === "Done" &&
      updateResearchFaculty.status === "Done" &&
      insertIntoFacultyTable.status === "Done"
    ) {
      return {
        status: 'Done',
        message: 'All Records updated',
      };
    } else {
      throw new Error('Some updates failed');
    }
  } catch (error) {
    console.error('Error updating research project grant data:', error);

    return {
      status: 'error',
      message: 'Failed to update records',
      error: error.message,
    };
  }
};

module.exports.deleteResearchConsultantData = async (consultantId) => {
  console.log("id in model ==>>", consultantId);

  const deleteFacultyAssignments = researchDbW.query({
    // text: 'DELETE FROM research_project_grant_faculty WHERE research_project_grant_id = $1',
    text: "update research_project_grant_faculty set active=false WHERE research_project_grant_id = $1",
    values: [consultantId],
  });

  const deleteResearchGrant = deleteFacultyAssignments
    .then(() =>
      researchDbW.query({
        // text: 'DELETE FROM research_project_grant WHERE id = $1',
        text: "update research_project_grant set active=false WHERE id = $1",
        values: [consultantId],
      })
    )
    .catch((error) => {
      throw error;
    });

  return Promise.all([deleteFacultyAssignments, deleteResearchGrant])
    .then(([deleteResearchGrantFaculty, deleteResearchGrant]) => {
      return {
        status: "Done",
        message: "Record Deleted Successfully",
        rowCount: deleteResearchGrant.rowCount,
        grantFacultyRowCount: deleteResearchGrantFaculty.rowCount,
      };
    })
    .catch((error) => {
      console.error("Error:", error.message);
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
};

module.exports.viewResearchConsultancy = async (consultantId, userName) => {
  console.log("consultantId in models ==>>", consultantId);
  let sql = {
    text: `SELECT
            rg.*,
            f.faculty_name,
            f.designation,
            f.institution_name,
            f.address
        FROM
            research_project_grant rg
        LEFT JOIN
            research_project_grant_faculty rgf ON rg.id = rgf.research_project_grant_id
        LEFT JOIN
            faculties f ON rgf.faculty_id = f.id 
        WHERE
            rg.id = $1 AND rg.created_by = $2 and rg.active=true and rgf.active=true and f.active=true
        `,
    values: [consultantId, userName],
  };
  console.log("sql ==>>", sql);
  const researchProjectData = await researchDbR.query(sql);
  return Promise.all([researchProjectData])
    .then(([researchProjectData]) => {
      return {
        status: "Done",
        message: "Record Fecthed Successfully",
        researchData: researchProjectData.rows,
        rowCount: researchProjectData.rowCount,
      };
    })
    .catch((error) => {
      console.error("Error:", error.message);
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
};



module.exports.retriveExternalDetails = async(consultantId, userName) => {
  console.log('consultantId and userName in models ====>>>>>>', consultantId, userName);
  
  let facultiesSql = {
    text: `
    SELECT
        f.faculty_name,
        f.designation,
        f.institution_name,
        f.address,
        f.id
    FROM
        faculties f
    LEFT JOIN
    research_project_grant_faculty ipgf ON f.id = ipgf.faculty_id
    LEFT JOIN
    research_project_grant  rpg ON ipgf.research_project_grant_id = rpg.id
    WHERE
        f.active = true AND
        f.faculty_type_id = 2 AND
        rpg.id = $1 AND f.created_by = $2
    `,
    values: [consultantId, userName]
};

console.log('facultiesSql ====>>>>>>', facultiesSql);

const externalData = await researchDbW.query(facultiesSql);

const facultyPromises = [externalData];
return Promise.all(facultyPromises).then(([externalData]) => {
  return {
    status : "Done",
    message : "Retrived External Details",
    exetrnalData : externalData.rows,
    rowCount : externalData.rowCount,

  }
})
.catch((error) => {
  return {
    status: "Failed",
    message: error.message,
    errorCode: error.code,
  };
});

}


module.exports.deletedExternalDetails = async(externalId, userName) => {
  console.log('externalId in models  =====>>>>>>>', externalId);

  let externalSql = {
    text : `UPDATE faculties SET active=false WHERE id = $1 AND created_by = $2`,
    values : [externalId, userName]
  }

  const deleteExternalDetails = await researchDbW.query(externalSql);

  const promises = [deleteExternalDetails];
  return Promise.all(promises).then(([deleteExternalDetails]) => {
    return {
      status : "Done",
      message : "Deleted successfully",
      rowCount : deleteExternalDetails.rowCount
    }
  })
  .catch((error) => {
    return {
      status: "Failed",
      message: error.message,
      errorCode: error.code,
    };
  });
}


module.exports.deleteInternalFaculty = async(internalId, consultantId, userName) => {
  console.log("internalId in models ====>>>>>>", internalId);

  const internalNmimsDetails = internalId.map(async(internalId) => {
    let sql = {
      text: `UPDATE  research_project_grant_faculty  SET active = false WHERE faculty_id = $1 And research_project_grant_id = $2`,
      values: [internalId, consultantId],
    };
    console.log("sql ===>>>>>>>>>", sql);
    return await researchDbW.query(sql)

  })
 
  return Promise.all(internalNmimsDetails).then((result) => {
    return {
      status : "Done",
      message : "Record Deleted successfully",
      result : result
    } 
  }).catch((error) => {
    return {
      status: "Failed",
      message: error.message,
      errorCode: error.code,
    };
  });

}