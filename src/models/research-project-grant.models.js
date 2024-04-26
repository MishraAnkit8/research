const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchResearchConsultancy = async(userName) => {
    let researchProjectSql = {
        text : `SELECT * FROM research_project_grant ORDER BY id`,
    }

    console.log('researchProjectSql ====>>>>', researchProjectSql);
    
    let reseachSql = {
        text : `SELECT 
        r.id AS project_id,
        r.title_of_project,
        r.grant_proposal_category,
        r.type_of_research_grant,
        r.thrust_area_of_research,
        r.name_of_funding_agency,
        r.funding_amount,
        r.status_of_research_project,
        r.submission_date,
        r.created_by AS created_by,
        r.updated_by AS updated_by,
        r.supporting_documents,
        f.id AS faculty_id,
        f.employee_id,
        f.faculty_name,
        f.designation,
        f.address,
        ft.name AS faculty_type
    FROM 
        research_project_grant AS r
    INNER JOIN 
        research_project_grant_faculty AS rf ON r.id = rf.research_project_grant_id
    LEFT JOIN 
        faculties AS f ON rf.faculty_id = f.id
    LEFT JOIN 
        faculty_types AS ft ON f.faculty_type_id = ft.id
    WHERE
       created_by = $1
    ORDER BY  r.id
        `,
    values : [userName]
    }

    let internalFacultySql = {
        text : `select *  FROM faculties WHERE faculty_type_id = 1`
    }

    let researchGrantInternalsql = {
        text : `SELECT rpgf.id AS research_project_grant_faculty_id, 
        rpgf.research_project_grant_id, 
        rpgf.faculty_id 
        FROM research_project_grant_faculty rpgf
        JOIN faculties f ON rpgf.faculty_id = f.id
        JOIN faculty_types ft ON f.faculty_type_id = ft.id
        WHERE ft.name = 'Internal' 
        ORDER BY rpgf.id`
    }

    let researchGrantExternalsql = {
        text : `SELECT rpgf.id AS research_project_grant_faculty_id, 
        rpgf.research_project_grant_id, 
        rpgf.faculty_id 
        FROM research_project_grant_faculty rpgf
        JOIN faculties f ON rpgf.faculty_id = f.id
        JOIN faculty_types ft ON f.faculty_type_id = ft.id
        WHERE ft.name = 'External' 
        ORDER BY rpgf.id`
    }

    let researchGrantsql = {
        text : `select id, research_project_grant_id, faculty_id from research_project_grant_faculty order by id`
    }

    

    console.log('researchGrantsql ====>>>>>', researchGrantsql);

    const researchPojectGrantFacultyData = await researchDbR.query(reseachSql);
    const reseachGrantIdsContainer = await researchDbR.query(researchGrantsql);
    const researchData = await researchDbR.query(researchProjectSql)
    const researchInternalIds = await researchDbR.query(researchGrantInternalsql);
    const researchGrantExternalIds = await researchDbR.query(researchGrantExternalsql);
    const facultTableData = await researchDbR.query(internalFacultySql);
    
    const promises = [researchData, researchPojectGrantFacultyData, facultTableData, reseachGrantIdsContainer, researchInternalIds, researchGrantExternalIds];
    return Promise.all(promises).then(([researchData]) => {
      return  { status : "Done" , message : "Record Fetched Successfully" ,  rowCount : researchData.rowCount, researchData : researchData.rows, facultTableData : facultTableData.rows, researchPojectGrantFacultyData : researchPojectGrantFacultyData.rows
      , reseachGrantIdsContainer : reseachGrantIdsContainer.rows, researchInternalIds : researchInternalIds.rows, researchGrantExternalIds : researchGrantExternalIds.rows};
  })
  .catch((error) => {
      return{status : "Failed" , message : error.message , errorCode : error.code}
  }) 
}


