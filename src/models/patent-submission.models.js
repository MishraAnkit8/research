const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);




module.exports.fetchPatentSubMissionForms = async (userName) => {

    let patentSubmissionSql = {
        text: `SELECT 
                    psg.id AS patent_submission_grant_id,
                    psg.innovation_title,
                    psg.application_number,
                    psg.created_by AS created_by,
                    psg.created_by AS updated_by,
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
                    f.address,
                    f.employee_id,
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
                WHERE
                    created_by = $1 
                ORDER BY psg.id desc`,
            values : [userName]
    };

    let internalEmpSql = {
        text: `select *  FROM faculties WHERE faculty_type_id = 1`
    };

    let sdgGoalSql = {
        text: `select *  FROM sdg_goals ORDER BY id`
    };

    let innovationTypeSql = {
        text: `select *  FROM invention_type ORDER BY id`
    };

    let patentStageSql = {
        text: `select *  FROM pantent_stage_status ORDER BY id`
    };

    let patentGrantsubmission = {
        text: `select *  FROM patent_submission_grant ORDER BY id`
    }
    
    let patentInternalFacultyIds = {
        text : `SELECT psf.id AS patent_submission_faculty_id, 
        psf.patent_submission_grant_id, 
        psf.faculty_id 
        FROM patent_submission_faculty psf
        JOIN faculties f ON psf.faculty_id = f.id
        JOIN faculty_types ft ON f.faculty_type_id = ft.id
        WHERE ft.name = 'Internal' 
        ORDER BY psf.id`
    }

    let patentGrantExternalsql = {
        text : `SELECT psf.id AS patent_submission_faculty_id, 
        psf.patent_submission_grant_id, 
        psf.faculty_id 
        FROM patent_submission_faculty psf
        JOIN faculties f ON psf.faculty_id = f.id
        JOIN faculty_types ft ON f.faculty_type_id = ft.id
        WHERE ft.name = 'External' 
        ORDER BY psf.id`
    }

    let patentGrantSql = {
        text : `select id, patent_submission_grant_id, faculty_id from patent_submission_faculty order by id`
    }

    console.log('patentSubmissionSql ===>>>', patentSubmissionSql);
    console.log('internalEmpSql ===>>>', internalEmpSql);
    console.log('patentGrantsubmission ===>>>>', patentGrantsubmission);
    console.log('patentStageSql ===>>>>', patentStageSql);
    console.log('innovationTypeSql ===>>>>', innovationTypeSql);
    console.log('sdgGoalSql ===>>>>', sdgGoalSql);
    console.log('patentInternalFacultyIds ===>>>>', patentInternalFacultyIds);
    console.log('patentGrantExternalsql ===>>>>', patentGrantExternalsql);
    console.log('patentGrantSql ====>>>>>>>', patentGrantSql);
    

    const patentSubmissionsData = await researchDbR.query(patentSubmissionSql);
    const internalFacultyData = await researchDbR.query(internalEmpSql);
    const patentSdgGoalData = await researchDbR.query(sdgGoalSql);
    const patentStagData = await researchDbR.query(patentStageSql);
    const patentInventionTypeData = await researchDbR.query(innovationTypeSql);
    const patentData = await researchDbR.query(patentGrantsubmission);
    const internalPatentFacultyId = await researchDbR.query(patentInternalFacultyIds);
    const externalPatentFacultyId = await researchDbR.query(patentGrantExternalsql);
    const patentGrantFacultyIds = await researchDbR.query(patentGrantSql)

    const promises = [patentData, patentStagData, patentSubmissionsData, internalFacultyData, patentSdgGoalData, patentInventionTypeData, patentData, internalPatentFacultyId, externalPatentFacultyId, patentGrantFacultyIds];
    return Promise.all(promises).then(([patentData, patentStagData, patentSubmissionsData, internalFacultyData, patentSdgGoalData, patentInventionTypeData, internalPatentFacultyId, externalPatentFacultyId, patentGrantFacultyIds]) => {
      return  { status : "Done" , message : "Record Fetched Successfully" ,  rowCount : patentSubmissionsData.rowCount, patentData : patentData.rows, patentStagData : patentStagData.rows, patentSubmissionsData : patentSubmissionsData.rows, 
      internalFacultyData : internalFacultyData.rows, patentSdgGoalData : patentSdgGoalData.rows, patentInventionTypeData : patentInventionTypeData.rows, patentData : patentData.rows, internalPatentFacultyId : internalPatentFacultyId.rows, externalPatentFacultyId : externalPatentFacultyId.rows,
      patentGrantFacultyIds : patentGrantFacultyIds.rows};
  })
  .catch((error) => {
      return{status : "Failed" , message : error.message , errorCode : error.code}
  }) 

}



