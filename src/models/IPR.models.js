const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchIPRData = async() => {
    let iPRSql = {
        text: `SELECT * FROM IPR ORDER BY id`
    };
    let internalEmpSql = {
        text: `SELECT * FROM employee_table ORDER BY id`
    };
    
    let externalEmpSql = {
        text: `SELECT * FROM external_emp ORDER BY id`
    }

    console.log('externalEmpSql ===<>>>>', externalEmpSql);
    console.log('iPRSql ===>>>', iPRSql);
    console.log('internalEmpSql ===>>>', internalEmpSql)
    const iprPromise = researchDbR.query(iPRSql);
    const internalEmpPromise = researchDbR.query(internalEmpSql);
    const externalEmpPromise = researchDbR.query(externalEmpSql)

    const [IPRList, internalEmpList, externalEmpList] = await Promise.all([iprPromise, internalEmpPromise, externalEmpPromise]);

    return {
        IPRList: IPRList,
        internalEmpList: internalEmpList,
        externalEmpList : externalEmpList
    };
}

module.exports.InsetIPRDataModels = async (IprData, iprFilesString, internalNamesString, externalNamesString) => {
    console.log('iprFilesString in models ====>>>>', iprFilesString);
    const authorName = internalNamesString + externalNamesString;
    const {typeOfInvention, titleOfInvention, patentStage, applicationNum, patentFiledDate, patentPublishedDate, patentGrantDate, 
        patentPublishedNumber, patentGrantedNo, instituteAffiliation, nmimsCampus, nmimsSchool} = IprData
    const authorNamestring = internalNamesString + externalNamesString;
    console.log('authorNamestring ===>>>>', authorNamestring);

    let iprSql = {
        text : `INSERT INTO IPR (type_of_invention, title_of_invention, patent_stage,
                patent_application_no, patent_filed_date, patent_published_date, patent_granted_date,
                patent_published_num, patent_granted_no, institute_affiliation, nmims_campus, nmims_school, applicants_name, supporting_documents)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id`,
        values : [typeOfInvention, titleOfInvention, patentStage, applicationNum, patentFiledDate, patentPublishedDate, patentGrantDate, 
            patentPublishedNumber, patentGrantedNo, instituteAffiliation, nmimsCampus, nmimsSchool, authorName, iprFilesString]
        
    }

    const externalEmpSql = externalNamesString
    ? {
        text: `INSERT INTO external_emp(external_emp_name) VALUES ($1) RETURNING id`,
        values: [externalNamesString],
      }
    : null;

    console.log("externalEmpSql ===>>>", externalEmpSql);
    console.log("iprSql ==>>", iprSql);
    const externalEmpTable = externalEmpSql != null ? researchDbW.query(externalEmpSql) : null;
    const IprTable = researchDbW.query(iprSql);
    const promises = [externalEmpTable, IprTable];
    return Promise.all(promises).then(([externalEmpTable, IprTable]) => {
        return {status : "Done", message : "Record Inserted Successfully", externalEmpId : externalEmpSql !== null ? externalEmpTable.rows[0].id : null,  iprId : IprTable.rows[0].id, rowCount : IprTable.rowCount}
    })
    .catch((error) => {
        console.log('error ====>>>>', error)
        return{status : 'Failed' , message : error.message , errorCode : error.code}
    })

}