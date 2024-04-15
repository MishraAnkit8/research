const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchIPRData = async() => {
    let iPRSql = {
        text: `
            SELECT
                ipr.id AS ipr_id,
                ipr.patent_title,
                ipr.patent_application_number,
                ipr.applicant_name,
                ipr.patent_filed_date,
                ipr.patent_grant_date,
                ipr.patent_published_date,
                ipr.patent_publication_number,
                ipr.patent_grant_number,
                ipr.institutional_affiliation,
                string_agg(DISTINCT it.name, ', ') AS invention_types,
                string_agg(DISTINCT it.id::text, ', ') AS invention_types_id,
                string_agg(DISTINCT ps.name, ', ') AS patent_stage_statuses,
                string_agg(DISTINCT ps.id::text, ', ') AS patent_stage_id,
                string_agg(DISTINCT sd.documents_name, ', ') AS supporting_documents,
                string_agg(DISTINCT ns.school_name, ', ') AS associated_schools,
                string_agg(DISTINCT ns.id::text, ', ') AS school_id,
                string_agg(DISTINCT nc.campus_name, ', ') AS associated_campuses,
                string_agg(DISTINCT nc.id::text, ', ') AS campus_id
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
                ipr.id
        `
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

module.exports.InsetIPRDataModels = async (IprData, iprFilesNamesArray, FacultydataArray, schoolIdsArray, campusIdsArray, inventionTypeIdsArray, patentStatus) => {
    console.log('iprFilesString in models ====>>>>', iprFilesNamesArray);
    console.log('patentStatus ===>>>>>', patentStatus)
    const { titleOfInvention, applicationNum, applicantName, patentFiledDate, patentPublishedDate, patentGrantDate, 
        patentPublishedNumber, patentGrantedNo, instituteAffiliation} = IprData;

    let iprSql = {
        text: `INSERT INTO IPR (patent_title, patent_application_number, applicant_name, patent_filed_date, patent_published_date, patent_grant_date, patent_publication_number, patent_grant_number, institutional_affiliation)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        values: [titleOfInvention, applicationNum, applicantName, patentFiledDate, patentPublishedDate, patentGrantDate, 
            patentPublishedNumber, patentGrantedNo, instituteAffiliation]
    };

    const insertDocumentPromises = iprFilesNamesArray ? iprFilesNamesArray.map(async (fileName) => {
        const documentInsertSql = {
            text: `INSERT INTO supporting_documents (documents_name, created_at, updated_at) VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id`,
            values: [fileName]
        };
        const result = await researchDbW.query(documentInsertSql);
        return result.rows[0].id; 
    }) : null;

    const documentIds = await Promise.all(insertDocumentPromises);
    console.log('documentIds ====>>>>', documentIds);

    console.log('iprSql ====>>>>>>', iprSql);

    const iprResult = await researchDbW.query(iprSql);
    const iprId = iprResult.rows[0].id;
    const iprRowCount = iprResult.rowCount

    const insertIprDocuments = documentIds.map((element) => {
        const iprDocumentSql = {
            text: `INSERT INTO ipr_supporting_documents (ipr_id, supporting_documents_id) VALUES ($1, $2) RETURNING id`,
            values: [iprId, element]
        };
        console.log('iprDocumentSql ===>>>>>', iprDocumentSql);
        return researchDbW.query(iprDocumentSql);
    });
    
    const insertIprFacultyPromises = FacultydataArray.map((faculty_id) => {
        const iprFacultySql = {
            text: `INSERT INTO ipr_faculty (ipr_id, faculty_id) VALUES ($1, $2) RETURNING id`,
            values: [iprId, faculty_id]
        };
        console.log('iprFacultySql ===>>>>>', iprFacultySql);
        return researchDbW.query(iprFacultySql);
    });


    const insertNmimsCampusPromises = campusIdsArray.map((campusId) => {
        const iprCampusSql = {
            text: `INSERT INTO ipr_nmims_campus (ipr_id, campus_id) VALUES ($1, $2) RETURNING id`,
            values: [iprId, campusId] 
        };
        console.log('iprCampusSql ===>>>>>', iprCampusSql);
        return researchDbW.query(iprCampusSql);
    });

    const insertIprSchoolsPromises = schoolIdsArray.map((schoolId) => {
        const iprSchool = {
            text: `INSERT INTO ipr_nmims_school (ipr_id, school_id) VALUES ($1, $2) RETURNING id`,
            values: [iprId, schoolId] 
        };
        console.log('iprSchool ===>>>>>', iprSchool);
        return researchDbW.query(iprSchool);
    });

    const insertInventionTypePromises = inventionTypeIdsArray.map((element) => {
        const iprInventionsSql = {
            text: `INSERT INTO ipr_invention_type (ipr_id, invention_type_id) VALUES ($1, $2) RETURNING id`,
            values: [iprId, element]
        };
        console.log('iprInventionsSql ===>>>>>', iprInventionsSql);
        return researchDbW.query(iprInventionsSql);
    });

    const insertIprStatusPromises = patentStatus.map((element) => {
        const iprSatatusSql = {
            text: `INSERT INTO ipr_status_type (ipr_id, pantent_stage_status_id) VALUES ($1, $2) RETURNING id`,
            values: [iprId, element] 
        };
        console.log('iprSatatusSql ===>>>>>', iprSatatusSql);
        return researchDbW.query(iprSatatusSql);
    });

    const selectSchoolDataPromises = schoolIdsArray.map(async (schoolId) => {
        const schoolSql = {
            text: `SELECT * FROM nmims_school WHERE id = $1`,
            values: [schoolId]
        };
        const schoolResult = await researchDbR.query(schoolSql);
        return schoolResult.rows;
    });

    const selectCampusDataPromises = campusIdsArray.map(async (campusId) => {
        const campusSql = {
            text: `SELECT * FROM nmims_campus WHERE id = $1`,
            values: [campusId]
        };
        const campusResult = await researchDbR.query(campusSql);
        return campusResult.rows;
    });

    const selectInvetionTypePromises = inventionTypeIdsArray.map(async (inventionTypId) => {
        const inventionSql = {
            text: `SELECT name AS invention_type FROM invention_type WHERE id = $1`,
            values: [inventionTypId]
        };
        const invetionResult = await researchDbR.query(inventionSql);
        return invetionResult.rows;
    });

    const selectPatentSatatusPromises = patentStatus.map(async (statusId) => {
        const statusSql = {
            text: `SELECT name AS status_name FROM pantent_stage_status WHERE id = $1`,
            values: [statusId]
        };
        const statusResult = await researchDbR.query(statusSql);
        return statusResult.rows;
    });

    // Waiting for all promises to resolve
    return Promise.all([
        ...insertIprDocuments,
        ...insertIprFacultyPromises,
        ...insertIprSchoolsPromises,
        ...insertNmimsCampusPromises,
        ...insertInventionTypePromises,
        ...insertIprStatusPromises,
        ...selectSchoolDataPromises,
        ...selectCampusDataPromises,
        ...selectInvetionTypePromises,
        ...selectPatentSatatusPromises,

    ]).then((results) => {
        console.log('Results:', results);
        const iprDocumentsIds = results.slice(0, iprFilesNamesArray.length).map(result => result?.rows[0]?.id);
        const insertIprFacultyIds = results.slice(iprFilesNamesArray.length, iprFilesNamesArray.length + FacultydataArray.length).map(result => result?.rows[0]?.id);
        const insertIprSchoolIds = results.slice(iprFilesNamesArray.length + FacultydataArray.length, iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length);
        const insertIprCampusIds = results.slice(iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length, iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length + campusIdsArray.length).map(result => result?.rows[0]?.id);
        const insertIprInventiontypeIds = results.slice(iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length + campusIdsArray.length, iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length + campusIdsArray.length + inventionTypeIdsArray.length).map(result => result?.rows[0]?.id);
        const insertIprStatusIds = results.slice(iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length + campusIdsArray.length + inventionTypeIdsArray.length, iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length + campusIdsArray.length + inventionTypeIdsArray.length + patentStatus.length).map(result => result?.rows[0]?.id);
        const schoolDataList = results.slice(iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length + campusIdsArray.length + inventionTypeIdsArray.length + patentStatus.length).map(result => result[0]);
        const campusList = results.slice(iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length + campusIdsArray.length + inventionTypeIdsArray.length + patentStatus.length).map(result => result[0]);
        const invetionList = results.slice(iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length + campusIdsArray.length + inventionTypeIdsArray.length + patentStatus.length).map(result => result[0]);
        const statusList = results.slice(iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length + campusIdsArray.length + inventionTypeIdsArray.length + patentStatus.length).map(result => result[0]);



        console.log('schoolDataList ===>>>>>', schoolDataList);
        console.log('campusList ===>>>>>', campusList);
        console.log('invetionList ===>>>>>', invetionList);
        console.log('statusList ===>>>>>', statusList);
        const schoolNames = schoolDataList.map(school => school?.school_name).filter(Boolean).join(',');
        const campusNames = campusList.map(campus => campus?.campus_name).filter(Boolean).join(',');
        const invetionTypeNames = invetionList.map(invetion => invetion?.invention_type).filter(Boolean).join(',');
        const statusTypeName = statusList.map(status => status?.status_name).filter(Boolean).join(',');
        console.log('invetionTypeNames ===>>>>', invetionTypeNames);
        console.log('statusTypeName ===>>>>', statusTypeName);


        return {
            status: "Done",
            message: 'Record Inserted Successfully',
            iprId: iprId,
            rowCount : iprRowCount,
            iprDocumentsIds: iprDocumentsIds,
            insertIprFacultyIds: insertIprFacultyIds,
            insertIprSchoolIds: insertIprSchoolIds,
            insertIprCampusIds: insertIprCampusIds,
            insertIprInventiontypeIds: insertIprInventiontypeIds,
            insertIprStatusIds: insertIprStatusIds,
            schoolNames : schoolNames,
            campusNames : campusNames,
            documentIds : documentIds,
            invetionTypeNames : invetionTypeNames,
            statusTypeName : statusTypeName
        };
    }).catch((error) => {
        console.log('Error:', error); 
        return { status: 'Failed', message: error.message, errorCode: error.code };
    });

};



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

module.exports.updateIPRRecordData = async(iprId, updatedIPRData,  iprFilesNamesArray, FacultydataArray, schoolIdsArray, campusIdsArray, inventionTypeIdsArray, patentStatus) => {
    console.log('data in models for updation ===>>>>', updatedIPRData);
    console.log('iprFilesNamesArray ===>>>>>>', iprFilesNamesArray);
    const {titleOfInvention, applicationNum, applicantName, patentFiledDate, patentPublishedDate, patentGrantDate, 
        patentPublishedNumber, patentGrantedNo, instituteAffiliation} = updatedIPRData;


    let iprSql =  {
        text  : `UPDATE IPR  SET patent_title = $2, patent_application_number = $3, applicant_name = $4, patent_filed_date = $5, patent_published_date = $6, patent_grant_date = $7, patent_publication_number = $8, patent_grant_number = $9, institutional_affiliation = $10
                WHERE id = $1`,
        values : [iprId, titleOfInvention, applicationNum, applicantName, patentFiledDate, patentPublishedDate, patentGrantDate, 
                patentPublishedNumber, patentGrantedNo, instituteAffiliation]
    }
    console.log('iprSql ===>>>>', iprSql);
    const iprResult = await researchDbW.query(iprSql);
    const iprRowCount = iprResult.rowCount;

    const insertDocumentPromises = iprFilesNamesArray ? iprFilesNamesArray.map(async (fileName) => {
        const documentInsertSql = {
            text: `INSERT INTO supporting_documents (documents_name, created_at, updated_at) VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id`,
            values: [fileName]
        };
        const result = await researchDbW.query(documentInsertSql);
        return result.rows[0].id; 
    }) : null;

    const documentIds = await Promise.all(insertDocumentPromises);
    console.log('documentIds ====>>>>', documentIds);
   

    const insertIprDocuments = documentIds ? documentIds.map((element) => {
        const iprDocumentSql = {
            text: `INSERT INTO ipr_supporting_documents (ipr_id, supporting_documents_id) VALUES ($1, $2) RETURNING id`,
            values: [iprId, element]
        };
        console.log('iprDocumentSql ===>>>>>', iprDocumentSql);
        return researchDbW.query(iprDocumentSql);
    }) : null;

    const insertIprStatusPromises = patentStatus ? patentStatus.map(async pantent_stage_status_id => {
        const existingRecord = await researchDbW.query({
          text: `SELECT id FROM ipr_status_type WHERE ipr_id = $1 AND pantent_stage_status_id = $2`,
          values: [iprId, pantent_stage_status_id]
        });
      
        return existingRecord.rows.length === 0 ? (
          researchDbW.query({
            text: `INSERT INTO ipr_status_type (ipr_id, pantent_stage_status_id) VALUES ($1, $2) RETURNING id`,
            values: [iprId, pantent_stage_status_id]
          })
        ) : (
          Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] })
        );
      }) : null;


    const insertInventionTypePromises = inventionTypeIdsArray.map(async invention_type_id => {
        const existingRecord = await researchDbW.query({
          text: `SELECT id FROM ipr_invention_type WHERE ipr_id = $1 AND invention_type_id = $2`,
          values: [iprId, invention_type_id]
        });
      
        return existingRecord.rows.length === 0 ? (
          researchDbW.query({
            text: `INSERT INTO ipr_invention_type (ipr_id, invention_type_id) VALUES ($1, $2) RETURNING id`,
            values: [iprId, invention_type_id]
          })
        ) : (
          Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] })
        );
      });


    const insertIprFacultyPromises = FacultydataArray ? FacultydataArray.map( async faculty_id => {
        const existingRecord = await researchDbW.query({
          text: `SELECT id FROM ipr_faculty WHERE ipr_id = $1 AND faculty_id = $2`,
          values: [iprId, faculty_id]
        });
      
        return existingRecord.rows.length === 0 ? (
          researchDbW.query({
            text: `INSERT INTO ipr_faculty (ipr_id, faculty_id) VALUES ($1, $2) RETURNING id`,
            values: [iprId, faculty_id]
          })
        ) : (
          Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] })
        );
      }) : null;


    const insertNmimsCampusPromises = campusIdsArray ? campusIdsArray.map( async campusId => {
        const existingRecord = await researchDbW.query({
          text: `SELECT id FROM ipr_nmims_campus WHERE ipr_id = $1 AND campus_id = $2`,
          values: [iprId, campusId]
        });
      
        return existingRecord.rows.length === 0 ? (
          researchDbW.query({
            text: `INSERT INTO ipr_nmims_campus (ipr_id, campus_id) VALUES ($1, $2) RETURNING id`,
            values: [iprId, campusId]
          })
        ) : (
          Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] })
        );
      }) : null;


    const insertIprSchoolsPromises = schoolIdsArray ? schoolIdsArray.map( async schoolId => {
        const existingRecord = await researchDbW.query({
          text: `SELECT id FROM ipr_nmims_school WHERE ipr_id = $1 AND school_id = $2`,
          values: [iprId, schoolId]
        });
      
        return existingRecord.rows.length === 0 ? (
          researchDbW.query({
            text: `INSERT INTO ipr_nmims_school (ipr_id, school_id) VALUES ($1, $2) RETURNING id`,
            values: [iprId, schoolId]
          })
        ) : (
          Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] })
        );
      }) : null;

    const selectSchoolDataPromises = schoolIdsArray ? schoolIdsArray.map(async (schoolId) => {
        const schoolSql = {
            text: `SELECT * FROM nmims_school WHERE id = $1`,
            values: [schoolId]
        };
        const schoolResult = await researchDbR.query(schoolSql);
        return schoolResult.rows;
    }) : null;

    const selectCampusDataPromises = campusIdsArray ? campusIdsArray.map(async (campusId) => {
        const campusSql = {
            text: `SELECT * FROM nmims_campus WHERE id = $1`,
            values: [campusId]
        };
        const campusResult = await researchDbR.query(campusSql);
        return campusResult.rows;
    }) : null;

    const selectInvetionTypePromises = inventionTypeIdsArray ? inventionTypeIdsArray.map(async (inventionTypId) => {
        const inventionSql = {
            text: `SELECT name AS invention_type FROM invention_type WHERE id = $1`,
            values: [inventionTypId]
        };
        const invetionResult = await researchDbR.query(inventionSql);
        return invetionResult.rows;
    }) : null;

    const selectPatentSatatusPromises = patentStatus ? patentStatus.map(async (statusId) => {
        const statusSql = {
            text: `SELECT name AS status_name FROM pantent_stage_status WHERE id = $1`,
            values: [statusId]
        };
        const statusResult = await researchDbR.query(statusSql);
        return statusResult.rows;
    }) : null;

    // Waiting for all promises to resolve
    return Promise.all([
        ...insertIprDocuments,
        ...insertIprFacultyPromises,
        ...insertIprSchoolsPromises,
        ...insertNmimsCampusPromises,
        ...insertInventionTypePromises,
        ...insertIprStatusPromises,
        ...selectSchoolDataPromises,
        ...selectCampusDataPromises,
        ...selectInvetionTypePromises,
        ...selectPatentSatatusPromises,

    ]).then((results) => {
        console.log('Results:', results);
        const iprDocumentsIds = results.slice(0, iprFilesNamesArray.length).map(result => result?.rows[0]?.id);
        const insertIprFacultyIds = results.slice(iprFilesNamesArray.length, iprFilesNamesArray.length + FacultydataArray.length).map(result => result?.rows[0]?.id);
        const insertIprSchoolIds = results.slice(iprFilesNamesArray.length + FacultydataArray.length, iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length);
        const insertIprCampusIds = results.slice(iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length, iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length + campusIdsArray.length).map(result => result?.rows[0]?.id);
        const insertIprInventiontypeIds = results.slice(iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length + campusIdsArray.length, iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length + campusIdsArray.length + inventionTypeIdsArray.length).map(result => result?.rows[0]?.id);
        const insertIprStatusIds = results.slice(iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length + campusIdsArray.length + inventionTypeIdsArray.length, iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length + campusIdsArray.length + inventionTypeIdsArray.length + patentStatus.length).map(result => result?.rows[0]?.id);
        const schoolDataList = results.slice(iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length + campusIdsArray.length + inventionTypeIdsArray.length + patentStatus.length).map(result => result[0]);
        const campusList = results.slice(iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length + campusIdsArray.length + inventionTypeIdsArray.length + patentStatus.length).map(result => result[0]);
        const invetionList = results.slice(iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length + campusIdsArray.length + inventionTypeIdsArray.length + patentStatus.length).map(result => result[0]);
        const statusList = results.slice(iprFilesNamesArray.length + FacultydataArray.length + schoolIdsArray.length + campusIdsArray.length + inventionTypeIdsArray.length + patentStatus.length).map(result => result[0]);

        console.log('schoolDataList ===>>>>>', schoolDataList);
        console.log('campusList ===>>>>>', campusList);
        console.log('invetionList ===>>>>>', invetionList);
        console.log('statusList ===>>>>>', statusList);
        const schoolNames = schoolDataList.map(school => school?.school_name).filter(Boolean).join(',');
        const campusNames = campusList.map(campus => campus?.campus_name).filter(Boolean).join(',');
        const invetionTypeNames = invetionList.map(invetion => invetion?.invention_type).filter(Boolean).join(',');
        const statusTypeName = statusList.map(status => status?.status_name).filter(Boolean).join(',');
        console.log('invetionTypeNames ===>>>>', invetionTypeNames);
        console.log('statusTypeName ===>>>>', statusTypeName);


        return {
            status: "Done",
            message: 'Record Updated Successfully',
            iprId: iprId,
            rowCount : iprRowCount,
            iprDocumentsIds: iprDocumentsIds,
            insertIprFacultyIds: insertIprFacultyIds,
            insertIprSchoolIds: insertIprSchoolIds,
            insertIprCampusIds: insertIprCampusIds,
            insertIprInventiontypeIds: insertIprInventiontypeIds,
            insertIprStatusIds: insertIprStatusIds,
            schoolNames : schoolNames,
            campusNames : campusNames,
            documentIds : documentIds,
            invetionTypeNames : invetionTypeNames,
            statusTypeName : statusTypeName
        };
    }).catch((error) => {
        console.log('Error:', error); 
        return { status: 'Failed', message: error.message, errorCode: error.code };
    });



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