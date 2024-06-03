const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

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
       r.created_by = $1 and r.active=true and rf.active=true and f.active=true and ft.active=true and f.faculty_type_id=1 
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
  console.log(
    "researchCunsultancyData inside models ===>>>",
    researchCunsultancyData
  );

  const {
    nmimsSchool,
    nmimsCampus,
    grantProposalCategory,
    typeOfGrant,
    titleOfProject,
    thurstAreaOfResearch,
    fundingAgency,
    fundingAmount,
    statusOfResearchProject,
    submissionGrantDate,
    scheme,
    durationDate,
    amountReceived,
    annualPaymentDate,
  } = researchCunsultancyData;

  let researchSql = {
    text: `INSERT INTO research_project_grant (nmims_school, nmims_campus, grant_proposal_category, type_of_research_grant, title_of_project, thrust_area_of_research, name_of_funding_agency, funding_amount, status_of_research_project, submission_date, scheme, projectDuration, amountRecieved, paymentDate, supporting_documents, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id`,
    values: [
      nmimsSchool,
      nmimsCampus,
      grantProposalCategory,
      typeOfGrant,
      titleOfProject,
      thurstAreaOfResearch,
      fundingAgency,
      fundingAmount,
      statusOfResearchProject,
      submissionGrantDate,
      scheme,
      durationDate,
      amountReceived,
      annualPaymentDate,
      consultancyDataFiles,
      userName,
   
    ],
  };

    
  const consultantId = await researchDbW.query(researchSql)
    .then(result => {
      return result.rows[0].id;
    })
    const rowCount = await researchDbW.query(researchSql)
    .then(result => {
      return result.rowCount;
    })
    .catch(error => {
      console.error('Error executing query:', error);
    });

  console.log('consultantId ===>>>>>>>', consultantId);

  // insert external faculty details
  const insertexternalDetails = externalFacultyData ? externalFacultyData.map( async(detailsData) => {
    console.log('detailsData ======>>>>>>>>>', detailsData);
    const [facultyName, facultyEmpId, facultyDsg, facultyAddr ] = detailsData
  
    let sql = {
        text: `INSERT INTO faculties (faculty_type_id, faculty_name, employee_id, designation, address, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        values: [2, facultyName,facultyEmpId, facultyDsg, facultyAddr, userName]
    };
  
    console.log('sql external faculty data', sql);
    const externalResult = await researchDbW.query(sql);
    return externalResult.rows[0].id
  
  }) : null;
  
  const externalIds = await Promise.all(insertexternalDetails);
  console.log('externalIds =======>>>>>>>>', externalIds);

  facultyIdsContainer.push(...externalIds);
  console.log('facultyIdsContainer ===>>>>', facultyIdsContainer);

  const insertFacultyPromises = facultyIdsContainer ? facultyIdsContainer.map(async(faculty_id) => {
    const sql = {
        text: `INSERT INTO research_project_grant_faculty (research_project_grant_id, faculty_id, created_by) VALUES ($1, $2, $3) RETURNING id`,
        values: [consultantId, faculty_id, userName],
        };
    console.log("sql ===>>>>>", sql);
    const iprFaculty = await researchDbW.query(sql);
    return iprFaculty.rows[0].id  
}) : null;

  const consultantFacultyIds = await Promise.all(insertFacultyPromises);
  console.log('consultantFacultyIds ====>>>>>>>', consultantFacultyIds);


  const promises = [consultantId, consultantFacultyIds];
  console.log('promises ===>>>>>>', promises);

  return Promise.all(promises).then(([consultantId, consultantFacultyIds]) => {
    return {
      status : "Done",
      message : "Record inserted successfully",
      consultantId, consultantFacultyIds, externalIds,
      rowCount : rowCount
    }
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

module.exports.updateResearchConsultantData = async (consultantId, updatedResearchGrant, facultyIdsContainer, externalFacultyDataInsert, updateExternalDetailsArray,
  updatedConsultantFilesData, userName) => {
  console.log("data in models ===>>>>", updatedResearchGrant);
  const supportingDocuments = updatedConsultantFilesData
    ? updatedConsultantFilesData
    : null;
  console.log("supportingDocuments ====>>>>", supportingDocuments);

  const {
    grantProposalCategory,
    typeOfGrant,
    titleOfProject,
    thurstAreaOfResearch,
    fundingAgency,
    fundingAmount,
    statusOfResearchProject,
    submissionGrantDate,
    scheme,
    durationDate,
    amountReceived,
    annualPaymentDate,
    nmimsSchool,
    nmimsCampus,
  } = updatedResearchGrant;

  let baseQuery = `UPDATE research_project_grant SET  grant_proposal_category = $2, type_of_research_grant = $3, title_of_project = $4, thrust_area_of_research = $5, name_of_funding_agency = $6, funding_amount = $7, status_of_research_project = $8, submission_date = $9,
  scheme=$10, projectDuration=$11, amountRecieved=$12, paymentDate=$13, nmims_school = $14, nmims_campus = $15, updated_by = $16`;
  let documentsQuery = supportingDocuments
    ? `, supporting_documents = $17`
    : "";
  console.log("documentsQuery ====>>>>", documentsQuery);
  let queryText = baseQuery + documentsQuery + ` WHERE id = $1`;
  console.log("queryText ===>>>>", queryText);

  let values = [
    consultantId,
    grantProposalCategory,
    typeOfGrant,
    titleOfProject,
    thurstAreaOfResearch,
    fundingAgency,
    fundingAmount,
    statusOfResearchProject,
    submissionGrantDate,
    scheme,
    durationDate,
    amountReceived,
    annualPaymentDate,
    nmimsSchool,
    nmimsCampus,
    userName,
    ...(supportingDocuments ? [supportingDocuments] : []),
  ];

  console.log("values ===>>>>", values);

  let sql = {
    text: queryText,
    values: values,
  };
  console.log("sql ====>>>>>>>", sql);
  const consultancyRowCount = await researchDbW.query(sql)
  .then(result => result.rowCount)
  .catch(error => {
    console.error('Error executing query:', error);
  });

  console.log('consultancyRowCount =====>>>>>>>', consultancyRowCount);


   // insert exeternal  faculty data if there any new
  const insertexternalDetails = externalFacultyDataInsert ? externalFacultyDataInsert.map(async(detailsData) => {
    console.log('External Faculty Data:', detailsData);
    const [facultyName, facultyEmpId, facultyDsg, facultyAddr] = detailsData;

    let sql = {
      text: `INSERT INTO faculties (faculty_type_id, faculty_name, employee_id, designation, address, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      values: [2, facultyName, facultyEmpId, facultyDsg, facultyAddr, userName],
    };

    console.log('SQL for external faculty data:', sql);
    const externalResult = await researchDbW.query(sql);
    return externalResult.rows[0].id;
  }) : null;

  const externalIds = await Promise.all(insertexternalDetails);
  console.log('External IDs:', externalIds);

  facultyIdsContainer.push(...externalIds);
  console.log('Faculty IDs Container:', facultyIdsContainer);

   // insert research_project_grant_faculty faculty data if there any new
   const insertFacultyPromises = facultyIdsContainer.map(async (faculty_id) => {
    const sql = {
      text: `INSERT INTO research_project_grant_faculty (research_project_grant_id, faculty_id, created_by) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (research_project_grant_id, faculty_id) DO NOTHING 
             RETURNING id`,
      values: [consultantId, faculty_id, userName],
    };
    console.log("SQL for IPR Faculty:", sql);
    
    const researchConsultancyFacultyIds = await researchDbW.query(sql);
    return researchConsultancyFacultyIds.rows[0] ? researchConsultancyFacultyIds.rows[0].id : null;
  });
  
  

  
  const consultantFacultyId = await Promise.all(insertFacultyPromises);
  console.log('consultantFacultyId Faculty IDs:', consultantFacultyId);


  // update external faculty data
  const updateExternalFaculty = updateExternalDetailsArray ? updateExternalDetailsArray.map(async(detailsData) => {
    console.log('Details Data for Updating External Faculty:', detailsData);
    const [facultyName, facultyEmpId, facultyDsg, facultyAddr, id] = detailsData;

    let sql = {
      text: `UPDATE faculties SET faculty_type_id = $1, faculty_name = $2, employee_id = $3, designation = $4, 
            address = $5, created_by = $6 WHERE id = $7 
             RETURNING id`,
      values: [2, facultyName, facultyEmpId, facultyDsg, facultyAddr, userName, id],
    };

    console.log('SQL for updating external faculty data:', sql);
    const externalResult = await researchDbW.query(sql);
    return externalResult.rowCount;
  }) : null;


  const updatedFacultyRowCount = await Promise.all(updateExternalFaculty);
  console.log('Updated Faculty Row:', updatedFacultyRowCount);

  const promises = [consultancyRowCount, consultantFacultyId, externalIds, updatedFacultyRowCount];
  console.log('Promises:', promises);

  return Promise.all(promises).then(([consultancyRowCount, consultantFacultyId, externalIds, updatedFacultyRowCount]) => {
    return {
      status: "Done",
      message : 'Record updated successfully',
      consultantFacultyId, externalIds,
      consultancyRowCount: consultancyRowCount,
      updatedFacultyRowCount : updatedFacultyRowCount
    };
  }).catch((error) => {
    console.error("Error:", error.message);
    return {
      status: "Failed",
      message: error.message,
      errorCode: error.code,
    };
  });
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
            f.address,
            f.employee_id
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
        f.employee_id,
        f.designation,
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