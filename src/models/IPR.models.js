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
    const investorDetailsString = internalNamesString + externalNamesString;
    const {typeOfInvention, titleOfInvention, patentStage, applicationNum, patentFiledDate, patentPublishedDate, patentGrantDate, 
        patentPublishedNumber, patentGrantedNo, instituteAffiliation, nmimsCampus, nmimsSchool, applicantName} = IprData
    const authorNamestring = internalNamesString + externalNamesString;
    console.log('authorNamestring ===>>>>', authorNamestring);

    let iprSql = {
        text : `INSERT INTO IPR (type_of_invention, title_of_invention, patent_stage,
                patent_application_no, patent_filed_date, patent_published_date, patent_granted_date,
                patent_published_num, patent_granted_no, institute_affiliation, nmims_campus, nmims_school, applicants_name, investor_details, supporting_documents)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`,
        values : [typeOfInvention, titleOfInvention, patentStage, applicationNum, patentFiledDate, patentPublishedDate, patentGrantDate, 
            patentPublishedNumber, patentGrantedNo, instituteAffiliation, nmimsCampus, nmimsSchool, applicantName, investorDetailsString, iprFilesString]
        
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

module.exports.deleteIPRData = async(iprId) => {
    console.log('iprId in models ===>>>>', iprId);

    let sql = {
        text : `DELETE FROM IPR WHERE id = $1`,
        values : [iprId]
    }

    console.log('sql ===>>>>', sql);
    const deletedRecord = await researchDbW.query(sql);
    const promises = [deletedRecord];
    return Promise.all(promises).then(([deletedRecord]) => {
        return  { status : "Done" , message : "Record Deleted Successfully", rowCount : deletedRecord.rowCount}
    })
    .catch((error) => {
        return{status : "Failed" , message : error.message , errorCode : error.code}
    })
}

module.exports.updateIPRRecordData = async(iprId, updatedIPRData, iprFilesString, internalDetailsString, externalDetailsString,  existingDetailsString) => {

    const {typeOfInvention, titleOfInvention, patentStage, applicationNum, patentFiledDate, patentPublishedDate, patentGrantDate, 
        patentPublishedNumber, patentGrantedNo, instituteAffiliation, nmimsCampus, nmimsSchool, applicantName } = updatedIPRData;

    const investorDetailsString = internalDetailsString + externalDetailsString + existingDetailsString;
    const supportingDocuments = iprFilesString ? iprFilesString : null;

    let baseQuery = `UPDATE IPR  SET type_of_invention = $2, title_of_invention = $3, patent_stage = $4,
    patent_application_no = $5, patent_filed_date = $6, patent_published_date = $7, patent_granted_date = $8,
    patent_published_num = $9, patent_granted_no = $10, institute_affiliation = $11, nmims_campus = $12, nmims_school = $13, applicants_name = $14, investor_details = $15`;

    let documentsQuery =  supportingDocuments ? `, supporting_documents = $16` : '';
    let queryText = baseQuery + documentsQuery +  ` WHERE id = $1`;
    let values = [iprId, typeOfInvention, titleOfInvention, patentStage, applicationNum, patentFiledDate, patentPublishedDate, patentGrantDate, 
        patentPublishedNumber, patentGrantedNo, instituteAffiliation, nmimsCampus, nmimsSchool, applicantName, investorDetailsString, ...(supportingDocuments ? [supportingDocuments] : [])]


    let iprSql = {
        text : queryText,
        values : values
    }

    let externalEmpSql = externalDetailsString ? {
        text: `INSERT INTO external_emp(external_emp_name) VALUES ($1) RETURNING id`,
        values: [externalDetailsString],
     } : null

    console.log('sql ===>>>>>', iprSql);
    console.log('externalEmpSql ===>>>>', externalEmpSql);

    const externalEmpTable = externalEmpSql ? await researchDbW.query(externalEmpSql) : null;
    const iprTable = await researchDbW.query(iprSql);
    const promises = [externalEmpTable, iprTable];
    return Promise.all(promises).then(([externalEmpTable, iprTable]) => {
        return{status : 'Done', message : "Record Updated SuccessFully", externalEmpId : externalEmpTable !== null ? externalEmpTable.rows[0].id : null, iprTable : iprTable}
    })
    .catch((error) => {
        console.error('error ===>>>', error);
        return{status : 'Failed', message : error.message, errorCode : error.code}
    })

}

module.exports.iprRecordToBeViewed = async(iprId) => {
    let sql = {
        text : `SELECT type_of_invention, title_of_invention, patent_stage,
        patent_application_no, patent_filed_date, patent_published_date, patent_granted_date,
        patent_published_num, patent_granted_no, institute_affiliation, nmims_campus, nmims_school, applicants_name, investor_details, supporting_documents FROM IPR WHERE id = $1`,
        values : [iprId]
    }

    console.log('sql ===>>>>', sql);
    const viewIPRRecord = await researchDbW.query(sql);
    const promises = [viewIPRRecord];
    return Promise.all(promises).then(([viewIPRRecord]) => {
        return  { status : "Done" , message : "Record Viewed Successfully", rowCount : viewIPRRecord.rowCount, IPRData : viewIPRRecord.rows[0]}
    })
    .catch((error) => {
        return{status : "Failed" , message : error.message , errorCode : error.code}
    })

}