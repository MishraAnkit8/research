const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchPatentSubMissionForms = async() => {
    let patentSubmissionSql = {
        text: `SELECT * FROM patent_submissions ORDER BY id`
    };
    let internalEmpSql = {
        text: `SELECT * FROM employee_table ORDER BY id`
    };
    
    let externalEmpSql = {
        text: `SELECT * FROM external_emp ORDER BY id`
    }

    console.log('externalEmpSql ===<>>>>', externalEmpSql);
    console.log('patentSubmissionSql ===>>>', patentSubmissionSql);
    console.log('internalEmpSql ===>>>', internalEmpSql)
    const patentSubmissionsPromise = researchDbR.query(patentSubmissionSql);
    const internalEmpPromise = researchDbR.query(internalEmpSql);
    const externalEmpPromise = researchDbR.query(externalEmpSql)

    const [patentSubmissionsResult, internalEmpList, externalEmpList] = await Promise.all([patentSubmissionsPromise, internalEmpPromise, externalEmpPromise]);

    return {
        patentSubmissions: patentSubmissionsResult,
        internalEmpList: internalEmpList,
        externalEmpList : externalEmpList
    };
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
    console.log('sql qury for delete ==>', sql)
    return researchDbW.query(sql)
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