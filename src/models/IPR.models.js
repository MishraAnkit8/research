const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchIPRData = async() => {
    let iPRSql = {
        text: `SELECT
        ipr.id AS ipr_id,
        ipr.patent_title,
        ipr.patent_application_number,
        ipr.applicant_name,
        ipr.patent_filed_date,
        ipr.patent_published_date,
        ipr.patent_publication_number,
        ipr.patent_grant_number,
        ipr.institutional_affiliation,
        string_agg(DISTINCT it.name, ', ') AS invention_types,
        string_agg(DISTINCT ps.name, ', ') AS patent_stage_statuses,
        string_agg(DISTINCT sd.documents_name, ', ') AS supporting_documents,
        string_agg(DISTINCT ns.school_name, ', ') AS associated_schools,
        string_agg(DISTINCT nc.campus_name, ', ') AS associated_campuses
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
        ipr_supporting_documents isd ON ipr.id = isd.ipr_id
    LEFT JOIN
        supporting_documents sd ON isd.supporting_documents_id = sd.id
    LEFT JOIN
        ipr_nmims_school ins ON ipr.id = ins.ipr_id
    LEFT JOIN
        nmims_school ns ON ins.school_id = ns.id
    LEFT JOIN
        ipr_nmims_campus inc ON ipr.id = inc.ipr_id
    LEFT JOIN
        nmims_campus nc ON inc.campus_id = nc.id
    GROUP BY
        ipr.id,
        ipr.patent_title,
        ipr.patent_application_number,
        ipr.applicant_name,
        ipr.patent_filed_date,
        ipr.patent_published_date,
        ipr.patent_publication_number,
        ipr.patent_grant_number,
        ipr.institutional_affiliation
    ORDER BY
        ipr.id`
    };

    let internalEmpSql = {
        text: `select *  FROM faculties WHERE faculty_type_id = 1`
    };
    
     let inventionTypeSql = {
        text: `select *  FROM invention_type ORDER BY id`
    };

    let patentStageSql = {
        text: `select *  FROM pantent_stage_status ORDER BY id`
    };

    let supportingoDcumentsSql = {
        text: `select *  FROM supporting_documents ORDER BY id`
    };

    let nmimsSchoolSql = {
        text: `select *  FROM nmims_school ORDER BY id`
    };

    let nmimsCampusSql = {
        text: `select *  FROM nmims_campus ORDER BY id`
    };

    let iprFacultySql = {
        text: `select *  FROM ipr_faculty ORDER BY id`
    };
    
    let iprInventionTypeSql = {
        text: `select *  FROM ipr_invention_type ORDER BY id`
    };

    let iprPatentStageSql = {
        text: `select *  FROM ipr_status_type ORDER BY id`
    };

    let iprDocumnetsSql = {
        text: `select *  FROM ipr_supporting_documents ORDER BY id`
    };

    let iprNmimsSchoolSql = {
        text: `select *  FROM ipr_nmims_school ORDER BY id`
    };

    let iprNmimsCampusSql = {
        text: `select *  FROM ipr_nmims_campus ORDER BY id`
    };

    console.log('iPRSql ===>>>', iPRSql);
    console.log('internalEmpSql ===>>>', internalEmpSql)
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

    
    const promises = [iprPromise, internalEmpPromise, inventionTypePromises, statusPromises, nmimsSchool, nmimsCampus, iprDocuments, iprCampus,
        iprSchool, iprdocuments, iprSatatus, iprInvetiontype, iprFaculty];

        return Promise.all(promises).then(([iprPromise, internalEmpPromise, inventionTypePromises, statusPromises, nmimsSchool, nmimsCampus, iprDocuments, iprCampus,
            iprSchool, iprdocuments, iprSatatus, iprInvetiontype, iprFaculty]) => {
                return{status : "Done" , message : "Record Fetched Successfully", rowCount : iprPromise.rowCount, iprData : iprPromise.rows,
                internalEmpList : internalEmpPromise.rows, inventionTypData : inventionTypePromises.rows, patentStatus : statusPromises.rows,
                nmimsSchoolList : nmimsSchool.rows, nmimsCampusList : nmimsCampus.rows, supportingdocumnets : iprDocuments.rows, 
                iprCampus : iprCampus.rows, iprSchool : iprSchool.rows, iprdocuments : iprdocuments.rows, iprSatatus : iprSatatus.rows, iprInvetiontype : iprInvetiontype.rows, iprFaculty : iprFaculty.rows}
            })
            .catch((error) => {
                return{status : "Failed" , message : error.message , errorCode : error.code}
            }) 
           
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