module.exports.insertResearhcProjectConstancyData = async (researchCunsultancyData, consultancyDataFiles, FacultydataArray, userName) => {
    console.log('researchCunsultancyData inside models ===>>>', researchCunsultancyData);

    const { grantProposalCategory, typeOfGrant, titleOfProject, thurstAreaOfResearch, fundingAgency, fundingAmount,
        statusOfResearchProject, submissionGrantDate } = researchCunsultancyData

    let researchSql = {
        text: `INSERT INTO research_project_grant (grant_proposal_category, type_of_research_grant, title_of_project, thrust_area_of_research, name_of_funding_agency, funding_amount, status_of_research_project, submission_date, supporting_documents, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        values: [grantProposalCategory, typeOfGrant, titleOfProject, thurstAreaOfResearch, fundingAgency, fundingAmount,
            statusOfResearchProject, submissionGrantDate, consultancyDataFiles, userName]
    };

    let promises = [];

    const researchProjectTable = researchDbW.query(researchSql);

    const insertFacultyPromises = FacultydataArray.map((faculty_id) => {
        return researchProjectTable.then((result) => {
            const consultantId = result.rows[0].id;
            const researchGrantFacultySql = {
                text: `INSERT INTO research_project_grant_faculty (research_project_grant_id, faculty_id) VALUES ($1, $2) RETURNING id`,
                values: [consultantId, faculty_id]
            };

            console.log('researchGrantFacultySql ===>>>>>', researchGrantFacultySql);
            return researchDbW.query(researchGrantFacultySql);
        });
    });
    
    promises.push(researchProjectTable);

    return Promise.all([
        researchProjectTable, ...insertFacultyPromises
    ]).then(([researchData, ...results]) => {
        const consultantId = researchData.rows[0].id;
        const rowCount = researchData.rowCount;
        const insertFacultyIds = results.slice(0, FacultydataArray.length).map(result => result.rows[0].id);

        return {
            status: "Done",
            message: 'Record Inserted Successfully',
            consultantId : consultantId,
            researchGrantFacultyIds: insertFacultyIds,
            rowCount : rowCount
        };
    }).catch((error) => {
        console.log('error ====>>>>', error);
        return { status: 'Failed', message: error.message, errorCode: error.code };
    });
}


module.exports.updateResearchConsultantData = async(consultantId, updatedResearchGrant, updatedConsultantFilesData, FacultydataArray, userName) => {
    console.log('data in models ===>>>>', updatedResearchGrant);
    const supportingDocuments = updatedConsultantFilesData ? updatedConsultantFilesData : null;
    console.log('supportingDocuments ====>>>>', supportingDocuments);

    const {grantProposalCategory, typeOfGrant, titleOfProject, thurstAreaOfResearch, fundingAgency, fundingAmount,
         statusOfResearchProject, submissionGrantDate} = updatedResearchGrant;
   

    let baseQuery = `UPDATE research_project_grant SET  grant_proposal_category = $2, type_of_research_grant = $3, title_of_project = $4, thrust_area_of_research = $5, name_of_funding_agency = $6, funding_amount = $7, status_of_research_project = $8, submission_date = $9, updated_by = $10`;
    let documentsQuery =  supportingDocuments ? `, supporting_documents = $11` : '';
    console.log('documentsQuery ====>>>>', documentsQuery);
    let queryText = baseQuery + documentsQuery +  ` WHERE id = $1`;
    console.log('queryText ===>>>>', queryText)

    let values = [consultantId, grantProposalCategory, typeOfGrant, titleOfProject, thurstAreaOfResearch, fundingAgency, fundingAmount,
         statusOfResearchProject, submissionGrantDate, userName,  ...(supportingDocuments ? [supportingDocuments] : [])];
    console.log('values ===>>>>', values)
    

    let sql  = {
        text : queryText,
        values : values
    }
    console.log('sql ====>>>>>>>', sql);

    let promises = [];

    // Iterate over each name and execute INSERT query
    const insertFacultyPromises = FacultydataArray.map(async faculty_id => {
        const existingRecord = await researchDbW.query({
          text: `SELECT id FROM research_project_grant_faculty WHERE research_project_grant_id = $1 AND faculty_id = $2`,
          values: [consultantId, faculty_id]
        });
      
        return existingRecord.rows.length === 0 ? (
          researchDbW.query({
            text: `INSERT INTO research_project_grant_faculty (research_project_grant_id, faculty_id) VALUES ($1, $2) RETURNING id`,
            values: [consultantId, faculty_id]
          })
        ) : (
          Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] })
        );
      });


    const researchProjectTable = await researchDbW.query(sql);
    const results = await Promise.all([
        researchProjectTable,
        ...insertFacultyPromises
    ]);

    const rowCount = researchProjectTable.rowCount;
    const insertFacultyIds = results.slice(1, 1 + FacultydataArray.length).map(result => result.rows[0].id);

    return {
        status: 'Done',
        message: 'Record Updated Successfully',
        consultantId: consultantId,
        researchGrantsIds: insertFacultyIds,
        rowCount: rowCount
    };

}

module.exports.deleteResearchConsultantData = async (consultantId) => {
    console.log('id in model ==>>', consultantId);
  
    const deleteFacultyAssignments = researchDbW.query({
      text: 'DELETE FROM research_project_grant_faculty WHERE research_project_grant_id = $1',
      values: [consultantId]
    });
  
    const deleteResearchGrant = deleteFacultyAssignments
      .then(() => researchDbW.query({
        text: 'DELETE FROM research_project_grant WHERE id = $1',
        values: [consultantId]
      }))
      .catch(error => {
        throw error; 
      });
  
    return Promise.all([deleteFacultyAssignments, deleteResearchGrant])
      .then(([deleteResearchGrantFaculty, deleteResearchGrant]) => {
        return {
          status: "Done",
          message: "Record Deleted Successfully",
          rowCount: deleteResearchGrant.rowCount,
          grantFacultyRowCount: deleteResearchGrantFaculty.rowCount
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
  };
  

module.exports.viewResearchConsultancy = async(consultantId, userName) => {
    console.log('consultantId in models ==>>', consultantId);
    let sql = {
        text : `SELECT
            rg.*,
            f.faculty_name,
            f.designation,
            f.address,
            f.employee_id
        FROM
            research_project_grant rg
        LEFT JOIN
            research_project_grant_faculty rgf ON rg.id = rgf.research_project_grant_id
        LEFT JOIN
            faculties f ON rgf.faculty_id = f.id
        WHERE
            rg.id = $1 AND created_by = $2
        `,
        values : [consultantId, userName]
    }
    console.log('sql ==>>', sql);
    const researchProjectData = await researchDbR.query(sql)
    return Promise.all([researchProjectData])
      .then(([researchProjectData]) => {
        return {
          status: "Done",
          message: "Record Fecthed Successfully",
          researchData: researchProjectData.rows,
          rowCount: researchProjectData.rowCount
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