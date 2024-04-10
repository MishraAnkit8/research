const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchResearchConsultancy = async() => {
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
    ORDER BY  r.id
        `
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

module.exports.insertResearhcProjectConstancyData = async (researchCunsultancyData, consultancyDataFiles, internalFacultyIdArray, externalFacultyData) => {
    console.log('researchCunsultancyData inside models ===>>>', researchCunsultancyData);

    const { grantProposalCategory, typeOfGrant, titleOfProject, thurstAreaOfResearch, fundingAgency, fundingAmount,
        statusOfResearchProject, submissionGrantDate } = researchCunsultancyData

    let researchSql = {
        text: `INSERT INTO research_project_grant (grant_proposal_category, type_of_research_grant, title_of_project, thrust_area_of_research, name_of_funding_agency, funding_amount, status_of_research_project, submission_date, supporting_documents) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        values: [grantProposalCategory, typeOfGrant, titleOfProject, thurstAreaOfResearch, fundingAgency, fundingAmount,
            statusOfResearchProject, submissionGrantDate, consultancyDataFiles]
    };

    let promises = [];

    // Iterate over each name and execute INSERT query
    for (let i = 0; i < externalFacultyData.length; i++) {
        const dataList = externalFacultyData[i];
        for (let j = 0; j < dataList.length; j++) {
            const facultiesSql = {
                text: `INSERT INTO faculties (faculty_type_id, faculty_name, designation, address)  VALUES ($1, $2, $3, $4) RETURNING id`,
                values: [2, dataList[j].facultyName, dataList[j].facultyDsg, dataList[j].facultyAddr]
            };
            console.log('facultiesSql ===>>>', facultiesSql); // Debugging purpose

            const facultyTableData = facultiesSql != null ? researchDbW.query(facultiesSql) : null;
            promises.push(facultyTableData);
        }
    }
    console.log('researchSql ====>>>>', researchSql);
    const researchProjectTable = researchDbW.query(researchSql);
    promises.push(researchProjectTable);

    return Promise.all(promises)
        .then((results) => {
            const facultyTableData = results.slice(0, externalFacultyData.length).filter(result => result !== null);
            const researchProjectTable = results[results.length - 1];

            const research_project_grant_id = researchProjectTable.rows[0].id;
            let faculty_ids = facultyTableData.map(result => result.rows[0].id);

            // Concatenate internal faculty IDs
            faculty_ids = faculty_ids.concat(internalFacultyIdArray);

            const insertPromises = faculty_ids.map(faculty_id => {
                const researchProjectGrantFacultySql = {
                    text: `INSERT INTO research_project_grant_faculty (research_project_grant_id, faculty_id) VALUES ($1, $2) RETURNING id`,
                    values: [research_project_grant_id, faculty_id]
                };
                return researchDbW.query(researchProjectGrantFacultySql);
            });

            return Promise.all(insertPromises)
                .then((insertResults) => {
                    const insertedIds = insertResults.map(result => result.rows[0].id);
                    return {
                        status: "Done",
                        message: 'Record Inserted Suuccessfully',
                        externalEmpIds: faculty_ids,
                        consultantId: research_project_grant_id,
                        researchProjectGrantFacultyIds: insertedIds,
                        rowCount: researchProjectTable.rowCount
                    };
                });
        })
        .catch((error) => {
            console.log('error ====>>>>', error);
            return { status: 'Failed', message: error.message, errorCode: error.code };
        });
}


