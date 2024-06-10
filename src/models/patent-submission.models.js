const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

// reomove for testinging and psg.active=true

module.exports.fetchPatentSubMissionForms = async (userName) => {
  let patentSubmissionSql = {
    text: `SELECT
            psg.id AS patent_submission_grant_id,
            psg.innovation_title,
            psg.application_number,
            psg.created_by,
            psg.created_by,
            psg.grant_date,
            psg.supporting_documents,
            string_agg(DISTINCT f.id::text, ', ') AS faculty_id,
            string_agg(DISTINCT sg.id::text, ', ') AS sdg_id,
            string_agg(DISTINCT it.id::text, ', ') AS invetion_id,
            string_agg(DISTINCT pss.id::text, ', ') AS status_id
          FROM 
            patent_submission_grant psg
          LEFT JOIN 
            patent_submission_sdg_goals pssg ON psg.id = pssg.patent_submission_grant_id
          LEFT JOIN 
            sdg_goals sg ON pssg.sdg_goals_id = sg.id
          LEFT JOIN 
            patent_submission_invention_type psit ON psg.id = psit.patent_submission_grant_id
          LEFT JOIN 
            invention_type it ON psit.invention_type_id = it.id
          LEFT JOIN 
            patent_submission_stage_status psss ON psg.id = psss.patent_submission_grant_id
          LEFT JOIN 
            pantent_stage_status pss ON psss.pantent_stage_status_id = pss.id
          LEFT JOIN 
            patent_submission_faculty psf ON psg.id = psf.patent_submission_grant_id
          LEFT JOIN 
            faculties f ON psf.faculty_id = f.id
          WHERE
            psg.created_by = $1 and f.active=true and f.faculty_type_id = 1  and psf.active=true and pss.active=true and psss.active=true
            and it.active=true and psit.active=true and sg.active=true and pssg.active=true
          GROUP BY
            psg.id, psg.innovation_title,
            psg.application_number,
            psg.created_by,
            psg.created_by,
            psg.grant_date,
            psg.supporting_documents
          ORDER BY psg.id desc`,
    values: [userName],
  };

  let internalEmpSql = {
    text: `select *  FROM faculties WHERE faculty_type_id = 1 and active=true `,
  };

  let sdgGoalSql = {
    text: `select *  FROM sdg_goals where active=true  ORDER BY id`,
  };

  let innovationTypeSql = {
    text: `select *  FROM invention_type  where active=true ORDER BY id`,
  };

  let patentStageSql = {
    text: `select *  FROM pantent_stage_status where active=true ORDER BY id`,
  };

  let patentGrantsubmissionSql = {
    text: `select *  FROM patent_submission_grant where active=true ORDER BY id`,
  };



  console.log("patentSubmissionSql ===>>>", patentSubmissionSql);
  console.log("internalEmpSql ===>>>", internalEmpSql);
  console.log("patentGrantsubmissionSql ===>>>>", patentGrantsubmissionSql);
  console.log("patentStageSql ===>>>>", patentStageSql);
  console.log("innovationTypeSql ===>>>>", innovationTypeSql);
  console.log("sdgGoalSql ===>>>>", sdgGoalSql);


  const patentSubmissionsData = await researchDbR.query(patentSubmissionSql);
  const internalFacultyData = await researchDbR.query(internalEmpSql);
  const patentSdgGoalData = await researchDbR.query(sdgGoalSql);
  const patentStagData = await researchDbR.query(patentStageSql);
  const patentInventionTypeData = await researchDbR.query(innovationTypeSql);
  const patentGrantsubmission = await researchDbR.query(patentGrantsubmissionSql)


  const promises = [
    patentSubmissionsData,
    patentStagData,
    internalFacultyData,
    patentSdgGoalData,
    patentInventionTypeData,
    patentGrantsubmission
  ];
  return Promise.all(promises)
    .then(
      ([
        patentSubmissionsData,
        patentStagData,
        internalFacultyData,
        patentSdgGoalData,
        patentInventionTypeData,
        patentGrantsubmission
      ]) => {

        return {
          status: "Done",
          message: "Record Fetched Successfully",
          rowCount: patentSubmissionsData.rowCount,
          patentStagData: patentStagData.rows,
          patentSubmissionsData: patentSubmissionsData.rows,
          internalFacultyData: internalFacultyData.rows,
          patentSdgGoalData: patentSdgGoalData.rows,
          patentInventionTypeData: patentInventionTypeData.rows,
          patentGrantsubmission : patentGrantsubmission.rows
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


module.exports.insertPatentData = async (
  patentData, patentDataFilesString, sdgGoalsIdArray, inventionIdsArray, facultyIdsContainer, patentStatusArray, externalFacultyData, userName
) => {
    console.log("patentData inside models ===>>>", patentData);

    const { titleOfInvention, applicationNum, subMissionDate } = patentData;

    const patentDataSql = {
      text: `INSERT INTO patent_submission_grant (innovation_title, application_number, grant_date, supporting_documents, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      values: [
        titleOfInvention,
        applicationNum,
        subMissionDate,
        patentDataFilesString,
        userName,
      ],
    };

    console.log("patentDataSql ===>>>>>", patentDataSql);

    const patentId = await researchDbW.query(patentDataSql)
    .then(result => {
      return result.rows[0].id;
    })
    const rowCount = await researchDbW.query(patentDataSql)
    .then(result => {
      return result.rowCount;
    })
    .catch(error => {
      console.error('Error executing query:', error);
    });

    console.log('patentId ====>>>>', patentId);

        // insert external faculties
    const insertexternalDetails = externalFacultyData ? externalFacultyData.map( async(detailsData) => {
        console.log('detailsData ======>>>>>>>>>', detailsData);
        const [facultyName, facultyDsg, facultyAddr ] = detailsData
      
        let sql = {
            text: `INSERT INTO faculties (faculty_type_id, faculty_name, designation, address, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            values: [2, facultyName, facultyDsg, facultyAddr, userName]
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
            text: `INSERT INTO patent_submission_faculty (patent_submission_grant_id, faculty_id, created_by) VALUES ($1, $2, $3) RETURNING id`,
            values: [patentId, faculty_id, userName],
            };
        console.log("sql ===>>>>>", sql);
        const patentFaculty = await researchDbW.query(sql);
        return patentFaculty.rows[0].id  
    }) : null;
    
    
    
    const insertDsgGoalsPromises = sdgGoalsIdArray.map(async(element) => {
        const SdgGoalsSql = {
            text: `INSERT INTO patent_submission_sdg_goals (patent_submission_grant_id, sdg_goals_id) VALUES ($1, $2) RETURNING id`,
            values: [patentId, element],
          };
      
        console.log("SdgGoalsSql ===>>>>>", SdgGoalsSql);
        const sdgGoals = await researchDbW.query(SdgGoalsSql);
        return sdgGoals.rows[0].id ;
      });
    
     
    
      const insertInventionTypePromises = inventionIdsArray.map(async(element) => {
          const patentInventionsSql = {
            text: `INSERT INTO patent_submission_invention_type (patent_submission_grant_id, invention_type_id) VALUES ($1, $2) RETURNING id`,
            values: [patentId, element],
          };
    
          console.log("patentInventionsSql ===>>>>>", patentInventionsSql);
          const patentInvention = await researchDbW.query(patentInventionsSql)
          return  patentInvention.rows[0].id ;
      });
    
    
    
      const insertPatentStatusPromises = patentStatusArray.map(async(element) => {
          const patentStatusSql = {
            text: `INSERT INTO patent_submission_stage_status (patent_submission_grant_id, pantent_stage_status_id) VALUES ($1, $2) RETURNING id`,
            values: [patentId, element],
          };
          console.log("patentStatusSql ===>>>>>", patentStatusSql);
          const patentsatge = await researchDbW.query(patentStatusSql)
          return patentsatge.rows[0].id ;
      });


      const patentFacultyIds = await Promise.all(insertFacultyPromises);
      console.log('patentFacultyIds ====>>>>>>>', patentFacultyIds);

      const patentSdgGoalsIds = await Promise.all(insertDsgGoalsPromises);
      console.log('patentSdgGoalsIds =====>>>>>', patentSdgGoalsIds);

      const patentInventionIds = await Promise.all(insertInventionTypePromises);
      console.log('patentInventionIds ====>>>>>>', patentInventionIds);

      const patentSatausIds = await Promise.all(insertPatentStatusPromises);

      console.log('patentSatausIds ====>>>>>', patentSatausIds);

      const promises = [patentId, patentFacultyIds, patentSdgGoalsIds, patentInventionIds, patentSatausIds];
      return Promise.all(promises).then(([patentId, patentFacultyIds, patentSdgGoalsIds, patentInventionIds, patentSatausIds]) => {
        return {
          status : "Done",
          message : "Record inserted successfully",
          patentId, patentFacultyIds, patentSdgGoalsIds, patentInventionIds, patentSatausIds,
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

module.exports.updatePatentsubmissionData = async (patentId, updatedPatentData, patentDataFiles, userName,
  sdgGoalsIdArray, inventionIdsArray, patentStatusArray, facultyIdsContainer, externalDetailsUpdate, externalFacultyData
) => {
  console.log("patentDataFiles:", patentDataFiles);

  const { titleOfInvention, applicationNum, subMissionDate } =
    updatedPatentData;
  const supportingDocument = patentDataFiles || null;

  let baseQuery = `UPDATE patent_submission_grant SET innovation_title = $2, application_number = $3, grant_date = $4, updated_by = $5`;
  let documentsQuery = supportingDocument ? `, supporting_documents = $6` : "";
  let queryText = `${baseQuery}${documentsQuery} WHERE id = $1`;

  let values = [
    patentId,
    titleOfInvention,
    applicationNum,
    subMissionDate,
    userName,
    supportingDocument,
  ].filter(Boolean);

  const patentsubmissonSql = {
    text: queryText,
    values: values,
  };

  console.log("patentsubmissonSql:", patentsubmissonSql);
  const patentRowCount = await researchDbW.query(patentsubmissonSql)
  .then(result => {
    return result.rowCount;
  })
  .catch(error => {
    console.error('Error executing query:', error);
  });
  console.log('patentRowCount===>>>>>>', patentRowCount);



  console.log('facultyIdsContainer ===>>>>>', facultyIdsContainer);
  const insertFacultyPromises = facultyIdsContainer ? facultyIdsContainer.map(async (faculty_id) => {
    const existingRecord = await researchDbW.query({
      text: `SELECT id FROM patent_submission_faculty WHERE patent_submission_grant_id = $1 AND faculty_id = $2 and active=true `,
      values: [patentId, faculty_id],
    });

    return existingRecord.rows.length === 0
      ? researchDbW.query({
          text: `INSERT INTO patent_submission_faculty (patent_submission_grant_id, faculty_id) VALUES ($1, $2) RETURNING id`,
          values: [patentId, faculty_id],
        })
      : Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] });
  }) : null;


  const internalPatentFacultyIds = await Promise.all(insertFacultyPromises);
  console.log('internalPatentFaculty ===>>>>>', internalPatentFacultyIds);

  const insertSdgGoalsPromises = sdgGoalsIdArray ? sdgGoalsIdArray.map(async (sdg_goals_id) => {
    const existingRecord = await researchDbW.query({
      text: `SELECT id FROM patent_submission_sdg_goals WHERE patent_submission_grant_id = $1 AND sdg_goals_id = $2 and active=true`,
      values: [patentId, sdg_goals_id],
    });

    return existingRecord.rows.length === 0
      ? researchDbW.query({
          text: `INSERT INTO patent_submission_sdg_goals (patent_submission_grant_id, sdg_goals_id) VALUES ($1, $2) RETURNING id`,
          values: [patentId, sdg_goals_id],
        })
      : Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] });
  }) : null;

  const insertSdgGoals = await Promise.all(insertSdgGoalsPromises);
  console.log('insertSdgGoals ===>>>>', insertSdgGoals);

  const insertInventionTypePromises = inventionIdsArray ? inventionIdsArray.map(
    async (invention_type_id) => {
      const existingRecord = await researchDbW.query({
        text: `SELECT id FROM patent_submission_invention_type WHERE patent_submission_grant_id = $1 AND invention_type_id = $2 and active=true`,
        values: [patentId, invention_type_id],
      });

      return existingRecord.rows.length === 0
        ? researchDbW.query({
            text: `INSERT INTO patent_submission_invention_type (patent_submission_grant_id, invention_type_id) VALUES ($1, $2) RETURNING id`,
            values: [patentId, invention_type_id],
          })
        : Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] });
    }
  ) : null;

  const insertInventionType = await Promise.all(insertInventionTypePromises);
  console.log('insertInventionType ====>>>>>>>', insertInventionType);

  const insertPatentStatusPromises = patentStatusArray ? patentStatusArray.map(
    async (pantent_stage_status_id) => {
      const existingRecord = await researchDbW.query({
        text: `SELECT id FROM patent_submission_stage_status WHERE patent_submission_grant_id = $1 AND pantent_stage_status_id = $2 and active=true `,
        values: [patentId, pantent_stage_status_id],
      });

      return existingRecord.rows.length === 0
        ? researchDbW.query({
            text: `INSERT INTO patent_submission_stage_status (patent_submission_grant_id, pantent_stage_status_id) VALUES ($1, $2) RETURNING id`,
            values: [patentId, pantent_stage_status_id],
          })
        : Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] });
    }
  ) : null;

  const insertPatentStatus = await Promise.all(insertPatentStatusPromises);
  console.log('insertPatentStatus ====>>>>>>>', insertPatentStatus);

  // insert external faculties
  const insertexternalDetails = externalFacultyData ? externalFacultyData.map( async(detailsData) => {
    console.log('detailsData ======>>>>>>>>>', detailsData);
    const [facultyName, facultyDsg, institutionName, facultyAddr ] = detailsData
      
    let sql = {
        text: `INSERT INTO faculties (faculty_type_id, faculty_name, designation, institution_name, address, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        values: [2, facultyName, facultyDsg, institutionName, facultyAddr, userName]
    };
      
    console.log('sql external faculty data', sql);
    const externalResult = await researchDbW.query(sql);
    return externalResult.rows[0].id
      
    }) : null;
      
  const externalIds = await Promise.all(insertexternalDetails);
  console.log('externalIds =======>>>>>>>>', externalIds);

  //update external faculty details 
  const updateExternalFaculty = externalDetailsUpdate
  ? externalDetailsUpdate.map((externalDetails) => {
      console.log('externalDetails =====>>>>>>>', externalDetails);
      const [facultyName, facultyDsg, institutionName, facultyAddr, id] = externalDetails;

      let sql = {
        text: `UPDATE faculties SET faculty_type_id = $1, faculty_name = $2, designation = $3, institutionName = $4, address = $5,  updated_by = $6 WHERE id = $7`,
        values: [2, facultyName, facultyDsg, institutionName, facultyAddr, userName, id]
      };

      console.log('sql external faculty data', sql);

      return researchDbW.query(sql)
        .then(externalResult => {
          if (externalResult.rowCount === 0) {
            console.error(`No rows updated for externalDetails: ${externalDetails}`);
          }
          return externalResult.rowCount;
        })
        .catch(error => {
          console.error(`Error updating external faculty for details: ${externalDetails}`, error);
          return 0; 
        });
    })
  : [];

  Promise.all(updateExternalFaculty)
    .then(externalUpdate => {
      console.log('externalUpdate ====>>>>>>', externalUpdate);
    })
    .catch(error => {
      console.error('Error updating external faculties:', error);
    });


  //insert external faculty id into 
  const insertExConFaculty = externalIds? externalIds.map(async (faculty_id) => {
    let sql = {
      text: `INSERT INTO patent_submission_faculty (patent_submission_grant_id, faculty_id) VALUES ($1, $2) RETURNING id`,
      values: [patentId, faculty_id]
    };
    console.log('SQL ======>>>>>>>>>', sql);
    const confacultySql = await researchDbW.query(sql);
    return confacultySql.rows[0].id;
  }) : [];
  
  const insertExCon = internalPatentFacultyIds.length > 0 ? await Promise.all(insertExConFaculty) : [];
  console.log('insertExCon ===>>>>>', insertExCon);

  const promises = [patentRowCount, internalPatentFacultyIds, insertSdgGoals, insertInventionType,
    insertPatentStatus, externalIds, updateExternalFaculty, insertExCon];

  return await Promise.all(promises).then(([patentRowCount, internalPatentFacultyIds, insertSdgGoals, insertInventionType,
    insertPatentStatus, externalIds, updateExternalFaculty, insertExCon]) => {
      return {
        status: "Done",
        message: 'Updated successfully',
        patentRowCount : patentRowCount,
        updateExternalFaculty : updateExternalFaculty
      }
    }) .catch((error) => {
      console.error("Error:", error.message);
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });

  

};

module.exports.deletePatentSubmissionData = async (patentId) => {
  console.log("Patent Id in Model:", patentId);

  // Delete records from child tables first patent_submission_invention_type

  // Delete records from child tables  patent_submission_invention_type
  const deletePatentInvention = {
    // text: 'DELETE FROM patent_submission_invention_type WHERE patent_submission_grant_id = $1',
    text: "update patent_submission_invention_type set active=false WHERE patent_submission_grant_id = $1",
    values: [patentId],
  };
  console.log("deletePatentInvention ==>>>>", deletePatentInvention);

  // Delete records from child tables  patent_submission_sdg_goals
  const deleteSdgSql = {
    // text: 'DELETE FROM patent_submission_sdg_goals WHERE patent_submission_grant_id = $1',
    text: "update patent_submission_sdg_goals set active=false WHERE patent_submission_grant_id = $1",
    values: [patentId],
  };
  console.log("deleteSdgSql ==>>>>", deleteSdgSql);

  // Delete records from child tables  patent_submission_stage_status
  const deletePatentStatusSql = {
    // text: 'DELETE FROM patent_submission_stage_status WHERE patent_submission_grant_id = $1',
    text: "update patent_submission_stage_status set active=false WHERE patent_submission_grant_id = $1",
    values: [patentId],
  };
  console.log("deletePatentStatusSql ==>>>>", deletePatentStatusSql);

  // Delete records from child tables  patent_submission_faculty
  const patentGrantFacultySql = {
    // text: "DELETE FROM patent_submission_faculty WHERE patent_submission_grant_id = $1",
    text: "update patent_submission_faculty set active=false WHERE patent_submission_grant_id = $1",
    values: [patentId],
  };
  console.log("patentGrantFacultySql ==>>>>", patentGrantFacultySql);

  const patentSdgGoalData = await researchDbR.query(deleteSdgSql);
  const patentStagData = await researchDbR.query(deletePatentStatusSql);
  const patentInventionTypeData = await researchDbR.query(
    deletePatentInvention
  );
  const patentGrantFaculty = await researchDbR.query(patentGrantFacultySql);

  let deletePromises = [
    patentSdgGoalData,
    patentStagData,
    patentInventionTypeData,
    patentGrantFaculty,
  ];

  // Execute delete queries for child tables first
  return Promise.all(deletePromises)
    .then((results) => {
      // Once child records are deleted, delete the parent record
      return researchDbW.query({
        // text: 'DELETE FROM patent_submission_grant WHERE id = $1',
        text: "update patent_submission_grant set active=false WHERE id = $1",
        values: [patentId],
      });
    })
    .then((grantDeletionResult) => {
      return {
        status: "Done",
        message: "Record(s) Deleted Successfully",
        rowCount: grantDeletionResult.rowCount,
        facultyRowCount: patentGrantFaculty.rowCount,
        sdgGoalRowCount: patentSdgGoalData.rowCount,
        inventionRowCount: patentInventionTypeData.rowCount,
        statusRowCount: patentStagData.rowCount,
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

module.exports.viewPatentSubmission = async (patentId, userName) => {
  console.log("id", patentId);

  let patentSubmissionSql = {
    text: `SELECT 
            psg.id AS patent_submission_grant_id,
            psg.innovation_title,
            psg.created_by AS created_by,
            psg.updated_by AS updated_by,
            psg.application_number,
            psg.grant_date,
            psg.supporting_documents,
            sg.name AS sdg_goal_name,
            sg.id AS sdg_goal_id,
            it.name AS invention_type_name,
            it.id AS invention_type_id,
            pss.name AS patent_stage_status_name,
            pss.id AS patent_stage_status_Id,
            f.faculty_name,
            f.designation,
            f.institution_name,
            f.address,
            
            psf.id AS patent_submission_faculty_id
        FROM 
            patent_submission_grant psg
        LEFT JOIN 
            patent_submission_sdg_goals pssg ON psg.id = pssg.patent_submission_grant_id
        LEFT JOIN 
            sdg_goals sg ON pssg.sdg_goals_id = sg.id
        LEFT JOIN 
            patent_submission_invention_type psit ON psg.id = psit.patent_submission_grant_id
        LEFT JOIN 
            invention_type it ON psit.invention_type_id = it.id
        LEFT JOIN 
            patent_submission_stage_status psss ON psg.id = psss.patent_submission_grant_id
        LEFT JOIN 
            pantent_stage_status pss ON psss.pantent_stage_status_id = pss.id
        LEFT JOIN 
            patent_submission_faculty psf ON psg.id = psf.patent_submission_grant_id
        LEFT JOIN 
            faculties f ON psf.faculty_id = f.id 
        where  psg.id = $1 AND psg.created_by = $2 and psf.active=true and pss.active=true and psss.active=true and
        it.active=true and psit.active=true and sg.active=true and pssg.active=true`,

    values: [patentId, userName],
  };
  console.log("sql qury for view", patentSubmissionSql);

  let sdgGoalSql = {
    text: `SELECT sg.id, sg.name
            FROM patent_submission_sdg_goals psg
            JOIN sdg_goals sg ON psg.sdg_goals_id = sg.id
            WHERE psg.patent_submission_grant_id = $1 and psg.active=true and sg.active=true`,
    values: [patentId],
  };
  console.log("sdgGoalSql ===>>>>", sdgGoalSql);

  let inventionSql = {
    text: `select it.id, it.name  FROM patent_submission_invention_type pit
                JOIN invention_type it ON pit.invention_type_id = it.id
                WHERE pit.patent_submission_grant_id = $1 and pit.active=true and it.active=true `,
    values: [patentId],
  };
  console.log("innovationTypeSql ===>>>>", inventionSql);

  let patentGrantFacultySql = {
    text: `SELECT
            f.faculty_name,
            f.designation,
            f.institution_name,
            f.address,
            ft.name AS faculty_type
        FROM
            patent_submission_faculty psf
        JOIN
            faculties f ON psf.faculty_id = f.id
        JOIN
            faculty_types ft ON f.faculty_type_id = ft.id
        WHERE
            psf.patent_submission_grant_id = $1 and psf.active=true and f.active=true and ft.active=true`,

    values: [patentId],
  };
  console.log("patentGrantFacultySql ===>>>>", patentGrantFacultySql);

  const patentSubmissionDataView = await researchDbR.query(patentSubmissionSql);
  const facultyData = await researchDbR.query(patentGrantFacultySql);
  const sdgGoalsData = await researchDbR.query(sdgGoalSql);
  const inventionTypeData = await researchDbR.query(inventionSql);
  let promises = [
    patentSubmissionDataView,
    facultyData,
    sdgGoalsData,
    inventionTypeData,
  ];

  return Promise.all(promises)
    .then(
      ([
        patentSubmissionDataView,
        facultyData,
        sdgGoalsData,
        inventionTypeData,
      ]) => {
        return {
          status: "Done",
          message: "Record Fecthed Successfully",
          patentData: patentSubmissionDataView.rows,
          rowCount: patentSubmissionDataView.rowCount,
          facultyData: facultyData.rows,
          sdgGoalsData: sdgGoalsData.rows,
          inventionTypeData: inventionTypeData.rows,
        };
      }
    )
    .catch((error) => {
      console.error("Error:", error.message);
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
};


module.exports.retriveExternalDetails = async(patentId, userName) => {
  console.log('patentId and userName in models ====>>>>>>', patentId, userName);
  
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
    patent_submission_faculty psf ON f.id = psf.faculty_id
    LEFT JOIN
    patent_submission_grant psg ON psf.patent_submission_grant_id = psg.id
    WHERE
        f.active = true AND
        f.faculty_type_id = 2 AND
        psg.id = $1 AND f.created_by = $2
    `,
    values: [patentId, userName]
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

module.exports.deletePatentInternalFaculty = async(internalId, patentId) => {

  console.log('internalId in models ====>>>>>>', internalId);
  const deleteRecord = internalId ? internalId.map(async(internalId) => {
    let sql = {
      text: `UPDATE  patent_submission_faculty  SET active = false WHERE faculty_id = $1 And patent_submission_grant_id = $2`,
      values: [internalId, patentId]
    }
    console.log('sql ===>>>>>>>>>', sql);
    const result  = await researchDbW.query(sql);
    return result.rowCount
  }) : null
 
  const  promises = [deleteRecord];

  return Promise.all(promises).then(([externalFacultyDelete]) => {
    return {
      status : 'Done',
      message : 'Delete Successfully',
      rowCount : externalFacultyDelete.rowCount
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

module.exports.deletePatentInventionType = async(internalId, patentId) => {

  console.log('internalId in models ====>>>>>>', internalId);
  const deleteRecord = internalId ? internalId.map(async(internalId) => {
    let sql = {
      text: `UPDATE  patent_submission_invention_type  SET active = false WHERE invention_type_id = $1 And patent_submission_grant_id = $2`,
      values: [internalId, patentId]
    }
    console.log('sql ===>>>>>>>>>', sql);
    const result  = await researchDbW.query(sql);
    return result.rowCount
  }) : null
 
  

  const  promises = [deleteRecord];

  return Promise.all(promises).then(([externalFacultyDelete]) => {
    return {
      status : 'Done',
      message : 'Delete Successfully',
      rowCount : externalFacultyDelete.rowCount
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

module.exports.deletePatentSdgGoals = async(internalId, patentId) => {

  console.log('internalId in models ====>>>>>>', internalId);
  const deleteRecord = internalId ? internalId.map(async(internalId) => {
    let sql = {
      text: `UPDATE  patent_submission_sdg_goals  SET active = false WHERE sdg_goals_id = $1 And patent_submission_grant_id = $2`,
      values: [internalId, patentId]
    }
    console.log('sql ===>>>>>>>>>', sql);
    const result  = await researchDbW.query(sql);
    return result.rowCount
  }) : null
 
  const  promises = [deleteRecord];

  return Promise.all(promises).then(([externalFacultyDelete]) => {
    return {
      status : 'Done',
      message : 'Delete Successfully',
      rowCount : externalFacultyDelete.rowCount
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

module.exports.deletPatentPatentStatus = async(internalId, patentId) => {

  console.log('internalId in models ====>>>>>>', internalId);
  const deleteRecord = internalId ? internalId.map(async(internalId) => {
    let sql = {
      text: `UPDATE  patent_submission_stage_status  SET active = false WHERE pantent_stage_status_id = $1 And patent_submission_grant_id = $2`,
      values: [internalId, patentId]
    }
    console.log('sql ===>>>>>>>>>', sql);
    const result  = await researchDbW.query(sql);
    return result.rowCount
  }) : null;

 const rowCount = await Promise.all(deleteRecord);
 console.log('rowCount ====>>>>>', rowCount);
  const  promises = [deleteRecord];

  return Promise.all(promises).then(([deleteRecord]) => {
    return {
      status : 'Done',
      message : 'Delete Successfully',
      rowCount : deleteRecord.rowCount
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



