const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchPatentSubMissionForms = async() => {
    let patentSubmissionSql = {
        text: `SELECT 
                    psg.id AS patent_submission_grant_id,
                    psg.innovation_title,
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
                    ORDER BY psg.id`
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
    

    const patentSubmissionsData = researchDbR.query(patentSubmissionSql);
    const internalFacultyData = researchDbR.query(internalEmpSql);
    const patentSdgGoalData = researchDbR.query(sdgGoalSql);
    const patentStagData = researchDbR.query(patentStageSql);
    const patentInventionTypeData = researchDbR.query(innovationTypeSql);
    const patentData = researchDbR.query(patentGrantsubmission);
    const internalPatentFacultyId = researchDbR.query(patentInternalFacultyIds);
    const externalPatentFacultyId = researchDbR.query(patentGrantExternalsql);
    const patentGrantFacultyIds = researchDbR.query(patentGrantSql)

    const promises = [patentData, patentStagData, patentSubmissionsData, internalFacultyData, patentSdgGoalData, patentInventionTypeData, patentData, internalPatentFacultyId, externalPatentFacultyId, patentGrantFacultyIds];
    return Promise.all(promises).then(([patentData, patentStagData, patentSubmissionsData, internalFacultyData, patentSdgGoalData, patentInventionTypeData, internalPatentFacultyId, externalPatentFacultyId, patentGrantFacultyIds]) => {
      return  { status : "Done" , message : "Record Fetched Successfully" ,  rowCount : patentData.rowCount, patentData : patentData.rows, patentStagData : patentStagData.rows, patentSubmissionsData : patentSubmissionsData.rows, 
      internalFacultyData : internalFacultyData.rows, patentSdgGoalData : patentSdgGoalData.rows, patentInventionTypeData : patentInventionTypeData.rows, patentData : patentData.rows, internalPatentFacultyId : internalPatentFacultyId.rows, externalPatentFacultyId : externalPatentFacultyId.rows,
      patentGrantFacultyIds : patentGrantFacultyIds.rows};
  })
  .catch((error) => {
      return{status : "Failed" , message : error.message , errorCode : error.code}
  }) 

    // const [patentSubmissionsResult, internalEmpList, externalEmpList] = await Promise.all([patentSubmissionsPromise, internalEmpPromise, externalEmpPromise]);

    // return {
    //     patentSubmissions: patentSubmissionsResult,
    //     internalEmpList: internalEmpList,
    //     externalEmpList : externalEmpList
    // };
}

module.exports.insertPatentData = async(patentData, patentDataFilesString, internalNamesString, externalNamesString) => {
    console.log('patentData inside models ===>>>', patentData)
    const authorNamestring = internalNamesString + externalNamesString;
    console.log('authorNamestring === >>>.', authorNamestring)
    const {typeOfInvention, titleOfInvention, patentStage, sdgGoals, applicationNum, subMissionDate} = patentData;
   
    console.log('patentDataFilesString ==>', patentDataFilesString)
    //query for insert patent submission form
    let patentDataSql = {
        text : `INSERT INTO  patent_submissions (type_of_invention, title_of_invention,  patent_stage, sdg_goals, application_no, date, author_type, patent_file) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        values : [typeOfInvention, titleOfInvention, patentStage, sdgGoals, applicationNum, subMissionDate, authorNamestring, patentDataFilesString]
    }
   //if externalNamesString insert external_emp table 
    const externalEmpSql = externalNamesString
    ? {
        text: `INSERT INTO external_emp(external_emp_name) VALUES ($1) RETURNING id`,
        values: [externalNamesString],
      }
    : null;
    console.log("externalEmpSql ===>>>", externalEmpSql);
    console.log("patentDataSql ==>>", patentDataSql);
    const externalEmpTable = externalEmpSql != null ? researchDbW.query(externalEmpSql) : null;
    const patentSubmissionTable = researchDbW.query(patentDataSql);
    const promises = [externalEmpTable, patentSubmissionTable];
    return Promise.all(promises).then(([externalEmpTable, patentSubmissionTable]) => {
        return {status : "Done", message : "Record Inserted Successfully", externalEmpId : externalEmpSql !== null ? externalEmpTable.rows[0].id : null,  patentId : patentSubmissionTable.rows[0].id, rowCount : patentSubmissionTable.rowCount}
    })
    .catch((error) => {
        console.log('error ====>>>>', error)
        return{status : 'Failed' , message : error.message , errorCode : error.code}
    })
};

module.exports.updatePatentsubmissionData = async(updatedPatentData, patentId, patentDataFiles, internalNamesString, externalNamesString, existingNameString) => {
    const authorNameString = internalNamesString + externalNamesString + existingNameString;
    const supportingDocuments = patentDataFiles ? patentDataFiles : null;
    const {typeOfInvention, titleOfInvention, patentStage, sdgGoals, applicationNum, subMissionDate} = updatedPatentData;
    console.log('authorNameString in models ====>>>>', authorNameString);

    let baseQuery = `UPDATE patent_submissions  SET type_of_invention = $2,  title_of_invention = $3, patent_stage = $4, sdg_goals = $5, 
                   application_no = $6, date = $7, author_type =$8`;
    
    //if file is there
    let documentsQuery =  patentDataFiles ? `, patent_file = $9` : '';
    let queryText = baseQuery + documentsQuery +  ` WHERE id = $1`;

    let values = [patentId, typeOfInvention, titleOfInvention, patentStage, sdgGoals, applicationNum, subMissionDate, authorNameString, ...(supportingDocuments ? [supportingDocuments] : [])]
    let patentsubmissonSql = {
        text : queryText,
        values : values
    }

    let externalEmpSql = externalNamesString ? {
        text: `INSERT INTO external_emp(external_emp_name) VALUES ($1) RETURNING id`,
        values: [externalNamesString],
     } : null
    console.log('patentsubmissonSql ===>>>', patentsubmissonSql);

    console.log('externalEmp ===>>>', externalEmpSql)

    const externalEmpTable = externalEmpSql ? await researchDbW.query(externalEmpSql) : null;
    const patentSubmissionTable = await researchDbW.query(patentsubmissonSql);
    const promises = [externalEmpTable, patentSubmissionTable];
    return Promise.all(promises).then(([externalEmpTable, patentSubmissionTable]) => {
        return{status : 'Done', message : "Record Updated SuccessFully", externalEmpId : externalEmpTable !== null ? externalEmpTable.rows[0].id : null, patentSubmissionTable : patentSubmissionTable}
    })
    .catch((error) => {
        console.error('error ===>>>', error);
        return{status : 'Failed', message : error.message, errorCode : error.code}
    })
}

module.exports.deletePatentSubmissionData = async(patentId) => {
    console.log('patent Id  in Model >>', patentId)
    let sql = {
        text : `DELETE FROM patent_submissions WHERE id = $1`,
        values : [patentId]
    }
     console.log('sql ===>>>', sql)
    const deletedRecord = await researchDbW.query(sql);
    const promises = [deletedRecord];
    return Promise.all(promises).then(([deletedRecord]) => {
        return  { status : "Done" , message : "Record Deleted Successfully", rowCount : deletedRecord.rowCount}
    })
    .catch((error) => {
        return{status : "Failed" , message : error.message , errorCode : error.code}
    })
}

module.exports.viewPatentSubmission = async(patentId) => {
    console.log('id' , patentId)
    let sql = {
        text : `SELECT type_of_invention, title_of_invention,  patent_stage, sdg_goals, application_no, TO_CHAR(date, 'DD-MM-YYYY') as date, author_type, patent_file FROM patent_submissions WHERE id = $1`,
        values : [patentId]
    }
    console.log('sql qury for view', sql);
    return researchDbR.query(sql);
}