module.exports.updateResearchConsultantData = async(consultantId, updatedResearchGrant, updatedConsultantFilesData, internalFacultyIdArray, externalFacultyData) => {
    console.log('data in models ===>>>>', updatedResearchGrant);
    const supportingDocuments = updatedConsultantFilesData ? updatedConsultantFilesData : null;
    console.log('supportingDocuments ====>>>>', supportingDocuments);

    const {grantProposalCategory, typeOfGrant, titleOfProject, thurstAreaOfResearch, fundingAgency, fundingAmount,
         statusOfResearchProject, submissionGrantDate} = updatedResearchGrant;
   

    let baseQuery = `UPDATE research_project_grant SET  grant_proposal_category = $2, type_of_research_grant = $3, title_of_project = $4, thrust_area_of_research = $5, name_of_funding_agency = $6, funding_amount = $7, status_of_research_project = $8, submission_date = $9`;
    let documentsQuery =  supportingDocuments ? `, supporting_documents = $10` : '';
    console.log('documentsQuery ====>>>>', documentsQuery);
    let queryText = baseQuery + documentsQuery +  ` WHERE id = $1`;
    console.log('queryText ===>>>>', queryText)

    let values = [consultantId, grantProposalCategory, typeOfGrant, titleOfProject, thurstAreaOfResearch, fundingAgency, fundingAmount,
         statusOfResearchProject, submissionGrantDate, ...(supportingDocuments ? [supportingDocuments] : [])];
    console.log('values ===>>>>', values)
    

    let sql  = {
        text : queryText,
        values : values
    }
    console.log('sql ====>>>>>>>', sql);

    let promises = [];

    // Iterate over each name and execute INSERT query
    if(externalFacultyData){
         for (let i = 0; i < externalFacultyData.length; i++) {
        const dataList = externalFacultyData[i];
        for (let j = 0; j < dataList.length; j++) {
            const facultiesSql = {
                text: `INSERT INTO faculties (faculty_type_id, faculty_name, designation, address)  VALUES ($1, $2, $3, $4) RETURNING id`,
                values: [2, dataList[j].facultyName, dataList[j].facultyDsg, dataList[j].facultyAddr]
            };
            console.log('facultiesSql ===>>>', facultiesSql); // Debugging purpose

            const facultyTableData = facultiesSql != null ? researchDbW.query(facultiesSql) : null;
            promises.push(facultyTableData);
        }
    }
    }

    const researchProjectTable = await researchDbW.query(sql);
    console.log('researchProjectTable ===>>>>>', researchProjectTable)
    promises.push(researchProjectTable);
    return Promise.all(promises)
        .then((results) => {
            console.log('results ====>>>>>', results);
            const facultyTableData = results.slice(0, externalFacultyData.length).filter(result => result !== null).map(result => result.rows[0].id);
            console.log('facultyTableData ===>>>>>>', facultyTableData) 
            // Concatenate internal faculty IDs
            // const internalFacultyIds = internalFacultyIdArray ? internalFacultyIdArray.join(',') : '';
            const allFacultyIds = facultyTableData.concat(internalFacultyIdArray);
            console.log('allFacultyIds ===>>>>', allFacultyIds);
            const insertPromises = allFacultyIds.map(async (faculty_id) => {
            // Check if the combination of research_project_grant_id and faculty_id already exists
            const checkIfExistsQuery = {
                text: `SELECT 1 FROM research_project_grant_faculty WHERE research_project_grant_id = $1 AND faculty_id = $2 LIMIT 1`,
                values: [consultantId, faculty_id],
              };

              console.log('checkIfExistsQuery ===>>>>>', checkIfExistsQuery);
              const { rowCount } = await researchDbW.query(checkIfExistsQuery);
              console.log('rowCount ====>>>>>>', rowCount);

              // If rowCount is 0, meaning the combination doesn't exist, insert the record
              if (rowCount === 0) {
                console.log('yes its working')
                const researchProjectGrantFacultySql = {
                  text: `INSERT INTO research_project_grant_faculty (research_project_grant_id, faculty_id) VALUES ($1, $2) RETURNING id`,
                  values: [consultantId, faculty_id],
                };
                return researchDbW.query(researchProjectGrantFacultySql);
              } else {
                // If the combination already exists, return null
                return null;
              }
            });
            
            const filteredInsertPromises = insertPromises.filter(promise => promise !== null);
            

            return Promise.all(filteredInsertPromises)
                .then((insertResults) => {
                    console.log('insertResults =====>>>>>', insertResults)
                    const insertedIds =  insertResults.map(result =>  result !== null ? result.rows[0].id : null);
                    return {
                        status: "Done",
                        message: 'Record Updated Suuccessfully',
                        facultyTableId: allFacultyIds,
                        externalEmpIds : facultyTableData ? facultyTableData : null,
                        researchProjectGrantFacultyIds: insertedIds ? insertedIds : null,
                        rowCount : researchProjectTable.rowCount
                        
                    } ;
                });
        })
        .catch((error) => {
            console.log('error ====>>>>', error);
            return { status: 'Failed', message: error.message, errorCode: error.code };
        });

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
  

module.exports.viewResearchConsultancy = async(consultantId) => {
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
            rg.id = $1;
        `,
        values : [consultantId]
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