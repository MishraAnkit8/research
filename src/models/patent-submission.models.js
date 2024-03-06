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

module.exports.insertPatentData = async(patentData, patentDataBaseFiles) => {
    console.log('patentData inside models ===>>>', patentData)
    const externalEmpName = patentData.externalAuthors;
    console.log('externalEmpName ====>>>>>', externalEmpName);
    const internalAuthors = patentData.internalAuthors;
    console.log('internalAuthors ====>>>', internalAuthors);
    const authorName = externalEmpName ?? internalAuthors;
    console.log('authorName === >>>.', authorName)
    const {typeOfInvention, titleOfInvention, patentStage, sdgGoals, applicationNum, subMissionDate} = patentData;
   
    console.log('file ==>', patentDataBaseFiles)
    console.log("patentData::::::", patentData)
    let patentDataSql = {
        text : `INSERT INTO  patent_submissions (type_of_invention, title_of_invention,  patent_stage, sdg_goals, application_no, date, author_type, patent_file) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        values : [typeOfInvention, titleOfInvention, patentStage, sdgGoals, applicationNum, subMissionDate, authorName, patentDataBaseFiles]
    }
   
    if (externalEmpName) {
      let externalEmpSql = {
        text: `INSERT INTO external_emp(external_emp_name) VALUES ($1) RETURNING id`,
        values: [externalEmpName],
      };
    console.log("externalEmpSql ===>>>", externalEmpSql);
    console.log("patentDataSql ==>>", patentDataSql);
    const externalEmpTable = researchDbW.query(externalEmpSql);
    const patentSubmissionTable = researchDbW.query(patentDataSql);
    const [patentTable, externalEmp] = await Promise.all([patentSubmissionTable, externalEmpTable]);
    return {
        externalEmp: externalEmp,
        patentTable: patentTable,
      };
    } else {
      console.log("patentDataSql ==>>", patentDataSql);
      const patentSubmissionTable = await researchDbW.query(patentDataSql);
      return {
        patentTable: patentSubmissionTable,
      };
    }
  

}

module.exports.updatePatentsubmissionData = async(updatedPatentData, patentId, patentDataFiles) => {
    const internalAuthors = updatedPatentData.internalAuthors;
    const externalAuthors = updatedPatentData.externalAuthors;
    const authorName = !internalAuthors && !externalAuthors ? updatedPatentData.authorName : internalAuthors ?? externalAuthors;
    if(patentDataFiles) {
        console.log('filename in models ==>', patentDataFiles )
        console.log('updatedPatentData in models ======>>>>>', updatedPatentData);
        const {typeOfInvention, titleOfInvention, patentStage, sdgGoals, applicationNum, subMissionDate} = updatedPatentData ;
        let sql = {
            text : `UPDATE patent_submissions  SET type_of_invention = $2,  title_of_invention = $3, patent_stage = $4, sdg_goals = $5, 
                  application_no = $6, date = $7, author_type =$8 , patent_file = $9 WHERE id = $1`,
            values : [patentId , typeOfInvention, titleOfInvention, patentStage, sdgGoals, applicationNum, subMissionDate, authorName, patentDataFiles]
        
        }
        console.log('Sql ==>>', sql);
        return researchDbW.query(sql)
    }
    else{
        console.log('updatedPatentData in models ======>>>>>', updatedPatentData);
        const {typeOfInvention, titleOfInvention, patentStage, sdgGoals, applicationNum, subMissionDate} = updatedPatentData 
        let patentSql = {
            text : `UPDATE patent_submissions  SET type_of_invention = $2,  title_of_invention = $3, patent_stage = $4, sdg_goals = $5, 
                  application_no = $6, date = $7, author_type =$8 WHERE id = $1`,
            values : [patentId, typeOfInvention, titleOfInvention, patentStage, sdgGoals, applicationNum, subMissionDate, authorName]
        
        }
        console.log('patentSql ==>>', patentSql);
        return researchDbW.query(patentSql);
    }
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