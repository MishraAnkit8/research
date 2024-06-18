const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const insertDbModels = require('./insert-update-records.models')

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
            pantent_stage_status pss ON psss.patent_stage_status_id = pss.id
          LEFT JOIN 
            patent_submission_faculty psf ON psg.id = psf.patent_submission_grant_id
          LEFT JOIN 
            faculties f ON psf.faculty_id = f.id
          WHERE
            psg.created_by = $1 and f.active=true  and psf.active=true and pss.active=true and psss.active=true
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
  const insertField = ['innovation_title', 'application_number', 'grant_date', 'supporting_documents', 'created_by'];
  const valuesData = [titleOfInvention, applicationNum, subMissionDate, patentDataFilesString, userName];
  // insert into patent submission and grant
  const insetPatentsubmission = await insertDbModels.insertRecordIntoMainDb('patent_submission_grant', insertField, valuesData, userName);
  const patentId = insetPatentsubmission.insertedId;
  console.log('insetPatentsubmission into patent models ===>>>>>>', insetPatentsubmission);
  console.log('patentId ====>>>>>>', patentId);

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
  const patentFacultyField = ['patent_submission_grant_id', 'faculty_id', 'created_by'];

  const insertPatentFaculty = await insertDbModels.insertIntoRelationalDb('patent_submission_faculty', patentFacultyField, patentId, facultyIdsContainer, userName);
  console.log('insertPatentFaculty ===>>>>>>', insertPatentFaculty);

  //insert into patent_submission_sdg_goals
  const patentSdgGoalsFields = ['patent_submission_grant_id', 'sdg_goals_id', 'created_by'];
  const patentSdgGoals = await insertDbModels.insertIntoRelationalDb('patent_submission_sdg_goals', patentSdgGoalsFields, patentId, sdgGoalsIdArray, userName);

  console.log('patentSdgGoals ====>>>>>', patentSdgGoals);

  //insert into patent_submission_invention_type
  const inventionFields = ['patent_submission_grant_id', 'invention_type_id', 'created_by'];
  const patentInvention = await insertDbModels.insertIntoRelationalDb('patent_submission_invention_type', inventionFields, patentId, inventionIdsArray, userName);
  console.log('patentInvention ====>>>>>>>>', patentInvention);

  //insert into patent_submission_stage_status
  const patentStatusField = ['patent_submission_grant_id', 'patent_stage_status_id', 'created_by'];

  const patentStatus = await insertDbModels.insertIntoRelationalDb('patent_submission_stage_status', patentStatusField, patentId, patentStatusArray, userName);

  console.log('patentStatus ===>>>>>>', patentStatus);

  // Check if all insertions are successful
  if (
    insetPatentsubmission.status === 'Done' &&
    insertPatentFaculty.status === 'Done' &&
    patentSdgGoals.status === 'Done' &&
    patentInvention.status === 'Done' &&
    patentStatus.status === 'Done'
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


module.exports.updatePatentsubmissionData = async (patentId, updatedPatentData, patentDataFiles, userName,
  sdgGoalsIdArray, inventionIdsArray, patentStatusArray, facultyIdsContainer, externalDetailsUpdate, externalFacultyData
) => {
  console.log("patentDataFiles:", patentDataFiles);

  try {
   
    const { titleOfInvention, applicationNum, subMissionDate } = updatedPatentData;
    let updatePatentData;
    if (patentDataFiles) {
      const patentData = [titleOfInvention, applicationNum, subMissionDate, patentDataFiles, userName, patentId];
      const updatePatentField = ['innovation_title', 'application_number', 'grant_date', 'supporting_documents', 'updated_by'];

      updatePatentData = await insertDbModels.updateFieldWithFiles('patent_submission_grant', updatePatentField, patentData, userName);
      console.log('updatePatentData ===>>>>', updatePatentData);
    } else {
      const patentData = [titleOfInvention, applicationNum, subMissionDate, userName, patentId];
      const updatePatentField = ['innovation_title', 'application_number', 'grant_date', 'updated_by'];

      updatePatentData = await insertDbModels.updateFieldWithOutFiles('patent_submission_grant', updatePatentField, patentData, userName);
      console.log('updatePatentData ===>>>>', updatePatentData);
    }

    // Insert into external faculty
    const facultyField = ['faculty_type_id', 'faculty_name', 'designation', 'institution_name', 'address', 'created_by'];
    const insertIntoFacultyTable = await insertDbModels.insertExternalFacultyRecord('faculties', facultyField, externalFacultyData, userName);
    const externalIds = insertIntoFacultyTable.externalId;

    // Append into faculty container
    facultyIdsContainer.push(...externalIds);

    // Update external faculty details
    const updateFacultyField = ['faculty_name', 'designation', 'institution_name', 'address'];
    const updateExternalFacultyData = await insertDbModels.updateExternalFacultyDetails('faculties', updateFacultyField, externalDetailsUpdate, userName);
    console.log('updateExternalFacultyData ====>>>>>>', updateExternalFacultyData);

    // Update patent faculty tables
    console.log('facultyIdsContainer in patent models ===>>>>>>', facultyIdsContainer);

    // Insert into patent faculties table
    const patentFacultyField = ['patent_submission_grant_id', 'faculty_id', 'created_by'];
    const updatePatentFaculty = await insertDbModels.insertIntoRelationalDb('patent_submission_faculty', patentFacultyField, patentId, facultyIdsContainer, userName);
    console.log('updatePatentFaculty ===>>>>>>', updatePatentFaculty);

    // Insert into patent_submission_sdg_goals
    const patentSdgGoalsFields = ['patent_submission_grant_id', 'sdg_goals_id', 'created_by'];
    const updatePatentSdgGoals = await insertDbModels.insertIntoRelationalDb('patent_submission_sdg_goals', patentSdgGoalsFields, patentId, sdgGoalsIdArray, userName);
    console.log('updatePatentSdgGoals ====>>>>>', updatePatentSdgGoals);

    // Insert into patent_submission_invention_type
    const inventionFields = ['patent_submission_grant_id', 'invention_type_id', 'created_by'];
    const updatePatentInvention = await insertDbModels.insertIntoRelationalDb('patent_submission_invention_type', inventionFields, patentId, inventionIdsArray, userName);
    console.log('updatePatentInvention ====>>>>>>>>', updatePatentInvention);

    // Insert into patent_submission_stage_status
    const patentStatusField = ['patent_submission_grant_id', 'patent_stage_status_id', 'created_by'];
    const updatePatentStatus = await insertDbModels.updateStatus('patent_submission_stage_status', patentStatusField, patentId, patentStatusArray, userName);
    console.log('updatePatentStatus ===>>>>>>', updatePatentStatus);

    // Check if all updates are done
    if (
      updatePatentData &&
      updateExternalFacultyData &&
      updatePatentFaculty &&
      updatePatentSdgGoals &&
      updatePatentInvention &&
      updatePatentStatus
    ) {
      return {
        status: 'Done',
        message: 'All Records updated',
      };
    } else {
      throw new Error('Some updates failed');
    }
  } catch (error) {
    console.error('Error updating patent submission data:', error);

    return {
      status: 'error',
      message: 'Failed to update records',
      error: error.message,
    };
  }
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
            pantent_stage_status pss ON psss.patent_stage_status_id = pss.id
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
      text: `UPDATE  patent_submission_stage_status  SET active = false WHERE patent_stage_status_id = $1 And patent_submission_grant_id = $2`,
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