module.exports.insertPatentData = async (patentData, patentDataFilesString, sdgGoalsIdArray, inventionIdsArray, FacultydataArray, patentStatusArray, userName) => {
    console.log('patentData inside models ===>>>', patentData);

    const { titleOfInvention, applicationNum, subMissionDate } = patentData;

    const patentDataSql = {
        text: `INSERT INTO patent_submission_grant (innovation_title, application_number, grant_date, supporting_documents, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        values: [titleOfInvention, applicationNum, subMissionDate, patentDataFilesString, userName]
    };

    console.log('patentDataSql ===>>>>>', patentDataSql);
    const patnetSubmissionDataPromise = researchDbW.query(patentDataSql);

    const insertFacultyPromises = FacultydataArray.map((faculty_id) => {
        return patnetSubmissionDataPromise.then((result) => {
            const patentId = result.rows[0].id;
            const patentGrantFacultySql = {
                text: `INSERT INTO patent_submission_faculty (patent_submission_grant_id, faculty_id) VALUES ($1, $2) RETURNING id`,
                values: [patentId, faculty_id]
            };

            console.log('patentGrantFacultySql ===>>>>>', patentGrantFacultySql);
            return researchDbW.query(patentGrantFacultySql);
        });
    });

    const insertDsgGoalsPromises = sdgGoalsIdArray.map((element) => {
        return patnetSubmissionDataPromise.then((result) => {
            const patentId = result.rows[0].id;
            const SdgGoalsSql = {
                text: `INSERT INTO patent_submission_sdg_goals (patent_submission_grant_id, sdg_goals_id) VALUES ($1, $2) RETURNING id`,
                values: [patentId, element]
            };

            console.log('SdgGoalsSql ===>>>>>', SdgGoalsSql);
            return researchDbW.query(SdgGoalsSql);
        });
    });

    const insertInventionTypePromises = inventionIdsArray.map((element) => {
        return patnetSubmissionDataPromise.then((result) => {
            const patentId = result.rows[0].id;
            const patentInventionsSql = {
                text: `INSERT INTO patent_submission_invention_type (patent_submission_grant_id, invention_type_id) VALUES ($1, $2) RETURNING id`,
                values: [patentId, element]
            };

            console.log('patentInventionsSql ===>>>>>', patentInventionsSql);
            return researchDbW.query(patentInventionsSql);
        });
    });

    const insertPatentStatusPromises = patentStatusArray.map((element) => {
        return patnetSubmissionDataPromise.then((result) => {
            const patentId = result.rows[0].id;
            const patentStatusSql = {
                text: `INSERT INTO patent_submission_stage_status (patent_submission_grant_id, pantent_stage_status_id) VALUES ($1, $2) RETURNING id`,
                values: [patentId, element] 
            };
            console.log('patentStatusSql ===>>>>>', patentStatusSql);
            return researchDbW.query(patentStatusSql);
        });
    });

    // Waiting for all promises to resolve
    return Promise.all([
        patnetSubmissionDataPromise,
        ...insertFacultyPromises,
        ...insertDsgGoalsPromises,
        ...insertInventionTypePromises,
        ...insertPatentStatusPromises
    ]).then(([patnetSubmissionData, patentstage, ...results]) => {
        const patentId = patnetSubmissionData.rows[0].id;
        const rowCount = patnetSubmissionData.rowCount;
        const insertFacultyIds = results.slice(0, FacultydataArray.length).map(result => result.rows[0].id);
        const insertSdgGoalsIds = results.slice(FacultydataArray.length, FacultydataArray.length + sdgGoalsIdArray.length).map(result => result.rows[0].id);
        const insertInventionTypeIds = results.slice(FacultydataArray.length + sdgGoalsIdArray.length, FacultydataArray.length + sdgGoalsIdArray.length + inventionIdsArray.length).map(result => result.rows[0].id);
        const patentStatusId = results.slice(FacultydataArray.length + sdgGoalsIdArray.length + inventionIdsArray.length, FacultydataArray.length + sdgGoalsIdArray.length + inventionIdsArray.length + patentStatusArray.length).map(result => result.rows[0].id);

        return {
            status: "Done",
            message: 'Record Inserted Successfully',
            patentId : patentId,
            patentstage : patentstage,
            patentGrantIds: insertFacultyIds,
            sdgGoalsIds : insertSdgGoalsIds,
            inventionTypeIds : insertInventionTypeIds,
            patentStatusId : patentStatusId,
            rowCount : rowCount
        };
    }).catch((error) => {
        console.log('error ====>>>>', error);
        return { status: 'Failed', message: error.message, errorCode: error.code };
    });
};


module.exports.updatePatentsubmissionData = async (updatedPatentData, patentId, patentDataFiles, sdgGoalsIdArray, inventionIdsArray, FacultydataArray, patentStatusIdArray, userName) => {
    console.log('Data in models:', updatedPatentData);

    const { titleOfInvention, applicationNum, subMissionDate } = updatedPatentData;
    const supportingDocument = patentDataFiles || null;

    let baseQuery = `UPDATE patent_submission_grant SET innovation_title = $2, application_number = $3, grant_date = $4, updated_by = $5`;
    let documentsQuery = supportingDocument ? `, supporting_documents = $6` : '';
    let queryText = `${baseQuery}${documentsQuery} WHERE id = $1`;

    let values = [patentId, titleOfInvention, applicationNum, subMissionDate, userName, supportingDocument].filter(Boolean);

    const patentsubmissonSql = {
        text: queryText,
        values: values
    };

    console.log('patentsubmissonSql:', patentsubmissonSql);

    const patentGrantSubmission = await researchDbW.query(patentsubmissonSql);

    const insertFacultyPromises = FacultydataArray.map(async faculty_id => {
        const existingRecord = await researchDbW.query({
          text: `SELECT id FROM patent_submission_faculty WHERE patent_submission_grant_id = $1 AND faculty_id = $2`,
          values: [patentId, faculty_id]
        });
      
        return existingRecord.rows.length === 0 ? (
          researchDbW.query({
            text: `INSERT INTO patent_submission_faculty (patent_submission_grant_id, faculty_id) VALUES ($1, $2) RETURNING id`,
            values: [patentId, faculty_id]
          })
        ) : (
          Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] })
        );
      });

    const insertSdgGoalsPromises = sdgGoalsIdArray.map(async sdg_goals_id => {
        const existingRecord = await researchDbW.query({
          text: `SELECT id FROM patent_submission_sdg_goals WHERE patent_submission_grant_id = $1 AND sdg_goals_id = $2`,
          values: [patentId, sdg_goals_id]
        });
      
        return existingRecord.rows.length === 0 ? (
          researchDbW.query({
            text: `INSERT INTO patent_submission_sdg_goals (patent_submission_grant_id, sdg_goals_id) VALUES ($1, $2) RETURNING id`,
            values: [patentId, sdg_goals_id]
          })
        ) : (
          Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] })
        );
      });

    const insertInventionTypePromises = inventionIdsArray.map(async invention_type_id => {
        const existingRecord = await researchDbW.query({
          text: `SELECT id FROM patent_submission_invention_type WHERE patent_submission_grant_id = $1 AND invention_type_id = $2`,
          values: [patentId, invention_type_id]
        });
      
        return existingRecord.rows.length === 0 ? (
          researchDbW.query({
            text: `INSERT INTO patent_submission_invention_type (patent_submission_grant_id, invention_type_id) VALUES ($1, $2) RETURNING id`,
            values: [patentId, invention_type_id]
          })
        ) : (
          Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] })
        );
      });

    const insertPatentStatusPromises = patentStatusIdArray.map(async pantent_stage_status_id => {
        const existingRecord = await researchDbW.query({
          text: `SELECT id FROM patent_submission_stage_status WHERE patent_submission_grant_id = $1 AND pantent_stage_status_id = $2`,
          values: [patentId, pantent_stage_status_id]
        });
      
        return existingRecord.rows.length === 0 ? (
          researchDbW.query({
            text: `INSERT INTO patent_submission_stage_status (patent_submission_grant_id, pantent_stage_status_id) VALUES ($1, $2) RETURNING id`,
            values: [patentId, pantent_stage_status_id]
          })
        ) : (
          Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] })
        );
      });

    const results = await Promise.all([
        patentGrantSubmission,
        ...insertFacultyPromises,
        ...insertSdgGoalsPromises,
        ...insertInventionTypePromises,
        ...insertPatentStatusPromises
    ]);

    const rowCount = patentGrantSubmission.rowCount;
    const insertFacultyIds = results.slice(1, 1 + FacultydataArray.length).map(result => result.rows[0].id);
    const insertSdgGoalsIds = results.slice(1 + FacultydataArray.length, 1 + FacultydataArray.length + sdgGoalsIdArray.length).map(result => result.rows[0].id);
    const insertInventionTypeIds = results.slice(1 + FacultydataArray.length + sdgGoalsIdArray.length, 1 + FacultydataArray.length + sdgGoalsIdArray.length + inventionIdsArray.length).map(result => result.rows[0].id);
    const patentStatusIds = results.slice(1 + FacultydataArray.length + sdgGoalsIdArray.length + inventionIdsArray.length, 1 + FacultydataArray.length + sdgGoalsIdArray.length + inventionIdsArray.length + patentStatusIdArray.length).map(result => result.rows[0].id);

    return {
        status: 'Done',
        message: 'Record Updated Successfully',
        patentId: patentId,
        patentstage: patentStatusIds, // Assuming this is the correct array to return
        patentGrantIds: insertFacultyIds,
        sdgGoalsIds: insertSdgGoalsIds,
        InventionTypeIds: insertInventionTypeIds,
        patentStatusId: patentStatusIds,
        rowCount: rowCount
    };
};



module.exports.deletePatentSubmissionData = async (patentId) => {
    console.log('Patent Id in Model:', patentId);
  
    // Delete records from child tables first patent_submission_invention_type

    // Delete records from child tables  patent_submission_invention_type
    const deletePatentInvention = {
            text: 'DELETE FROM patent_submission_invention_type WHERE patent_submission_grant_id = $1',
            values: [patentId]
    }
    console.log('deletePatentInvention ==>>>>', deletePatentInvention);

    // Delete records from child tables  patent_submission_sdg_goals
    const deleteSdgSql =   {
        text: 'DELETE FROM patent_submission_sdg_goals WHERE patent_submission_grant_id = $1',
        values: [patentId]
      }
      console.log('deleteSdgSql ==>>>>', deleteSdgSql);

    // Delete records from child tables  patent_submission_stage_status
    const deletePatentStatusSql = {
        text: 'DELETE FROM patent_submission_stage_status WHERE patent_submission_grant_id = $1',
        values: [patentId]
    }
    console.log('deletePatentStatusSql ==>>>>', deletePatentStatusSql);

    // Delete records from child tables  patent_submission_faculty
    const patentGrantFacultySql = {
        text: 'DELETE FROM patent_submission_faculty WHERE patent_submission_grant_id = $1',
        values: [patentId]
      }
    console.log('patentGrantFacultySql ==>>>>', patentGrantFacultySql);


    const patentSdgGoalData = await researchDbR.query(deleteSdgSql);
    const patentStagData = await researchDbR.query(deletePatentStatusSql);
    const patentInventionTypeData = await researchDbR.query(deletePatentInvention);
    const patentGrantFaculty = await researchDbR.query(patentGrantFacultySql)
    
    let deletePromises = [patentSdgGoalData, patentStagData, patentInventionTypeData, patentGrantFaculty];
  
    // Execute delete queries for child tables first
    return Promise.all(deletePromises)
      .then((results) => {
        // Once child records are deleted, delete the parent record
        return researchDbW.query({
          text: 'DELETE FROM patent_submission_grant WHERE id = $1',
          values: [patentId]
        });
      })
      .then((grantDeletionResult) => {
        return {
          status: 'Done',
          message: 'Record(s) Deleted Successfully',
          rowCount: grantDeletionResult.rowCount,
          facultyRowCount : patentGrantFaculty.rowCount,
          sdgGoalRowCount : patentSdgGoalData.rowCount,
          inventionRowCount : patentInventionTypeData.rowCount,
          statusRowCount : patentStagData.rowCount


        };
      })
      .catch((error) => {
        console.error('Error:', error.message);
        return {
          status: 'Failed',
          message: error.message,
          errorCode: error.code
        };
      });
  };
  
  
  


module.exports.viewPatentSubmission = async(patentId, userName) => {
    console.log('id' , patentId);

    let patentSubmissionSql = {
        text : `SELECT 
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
            f.address,
            f.employee_id,
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
        where  psg.id = $1 AND created_by = $2`,

     values : [patentId, userName]
    };
    console.log('sql qury for view', patentSubmissionSql);

    
    let sdgGoalSql = {
        text: `SELECT sg.id, sg.name
            FROM patent_submission_sdg_goals psg
            JOIN sdg_goals sg ON psg.sdg_goals_id = sg.id
            WHERE psg.patent_submission_grant_id = $1`,
        values : [patentId]
    };
    console.log('sdgGoalSql ===>>>>', sdgGoalSql)

    let inventionSql = {
        text: `select it.id, it.name  FROM patent_submission_invention_type pit
                JOIN invention_type it ON pit.invention_type_id = it.id
                WHERE pit.patent_submission_grant_id = $1 `,
        values : [patentId]
    };
    console.log('innovationTypeSql ===>>>>', inventionSql);

    let patentGrantFacultySql = {
        text: `SELECT
            f.faculty_name,
            f.designation,
            f.address,
            f.employee_id,
            ft.name AS faculty_type
        FROM
            patent_submission_faculty psf
        JOIN
            faculties f ON psf.faculty_id = f.id
        JOIN
            faculty_types ft ON f.faculty_type_id = ft.id
        WHERE
            psf.patent_submission_grant_id = $1`,

        values : [patentId]
    };
    console.log('patentGrantFacultySql ===>>>>', patentGrantFacultySql);


    const patentSubmissionDataView = await researchDbR.query(patentSubmissionSql);
    const facultyData = await researchDbR.query(patentGrantFacultySql);
    const sdgGoalsData = await researchDbR.query(sdgGoalSql);
    const inventionTypeData = await researchDbR.query(inventionSql);
    let promises = [patentSubmissionDataView, facultyData, sdgGoalsData, inventionTypeData];

    return Promise.all(promises)
      .then(([patentSubmissionDataView, facultyData, sdgGoalsData, inventionTypeData]) => {
        return {
          status: "Done",
          message: "Record Fecthed Successfully",
          patentData: patentSubmissionDataView.rows,
          rowCount: patentSubmissionDataView.rowCount,
          facultyData : facultyData.rows,
          sdgGoalsData : sdgGoalsData.rows,
          inventionTypeData : inventionTypeData.rows,
        };
      })
      .catch(error => {
        console.error('Error:', error.message); 
        return {
          status: "Failed",
          message: error.message,
          errorCode: error.code
        };
      });

}