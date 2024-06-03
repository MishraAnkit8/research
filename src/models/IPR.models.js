const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

module.exports.fetchIPRData = async (userName) => {
  let iPRSql = {
    text: `
            SELECT
                ipr.id AS ipr_id,
                ipr.created_by AS created_by,
                ipr.updated_by AS updated_by,
                ipr.patent_title,
                ipr.patent_application_number,
                ipr.applicant_name,
                ipr.patent_filed_date,
                ipr.patent_grant_date,
                ipr.patent_published_date,
                ipr.patent_publication_number,
                ipr.patent_grant_number,
                ipr.nmims_campus,
                ipr.nmims_school,
                ipr.supporting_documents,
                ipr.institutional_affiliation,
                string_agg(DISTINCT it.name, ', ') AS invention_types,
                string_agg(DISTINCT it.id::text, ', ') AS invention_types_id,
                string_agg(DISTINCT ps.name, ', ') AS patent_stage_statuses,
                string_agg(DISTINCT ps.id::text, ', ') AS patent_stage_id,
                string_agg(DISTINCT sdg.id::text, ', ') AS sdg_id,
                string_agg(DISTINCT intr.id::text, ', ') AS faculty_id
            FROM
                IPR ipr
            LEFT JOIN
                ipr_invention_type iit ON ipr.id = iit.ipr_id
            LEFT JOIN
                invention_type it ON iit.invention_type_id = it.id
            LEFT JOIN
                ipr_status_type ist ON ipr.id = ist.ipr_id
            LEFT JOIN
                pantent_stage_status ps ON ist.pantent_stage_status_id = ps.id
            LEFT JOIN
              ipr_sdg_goals isdg ON ipr.id = isdg.ipr_id
            LEFT JOIN
                sdg_goals sdg ON isdg.sdg_goals_id = sdg.id
            LEFT JOIN
              ipr_faculty iprf ON ipr.id = iprf.ipr_id
            LEFT JOIN
                  faculties intr ON iprf.faculty_id = intr.id
            
            WHERE
                ipr.created_by = $1 and ipr.active=true and iit.active=true and it.active=true and 
                ist.active=true and isdg.active=true and sdg.active=true and ps.active=true and
                iprf.active=true and  intr.active=true and intr.faculty_type_id=1
            GROUP BY
                ipr.id,
                ipr.patent_title,
                ipr.patent_application_number,
                ipr.applicant_name,
                ipr.patent_filed_date,
                ipr.patent_published_date,
                ipr.patent_publication_number,
                ipr.patent_grant_number,
                ipr.nmims_campus,
                ipr.nmims_school,
                ipr.supporting_documents,
                ipr.institutional_affiliation
            ORDER BY
                ipr.id desc
        `,
    values: [userName],
  };

  let internalEmpSql = {
    text: `select *  FROM faculties WHERE faculty_type_id = 1 and active=true`,
  };

  let inventionTypeSql = {
    text: `select *  FROM invention_type where active=true ORDER BY id `,
  };

  let patentStageSql = {
    text: `select *  FROM pantent_stage_status where active=true ORDER BY id`,
  };

  let supportingoDcumentsSql = {
    text: `select *  FROM supporting_documents where active=true ORDER BY id`,
  };

  let nmimsSchoolSql = {
    text: `select *  FROM nmims_school where active=true ORDER BY id`,
  };

  let nmimsCampusSql = {
    text: `select *  FROM nmims_campus where active=true ORDER BY id`,
  };

  let iprFacultySql = {
    text: `select *  FROM ipr_faculty where active=true  ORDER BY id`,
  };

  let iprInventionTypeSql = {
    text: `select *  FROM ipr_invention_type where active=true ORDER BY id`,
  };

  let iprPatentStageSql = {
    text: `select *  FROM ipr_status_type where active=true ORDER BY id`,
  };

  let iprDocumnetsSql = {
    text: `select *  FROM ipr_supporting_documents where active=true ORDER BY id`,
  };

  let iprNmimsSchoolSql = {
    text: `select *  FROM ipr_nmims_school where active=true ORDER BY id`,
  };

  let iprNmimsCampusSql = {
    text: `select *  FROM ipr_nmims_campus where active=true ORDER BY id`,
  };

  let sdgGoalSql = {
    text: `select *  FROM sdg_goals where active=true  ORDER BY id`
};

  console.log("iPRSql ===>>>", iPRSql);
  console.log("internalEmpSql ===>>>", internalEmpSql);
  const iprPromise = await researchDbR.query(iPRSql);
  const internalEmpPromise = await researchDbR.query(internalEmpSql);
  const inventionTypePromises = await researchDbR.query(inventionTypeSql);
  const statusPromises = await researchDbR.query(patentStageSql);
  const nmimsSchool = await researchDbR.query(nmimsSchoolSql);
  const nmimsCampus = await researchDbR.query(nmimsCampusSql);
  const iprDocuments = await researchDbR.query(supportingoDcumentsSql);
  const iprCampus = await researchDbR.query(iprNmimsCampusSql);
  const iprSchool = await researchDbR.query(iprNmimsSchoolSql);
  const iprdocuments = await researchDbR.query(iprDocumnetsSql);
  const iprSatatus = await researchDbR.query(iprPatentStageSql);
  const iprInvetiontype = await researchDbR.query(iprInventionTypeSql);
  const iprFaculty = await researchDbR.query(iprFacultySql);
  const patentSdgGoalData = await researchDbR.query(sdgGoalSql);
  const promises = [
    iprPromise,
    internalEmpPromise,
    inventionTypePromises,
    statusPromises,
    nmimsSchool,
    nmimsCampus,
    iprDocuments,
    iprCampus,
    iprSchool,
    iprdocuments,
    iprSatatus,
    iprInvetiontype,
    iprFaculty,
    patentSdgGoalData
  ];

  return Promise.all(promises)
    .then(
      ([
        iprPromise,
        internalEmpPromise,
        inventionTypePromises,
        statusPromises,
        nmimsSchool,
        nmimsCampus,
        iprDocuments,
        iprCampus,
        iprSchool,
        iprdocuments,
        iprSatatus,
        iprInvetiontype,
        iprFaculty,
        patentSdgGoalData,
      ]) => {
        return {
          status: "Done",
          message: "Record Fetched Successfully",
          rowCount: iprPromise.rowCount,
          iprData: iprPromise.rows,
          internalEmpList: internalEmpPromise.rows,
          inventionTypData: inventionTypePromises.rows,
          patentStatus: statusPromises.rows,
          nmimsSchoolList: nmimsSchool.rows,
          nmimsCampusList: nmimsCampus.rows,
          supportingdocumnets: iprDocuments.rows,
          iprCampus: iprCampus.rows,
          iprSchool: iprSchool.rows,
          iprdocuments: iprdocuments.rows,
          iprSatatus: iprSatatus.rows,
          iprInvetiontype: iprInvetiontype.rows,
          iprFaculty: iprFaculty.rows,
          patentSdgGoalData : patentSdgGoalData.rows,
        };
      }
    )
    .catch((error) => {
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
};

module.exports.InsetIPRDataModels = async (
  IprData, iprFilesNamesArray, sdgGoalsIdArray, inventionIdsArray, patentStatus, facultyIdsContainer, externalFacultyData, userName
) => {
  console.log("iprFilesString in models ====>>>>", iprFilesNamesArray);
  console.log("patentStatus ===>>>>>", patentStatus);
  const {
    nmimsCampus,
    nmimsSchool,
    titleOfInvention,
    applicationNum,
    applicantName,
    patentFiledDate,
    patentPublishedDate,
    patentGrantDate,
    patentPublishedNumber,
    patentGrantedNo,
    instituteAffiliation,
  } = IprData;

  let iprSql = {
    text: `INSERT INTO IPR (nmims_campus, nmims_school, patent_title, patent_application_number, applicant_name, patent_filed_date, patent_published_date, patent_grant_date, patent_publication_number, patent_grant_number, institutional_affiliation, supporting_documents, created_by, active)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 , $10, $11, $12, $13, $14) RETURNING id`,
    values: [
      nmimsCampus,
      nmimsSchool,
      titleOfInvention,
      applicationNum,
      applicantName,
      patentFiledDate,
      patentPublishedDate,
      patentGrantDate,
      patentPublishedNumber,
      patentGrantedNo,
      instituteAffiliation,
      iprFilesNamesArray,
      userName,
      true
    ],
  };


  console.log("iprSql ====>>>>>>", iprSql);

  
  const iprId = await researchDbW.query(iprSql)
    .then(result => {
      return result.rows[0].id;
    })
    const rowCount = await researchDbW.query(iprSql)
    .then(result => {
      return result.rowCount;
    })
    .catch(error => {
      console.error('Error executing query:', error);
    });

  console.log('iprId ===>>>>>>>', iprId);

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
console.log('facultyIdsContainer ===>>>>', facultyIdsContainer)


const insertFacultyPromises = facultyIdsContainer ? facultyIdsContainer.map(async(faculty_id) => {
    const sql = {
        text: `INSERT INTO ipr_faculty (ipr_id, faculty_id, created_by) VALUES ($1, $2, $3) RETURNING id`,
        values: [iprId, faculty_id, userName],
        };
    console.log("sql ===>>>>>", sql);
    const iprFaculty = await researchDbW.query(sql);
    return iprFaculty.rows[0].id  
}) : null;



const insertDsgGoalsPromises = sdgGoalsIdArray.map(async(element) => {
    const SdgGoalsSql = {
        text: `INSERT INTO ipr_sdg_goals (ipr_id, sdg_goals_id) VALUES ($1, $2) RETURNING id`,
        values: [iprId, element],
      };
  
    console.log("SdgGoalsSql ===>>>>>", SdgGoalsSql);
    const sdgGoals = await researchDbW.query(SdgGoalsSql);
    return sdgGoals.rows[0].id ;
  });

 

  const insertInventionTypePromises = inventionIdsArray.map(async(element) => {
      const patentInventionsSql = {
        text: `INSERT INTO ipr_invention_type (ipr_id, invention_type_id) VALUES ($1, $2) RETURNING id`,
        values: [iprId, element],
      };

      console.log("patentInventionsSql ===>>>>>", patentInventionsSql);
      const patentInvention = await researchDbW.query(patentInventionsSql)
      return  patentInvention.rows[0].id ;
  });



  const insertPatentStatusPromises = patentStatus.map(async(element) => {
      const patentStatusSql = {
        text: `INSERT INTO ipr_status_type (ipr_id, pantent_stage_status_id) VALUES ($1, $2) RETURNING id`,
        values: [iprId, element],
      };
      console.log("patentStatusSql ===>>>>>", patentStatusSql);
      const patentsatge = await researchDbW.query(patentStatusSql)
      return patentsatge.rows[0].id ;
  });


  const iprFacultyIds = await Promise.all(insertFacultyPromises);
  console.log('iprFacultyIds ====>>>>>>>', iprFacultyIds);

  const iprSdgGoalsIds = await Promise.all(insertDsgGoalsPromises);
  console.log('iprSdgGoalsIds =====>>>>>', iprSdgGoalsIds);

  const iprInventionIds = await Promise.all(insertInventionTypePromises);
  console.log('iprInventionIds ====>>>>>>', iprInventionIds);

  const iprStatusIds = await Promise.all(insertPatentStatusPromises);

  console.log('iprStatusIds ====>>>>>', iprStatusIds);

  const promises = [iprId, iprFacultyIds, iprSdgGoalsIds, iprInventionIds, iprStatusIds, externalIds];
  console.log('promises ===>>>>>>', promises);

  return Promise.all(promises).then(([iprId, iprFacultyIds, iprSdgGoalsIds, iprInventionIds, iprStatusIds, externalIds]) => {
    return {
      status : "Done",
      message : "Record inserted successfully",
      iprId,iprFacultyIds, iprSdgGoalsIds, iprInventionIds, iprStatusIds, externalIds,
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

module.exports.deleteIPRData = async (iprId) => {
  console.log("iprId in models ===>>>>", iprId);

  // Delete records from child tables  patent_submission_invention_type
  const deleteIprInventiontypeSql = {
    // text: 'DELETE FROM ipr_invention_type WHERE ipr_id = $1',
    text: "update ipr_invention_type set active=false WHERE ipr_id = $1",
    values: [iprId],
  };
  console.log("deleteIprInventiontypeSql ==>>>>", deleteIprInventiontypeSql);

  // Delete records from child tables  ipr faculty
  const deleteIprFacultySql = {
    // text: 'DELETE FROM ipr_faculty WHERE ipr_id = $1',
    text: "update ipr_faculty set active=false WHERE ipr_id = $1",
    values: [iprId],
  };
  console.log("deleteIprFacultySql ==>>>>", deleteIprFacultySql);

  // Delete records from child tables  patent_submission_stage_status
  const deleteIprStatusSql = {
    // text: 'DELETE FROM ipr_status_type WHERE ipr_id = $1',
    text: "update ipr_status_type set active=false WHERE ipr_id = $1",
    values: [iprId],
  };
  console.log("deleteIprStatusSql ==>>>>", deleteIprStatusSql);

  // Delete records from child tables  iprSchool
  const deleteIprSchoolSql = {
    // text: 'DELETE FROM ipr_nmims_school WHERE ipr_id = $1',
    text: "update ipr_nmims_school set active=false WHERE ipr_id = $1",
    values: [iprId],
  };
  console.log("deleteIprSchoolSql ==>>>>", deleteIprSchoolSql);

  // Delete records from child tables  iprSchool
  const deleteIprCampusSql = {
    // text: 'DELETE FROM ipr_nmims_campus WHERE ipr_id = $1',
    text: "update ipr_nmims_campus set active=false WHERE ipr_id = $1",
    values: [iprId],
  };
  console.log("deleteIprCampusSql ==>>>>", deleteIprCampusSql);

  // Delete records from child tables  iprSchool
  const deleteIprDocumnetsSql = {
    // text: 'DELETE FROM ipr_supporting_documents WHERE ipr_id = $1',
    text: "update ipr_supporting_documents set active=false WHERE ipr_id = $1",
    values: [iprId],
  };
  console.log("deleteIprDocumnetsSql ==>>>>", deleteIprDocumnetsSql);

  const deleteIprInventionstype = await researchDbW.query(
    deleteIprInventiontypeSql
  );
  const deleteIprFaculty = await researchDbW.query(deleteIprFacultySql);
  const deleteIprSchool = await researchDbW.query(deleteIprSchoolSql);
  const deleteIprCampus = await researchDbW.query(deleteIprCampusSql);
  const deleteIprDocuments = await researchDbW.query(deleteIprDocumnetsSql);
  const deleteIprStatus = await researchDbW.query(deleteIprStatusSql);

  let deletePromises = [
    deleteIprInventionstype,
    deleteIprFaculty,
    deleteIprSchool,
    deleteIprCampus,
    deleteIprDocuments,
    deleteIprStatus,
  ];

  return Promise.all(deletePromises)
    .then((result) => {
      console.log("result ===>>>", result);
      //once if child record are deleted then delete record from parent table means IPR table
      return researchDbW.query({
        // text : `DELETE FROM IPR WHERE id = $1`,
        text: "update IPR set active=false WHERE id = $1",
        values: [iprId],
      });
    })
    .then((finalResponce) => {
      return {
        status: "Done",
        message: "Record deleted successfully",
        iprFacultyRowCount: deleteIprFaculty.rowCount,
        iprStatusRowCount: deleteIprStatus.rowCount,
        iprInventiontypeRowCount: deleteIprInventionstype.rowCount,
        iprSchoolRowCount: deleteIprSchool.rowCount,
        irpCampusRowCount: deleteIprCampus.rowCount,
        iprDocumnetsRowCount: deleteIprDocuments.rowCount,
        iprRowCount: finalResponce.rowCount,
      };
    });
};

module.exports.updateIPRRecordData = async (
  iprId, updatedIPRData, iprFilesNamesArray, sdgGoalsIdArray, inventionIdsArray, patentStatus,
  externalFacultyData, updateExternalDetailsArray, facultyIdsContainer, userName
) => {
  console.log("Data for updating IPR:", updatedIPRData);
  console.log("IPR Files Names Array:", iprFilesNamesArray);

  const {
    titleOfInvention,
    applicationNum,
    applicantName,
    patentFiledDate,
    patentPublishedDate,
    patentGrantDate,
    patentPublishedNumber,
    patentGrantedNo,
    instituteAffiliation,
    nmimsCampus,
    nmimsSchool,
  } = updatedIPRData;

  const supportingDocument = iprFilesNamesArray || null;

  let baseQuery = `UPDATE IPR SET patent_title = $2, patent_application_number = $3, applicant_name = $4, patent_filed_date = $5, patent_published_date = $6, patent_grant_date = $7, patent_publication_number = $8, patent_grant_number = $9, institutional_affiliation = $10,
  nmims_campus = $11, nmims_school = $12, updated_by = $13`;

  let documentsQuery = supportingDocument ? `, supporting_documents = $14` : "";
  let queryText = `${baseQuery}${documentsQuery} WHERE id = $1`;

  let values = [
    iprId,
    titleOfInvention,
    applicationNum,
    applicantName,
    patentFiledDate,
    patentPublishedDate,
    patentGrantDate,
    patentPublishedNumber,
    patentGrantedNo,
    instituteAffiliation,
    nmimsCampus,
    nmimsSchool,
    userName,
    supportingDocument,
  ].filter(Boolean);

  const iprSql = {
    text: queryText,
    values: values,
  };

  console.log('IPR SQL:', iprSql);

  const iprRowCount = await researchDbW.query(iprSql)
    .then(result => result.rowCount)
    .catch(error => {
      console.error('Error executing query:', error);
    });

  console.log('IPR Row Count:', iprRowCount);

  const insertexternalDetails = externalFacultyData ? externalFacultyData.map(async(detailsData) => {
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

  const insertFacultyPromises = facultyIdsContainer.map(async(faculty_id) => {
    const sql = {
      text: `INSERT INTO ipr_faculty (ipr_id, faculty_id, created_by) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (ipr_id, faculty_id) DO NOTHING 
             RETURNING id`,
      values: [iprId, faculty_id, userName],
    };
    console.log("SQL for IPR Faculty:", sql);
    const iprFaculty = await researchDbW.query(sql);
    return iprFaculty.rows[0] ? iprFaculty.rows[0].id : null;
  });

  const insertSdgGoalsPromises = sdgGoalsIdArray.map(async(element) => {
    const SdgGoalsSql = {
      text: `INSERT INTO ipr_sdg_goals (ipr_id, sdg_goals_id) 
             VALUES ($1, $2) 
             ON CONFLICT (ipr_id, sdg_goals_id) DO NOTHING 
             RETURNING id`,
      values: [iprId, element],
    };
    console.log("SQL for SDG Goals:", SdgGoalsSql);
    const sdgGoals = await researchDbW.query(SdgGoalsSql);
    return sdgGoals.rows[0] ? sdgGoals.rows[0].id : null;
  });

  const insertInventionTypePromises = inventionIdsArray.map(async(element) => {
    const patentInventionsSql = {
      text: `INSERT INTO ipr_invention_type (ipr_id, invention_type_id) 
             VALUES ($1, $2) 
             ON CONFLICT (ipr_id, invention_type_id) DO NOTHING 
             RETURNING id`,
      values: [iprId, element],
    };
    console.log("SQL for Patent Inventions:", patentInventionsSql);
    const patentInvention = await researchDbW.query(patentInventionsSql);
    return patentInvention.rows[0] ? patentInvention.rows[0].id : null;
  });

  const insertPatentStatusPromises = patentStatus.map(async(element) => {
    const patentStatusSql = {
      text: `INSERT INTO ipr_status_type (ipr_id, pantent_stage_status_id) 
             VALUES ($1, $2) 
             ON CONFLICT (ipr_id, pantent_stage_status_id) DO NOTHING 
             RETURNING id`,
      values: [iprId, element],
    };
    console.log("SQL for Patent Status:", patentStatusSql);
    const patentStage = await researchDbW.query(patentStatusSql);
    return patentStage.rows[0] ? patentStage.rows[0].id : null;
  });

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

  const iprFacultyIds = await Promise.all(insertFacultyPromises);
  console.log('IPR Faculty IDs:', iprFacultyIds);

  const iprSdgGoalsIds = await Promise.all(insertSdgGoalsPromises);
  console.log('IPR SDG Goals IDs:', iprSdgGoalsIds);

  const iprInventionIds = await Promise.all(insertInventionTypePromises);
  console.log('IPR Invention IDs:', iprInventionIds);

  const iprStatusIds = await Promise.all(insertPatentStatusPromises);
  console.log('IPR Status IDs:', iprStatusIds);

  const updatedFacultyRowCount = await Promise.all(updateExternalFaculty);
  console.log('Updated Faculty Row:', updatedFacultyRowCount);

  const promises = [iprRowCount, iprFacultyIds, iprSdgGoalsIds, iprInventionIds, iprStatusIds, externalIds, updatedFacultyRowCount];
  console.log('Promises:', promises);

  return Promise.all(promises).then(([iprRowCount, iprFacultyIds, iprSdgGoalsIds, iprInventionIds, iprStatusIds, externalIds, updatedFacultyRowCount]) => {
    return {
      status: "Done",
      message: "Record inserted successfully",
      iprFacultyIds, iprSdgGoalsIds, iprInventionIds, iprStatusIds, externalIds,
      iprRowCount: iprRowCount,
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


module.exports.iprRecordToBeViewed = async (iprId, userName) => {
  let iprSql = {
    text: `SELECT
    ipr.id AS ipr_id,
    ipr.created_by AS created_by,
    ipr.updated_by AS updated_by,
    ipr.patent_title,
    ipr.patent_application_number,
    ipr.applicant_name,
    ipr.patent_filed_date,
    ipr.patent_grant_date,
    ipr.patent_published_date,
    ipr.patent_publication_number,
    ipr.patent_grant_number,
    ipr.nmims_campus,
    ipr.nmims_school,
    ipr.supporting_documents,
    ipr.institutional_affiliation,
    string_agg(DISTINCT it.name, ', ') AS invention_types,
    string_agg(DISTINCT it.id::text, ', ') AS invention_types_id,
    string_agg(DISTINCT ps.name, ', ') AS patent_stage_statuses,
    string_agg(DISTINCT ps.id::text, ', ') AS patent_stage_id,
    string_agg(DISTINCT sdg.id::text, ', ') AS sdg_id,
    string_agg(DISTINCT intr.id::text, ', ') AS faculty_id
FROM
    IPR ipr
LEFT JOIN
    ipr_invention_type iit ON ipr.id = iit.ipr_id
LEFT JOIN
    invention_type it ON iit.invention_type_id = it.id
LEFT JOIN
    ipr_status_type ist ON ipr.id = ist.ipr_id
LEFT JOIN
    pantent_stage_status ps ON ist.pantent_stage_status_id = ps.id
LEFT JOIN
  ipr_sdg_goals isdg ON ipr.id = isdg.ipr_id
LEFT JOIN
    sdg_goals sdg ON isdg.sdg_goals_id = sdg.id
LEFT JOIN
  ipr_faculty iprf ON ipr.id = iprf.ipr_id
LEFT JOIN
      faculties intr ON iprf.faculty_id = intr.id

WHERE
     ipr.id = $1 and ipr.created_by = $2 and ipr.active=true and iit.active=true and it.active=true and 
    ist.active=true and isdg.active=true and sdg.active=true and ps.active=true and
    iprf.active=true and  intr.active=true and intr.faculty_type_id=1
GROUP BY
    ipr.id,
    ipr.patent_title,
    ipr.patent_application_number,
    ipr.applicant_name,
    ipr.patent_filed_date,
    ipr.patent_published_date,
    ipr.patent_publication_number,
    ipr.patent_grant_number,
    ipr.nmims_campus,
    ipr.nmims_school,
    ipr.supporting_documents,
    ipr.institutional_affiliation`,

    values: [iprId, userName],
  };

  const iprFacultySql = {
    text: `SELECT
                f.faculty_name,
                f.designation,
                f.address,
                f.employee_id,
                ft.name AS faculty_type
            FROM
                ipr_faculty ipf
            JOIN
                faculties f ON ipf.faculty_id = f.id
            JOIN
                faculty_types ft ON f.faculty_type_id = ft.id
            WHERE
                ipf.ipr_id = $1 and ipf.active=true and f.active=true and ft.active=true `,

    values: [iprId],
  };

  const iprSchoolSql = {
    text: `SELECT 
                    ns.school_name,
                    ns.id
                FROM 
                    ipr_nmims_school ins 
                JOIN 
                    nmims_school ns ON ins.school_id =  ns.id
                WHERE 
                    ins.ipr_id = $1 and ins.active=true and ns.active=true `,
    values: [iprId],
  };

  const iprCampusSql = {
    text: `SELECT 
                    nc.campus_name,
                    nc.id
                FROM
                    ipr_nmims_campus inc 
                JOIN 
                    nmims_campus nc ON inc.campus_id = nc.id
                WHERE
                    inc.ipr_id = $1 and inc.active=true and nc.active=true`,
    values: [iprId],
  };

  const iprInvetionSql = {
    text: `SELECT 
                    it.name,
                    it.id
                FROM
                ipr_invention_type iit 
                JOIN 
                invention_type it ON iit.invention_type_id = it.id
                WHERE
                    iit.ipr_id = $1`,
    values: [iprId],
  };

  const iprStatusSql = {
    text: `SELECT 
                    ps.name,
                    ps.id
                FROM
                    ipr_status_type ipt 
                JOIN 
                    pantent_stage_status ps ON ipt.pantent_stage_status_id = ps.id
                WHERE
                    ipt.ipr_id = $1 and ipt.active=true and ps.active=true `,
    values: [iprId],
  };

  const iprDocuments = {
    text: `SELECT 
                    sd.documents_name,
                    sd.id
                FROM
                    ipr_supporting_documents isd 
                JOIN 
                    supporting_documents sd ON isd.supporting_documents_id = sd.id
                WHERE
                    isd.ipr_id = $1 and isd.active=true and sd.active=true `,
    values: [iprId],
  };

  let sdgGoalSql = {
    text: `SELECT sg.id, sg.name
        FROM ipr_sdg_goals iprsg
        JOIN sdg_goals sg ON iprsg.sdg_goals_id = sg.id
        WHERE iprsg.ipr_id = $1 and iprsg.active=true and sg.active=true`,
    values : [iprId]
};
  console.log("iprDocuments ===>>>>>>", iprDocuments);
  console.log("iprStatusSql ===>>>>>", iprStatusSql);
  console.log("iprInvetionSql ===>>>>", iprInvetionSql);
  console.log("iprCampusSql ===>>>>", iprCampusSql);
  console.log("iprSchoolSql ==>>>", iprSchoolSql);
  console.log("iprFacultySql ===>>>>>", iprFacultySql);

  console.log("iprSql ===>>>>", iprSql);
  const viewIPRRecord = await researchDbW.query(iprSql);
  const facultyData = await researchDbW.query(iprFacultySql);
  const iprNmimsSchoolList = await researchDbW.query(iprSchoolSql);
  const iprNmimsCampusList = await researchDbW.query(iprCampusSql);
  const iprInventionList = await researchDbW.query(iprInvetionSql);
  const iprStatusList = await researchDbW.query(iprStatusSql);
  const iprDocumentsList = await researchDbW.query(iprDocuments);
  const sdgGoals = await researchDbW.query(sdgGoalSql)
  const promises = [
    viewIPRRecord,
    facultyData,
    iprNmimsSchoolList,
    iprNmimsCampusList,
    iprInventionList,
    iprStatusList,
    iprDocumentsList,
    sdgGoals,
  ];
  return Promise.all(promises)
    .then(([viewIPRRecord]) => {
      return {
        status: "Done",
        message: "Record Viewed Successfully",
        rowCount: viewIPRRecord.rowCount,
        IPRData: viewIPRRecord.rows[0],
        facultyData: facultyData.rows,
        iprNmimsSchoolList: iprNmimsSchoolList.rows,
        iprNmimsCampusList: iprNmimsCampusList.rows,
        iprInventionList: iprInventionList.rows,
        iprStatusList: iprStatusList.rows,
        iprDocumentsList: iprDocumentsList.rows,
        sdgGoals : sdgGoals.rows,
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


module.exports.retriveExternalDetails = async(iprId, userName) => {
  console.log('iprId and userName in models ====>>>>>>', iprId, userName);
  
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
    ipr_faculty ipf ON f.id = ipf.faculty_id
    LEFT JOIN
    IPR  ipr ON ipf.ipr_id = ipr.id
    WHERE
        f.active = true AND
        f.faculty_type_id = 2 AND
        ipr.id = $1 AND f.created_by = $2
    `,
    values: [iprId, userName]
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

module.exports.deletedPatentExternalDetails = async(externalId, userName) => {
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


module.exports.deleteInternalFaculty = async(internalId, iprId, userName) => {
  console.log("internalId in models ====>>>>>>", internalId);

  const internalNmimsDetails = internalId.map(async(internalId) => {
    let sql = {
      text: `UPDATE  ipr_faculty  SET active = false WHERE faculty_id = $1 And ipr_id = $2`,
      values: [internalId, iprId],
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

//nmims school
module.exports.deleteIprSdgGoals = async (internalId, iprId, userName) => {
  console.log("internalId in models ====>>>>>>", internalId);

  const iprSdgGoals = internalId.map(async (id) => {
    let sql = {
      text: `UPDATE ipr_sdg_goals SET active = false WHERE sdg_goals_id = $1 And ipr_id = $2`,
      values: [id, iprId],
    };

    console.log('sql sdg goals ====>>>>>', sql);
    return await researchDbW.query(sql);
  });

  return await Promise.all(iprSdgGoals)
    .then((result) => {
      return {
        status: "Done",
        message: "Record Deleted successfully",
        result: result,
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

//nmims campus
module.exports.deleteIprPatentStatus = async(internalId, iprId, userName) => {

  console.log("internalId in models ====>>>>>>", internalId);
  const iprPatentStatus = internalId.map(async(internalId) => {
    let sql = {
      text: `UPDATE  ipr_status_type  SET active = false WHERE pantent_stage_status_id = $1 And ipr_id = $2`,
      values: [internalId, iprId],
    };
    console.log("sql ===>>>>>>>>>", sql);
    return await researchDbW.query(sql);

  })
  
  return Promise.all(iprPatentStatus).then((result) => {
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
//nmims policy cadre
module.exports.deletIprInventionType = async(internalId, iprId, userName) => {
  console.log('internalId in models ====>>>>>>', internalId);

  const iprInventionType = internalId.map(async(internalId) => {
    let sql = {
      text: `UPDATE  ipr_invention_type  SET active = false WHERE invention_type_id = $1 And ipr_id = $2`,
      values: [internalId, iprId]
    };

    console.log('sql ===>>>>>>', sql);
    return await researchDbW.query(sql);
  })

  return Promise.all(articlePolicyCadre).then((result) => {
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
