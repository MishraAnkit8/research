const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.renderPharmacyData = async(userName) => {

    let sql = {
        text : `SELECT
        ps.id AS pharmacy_seed_id,
        ps.summary_title,
        ps.summary_project_title,
        ps.principle_investigator,
        ps.co_investigator,
        ps.project_duration,
        ps.total_cost,
        ps.consumables_amount,
        ps.analysis_amount,
        ps.other_amount,
        ps.project_title,
        ps.project_status,
        ps.scientific_importance,
        ps.project_objectives,
        ps.detailed_methodology,
        ps.time_lines,
        ps.budget_consumable_amount,
        ps.consumables_justification,
        ps.solvents_amount,
        ps.solvents_justification,
        ps.chemicals_amount,
        ps.chemicals_justification,
        ps.biomarkers_reference_amount,
        ps.biomarkers_reference_justifications,
        ps.hplc_amount,
        ps.hplc_justification,
        ps.experimental_animals_amount,
        ps.experimental_animals_justification,
        ps.cell_lines_amount,
        ps.cell_lines_justifications,
        ps.kits_analysis_amount,
        ps.kits_analysis_justifications,
        ps.evaluation_analysis_amount,
        ps.evaluation_analysis_justification,
        ps.proposed_out_come,
        ps.previous_project_explaination,
        ps.pharmacy_references,
        ps.project_background,
        ps.hypothesis,
        ps.updated_by AS pharmacy_seed_updated_by,
        ps.created_by AS pharmacy_seed_created_by,
        ps.created_at AS pharmacy_seed_created_at,
        ps.updated_at AS pharmacy_seed_updated_at,
        ps.active AS pharmacy_seed_active,
        pi.id AS pharmacy_investigator_id,
        pi.active AS pharmacy_investigator_active,
        inv.id AS investigator_id,
        inv.investigator_name,
        inv.investigator_dsg,
        inv.investigator_emial,
        inv.investigator_mobile,
        inv.investigator_dob,
        inv.investigator_address,
        pie.id AS pharmacy_investigator_education_id,
        pie.active AS pharmacy_investigator_education_active,
        piex.id AS pharmacy_investigator_experience_id,
        piex.active AS pharmacy_investigator_experience_active,
        pib.id AS pharmacy_investigator_book_id,
        pib.active AS pharmacy_investigator_book_active,
        pibc.id AS pharmacy_investigator_book_chapter_id,
        pibc.active AS pharmacy_investigator_book_chapter_active,
        pip.id AS pharmacy_investigator_patent_id,
        pip.active AS pharmacy_investigator_patent_active,
        pipu.id AS pharmacy_investigator_publication_id,
        pipu.active AS pharmacy_investigator_publication_active,
        pir.id AS pharmacy_investigator_research_implementation_id,
        pir.active AS pharmacy_investigator_research_implementation_active,
        pirc.id AS pharmacy_investigator_research_complete_id,
        pirc.active AS pharmacy_investigator_research_complete_active
    FROM
        pharmacy_seed AS ps
    LEFT JOIN
        pharmacy_investigator AS pi ON ps.id = pi.pharmacy_seed_id
    LEFT JOIN
        investigator AS inv ON pi.investigator_id = inv.id
    LEFT JOIN
        pharmacy_investigator_education AS pie ON ps.id = pie.pharmacy_seed_id
    LEFT JOIN
        pharmacy_investigator_experience AS piex ON ps.id = piex.pharmacy_seed_id
    LEFT JOIN
        pharmacy_investigator_book AS pib ON ps.id = pib.pharmacy_seed_id
    LEFT JOIN
        pharmacy_investigator_book_chapter AS pibc ON ps.id = pibc.pharmacy_seed_id
    LEFT JOIN
        pharmacy_investigator_patent AS pip ON ps.id = pip.pharmacy_seed_id
    LEFT JOIN
        pharmacy_investigator_publication AS pipu ON ps.id = pipu.pharmacy_seed_id
    LEFT JOIN
        pharmacy_investigator_research_implementation AS pir ON ps.id = pir.pharmacy_seed_id
    LEFT JOIN
        pharmacy_investigator_research_complete AS pirc ON ps.id = pirc.pharmacy_seed_id
    WHERE
        ps.created_by = $1 and ps.active=true 
    ORDER BY
        ps.id desc
    `,
    values : [userName]
    }

    let publicationDetails = {
        text : `SELECT
        pip.id AS pharmacy_investigator_publication_id,
        ps.id AS pharmacy_seed_id,
        inv_pub.id AS investigator_publication_id,
        inv_pub.publication_author,
        inv_pub.publication_title,
        inv_pub.publication_journal_name,
        inv_pub.publication_issue,
        inv_pub.publication_year,
        inv_pub.publication_volume,
        inv_pub.publication_artcile_number,
        inv_pub.publication_impact_factor,
        pip.active AS pharmacy_investigator_publication_active,
        pip,
        pip,
        pip,
        pip,
        
        pip.created_by AS pharmacy_investigator_publication_created_by,
        pip.updated_by AS pharmacy_investigator_publication_updated_by,
        pip.created_at AS pharmacy_investigator_publication_created_at,
        pip.updated_at AS pharmacy_investigator_publication_updated_at
    FROM
        pharmacy_investigator_publication AS pip
    JOIN
        pharmacy_seed AS ps ON pip.pharmacy_seed_id = ps.id
    JOIN
        investigator_publication AS inv_pub ON pip.investigator_publication_id = inv_pub.id
    WHERE
        pip.active = true and  pip.created_by = $1;
    
    `,
    values : [userName]
    }

    // let investorEducationalDetails = {
    //     text : `SELECT
    //     pie.id AS pharmacy_investigator_education_id,
    //     ps.id AS pharmacy_seed_id,
    //     inv_edu.id AS investigator_education_id,
    //     inv_edu.course_name,
    //     inv_edu.university_name,
    //     inv_edu.passout_year,
    //     inv_edu.active,
    // FROM
    //     pharmacy_investigator_education AS pie
    // JOIN
    //     pharmacy_seed AS ps ON pie.pharmacy_seed_id = ps.id
    // JOIN
    //     investigator_education AS inv_edu ON pie.investigator_education_id = inv_edu.id
    // WHERE
    //     pie.active = true and  pip.created_by = $1;
    
    // `,
    // values : [userName]
    // }

    console.log('sql ====>>>>>', sql);
    const pharmacyDataPromise = await researchDbR.query(sql);
    const investigatorPublication = await researchDbR.query(publicationDetails);
    // const investigatorEducation = await researchDbR.query(investorEducationalDetails);
    const promises = [pharmacyDataPromise, investigatorPublication]

    return Promise.all(promises).then(([pharmacyDataPromise, investigatorPublication]) => {
        return {
            status: 'Done',
            message: 'Data fetched successfully',
            pharmacyData: pharmacyDataPromise.rows,
            publicationDetails : investigatorPublication.rows,
            // educationalDetails : investigatorEducation.rows
        };
    }).catch((error) => {
        console.error('Error fetching pharmacy data:', error);
        throw {
            status : "Failed",
            message : "Failed to fecth data",
            errorCode : error.message
        };
    });
    
}

module.exports.insertInvestigatorEducationDetails = async(educationalDetails, userName) => {
    console.log('data in service ====>>>>>', educationalDetails);

    const {education, university, passoutYear} = educationalDetails;

    let sql = {
        text : `INSERT INTO investigator_education (course_name, university_name, passout_year, created_by, active) values ($1, $2, $3, $4, $5) returning id`,
        values : [education, university, passoutYear, userName, true]
    }
    console.log('sql ===>>>>', sql);

    const result = await researchDbW.query(sql);
    const response = result.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Inserted Successfully",
            investorEduId: result.rows[0].id,
            rowCount: result.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record insertion.",
            errorCode: error?.code
        };
    
    return response;

}

module.exports.insertInvestigatorExperienceDetails = async(workExperienceDetails, userName) => {
    console.log('data in service ====>>>>>', workExperienceDetails);

    const {investigatorPossition, investigatorOrganization, investigatorExperience} = workExperienceDetails;


    let sql = {
        text : `INSERT INTO investigator_experience (possition, organization_name, experience, created_by, active) values ($1, $2, $3, $4, $5) returning id`,
        values : [investigatorPossition, investigatorOrganization, investigatorExperience, userName, true]
    }
    console.log('sql ===>>>>', sql);

    const result = await researchDbW.query(sql);
    const response = result.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Inserted Successfully",
            invastigatorExperienceId: result.rows[0].id,
            rowCount: result.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record insertion.",
            errorCode: error?.code
        };
    
    return response;

}

module.exports.insertInvestigatorBookDetails = async(investigatorBookDetails, userName) => {
    console.log('data in service ====>>>>>', investigatorBookDetails);

    const {investigatorbookAuthor, investigatorBookNames, investigatorBookYear, investigatorBookVolumne, investigatorBookPublisher, investigatorBookIsbn} = investigatorBookDetails;

    let sql = {
        text : `INSERT INTO investigator_book (book_author, book_names, book_year, book_volume, book_publisher, book_isbn, created_by, active) values ($1, $2, $3, $4, $5, $6, $7, $8) returning id`,
        values : [investigatorbookAuthor, investigatorBookNames, investigatorBookYear, investigatorBookVolumne, investigatorBookPublisher, investigatorBookIsbn, userName, true]
    }
    console.log('sql ===>>>>', sql);

    const result = await researchDbW.query(sql);
    const response = result.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Inserted Successfully",
            bookId: result.rows[0].id,
            rowCount: result.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record insertion.",
            errorCode: error?.code
        };
    
    return response;

}

module.exports.insertInvestigatorBookChapterDetails = async(investigatorBookChapterDetails, userName) => {
    console.log('data in model ====>>>>>', investigatorBookChapterDetails);

    const {investigatorbookChapterAuthor, investigatorBookChapterTitle, investigatorBookChapterNames, bookChapterYear, investigatorBookVolumne,
        investigatorBookChapterPageNumber, investigatorBookChapterPublisher, investigatorBookChapterIsbn} = investigatorBookChapterDetails;

    let sql = {
        text : `INSERT INTO investigator_book_chapter (book_chapter_author, book_chapter__title, book_chapter_names, book_chapter_year, book_chapter_volume, book_chapter_page_number, book_chapter_publisher, book_chapter_isbn, created_by, active) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning id`,
        values : [investigatorbookChapterAuthor, investigatorBookChapterTitle, investigatorBookChapterNames,bookChapterYear,  investigatorBookVolumne,
                    investigatorBookChapterPageNumber, investigatorBookChapterPublisher, investigatorBookChapterIsbn, userName, true]
    }
    console.log('sql ===>>>>', sql);

    const result = await researchDbW.query(sql);
    const response = result.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Inserted Successfully",
            bookChapterId: result.rows[0].id,
            rowCount: result.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record insertion.",
            errorCode: error?.code
        };
    
    return response;

}

module.exports.insertInvestigatorPatentDetails = async(investigatorPatentDetails, userName) => {
    console.log('data in models ====>>>>>', investigatorPatentDetails);

    const {investigatorApplicantName, investigatorPatentTitle, investigatorPatentStatus, investigatorPatentYear, investigatorPatentNumber} = investigatorPatentDetails;

    let sql = {
        text : `INSERT INTO investigator_patent (applicant_name, patent_title, patent_status, patent_year, patent_number ,created_by, active) values ($1, $2, $3, $4, $5, $6, $7) returning id`,
        values : [investigatorApplicantName, investigatorPatentTitle, investigatorPatentStatus, investigatorPatentYear, investigatorPatentNumber, userName, true]
    }
    console.log('sql ===>>>>', sql);

    const result = await researchDbW.query(sql);
    const response = result.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Inserted Successfully",
            patentId: result.rows[0].id,
            rowCount: result.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record insertion.",
            errorCode: error?.code
        };
    
    return response;

}

module.exports.insertInvestigatorPublicationDetails = async(investigatorPublicationDetails, userName) => {
    console.log('data in service ====>>>>>', investigatorPublicationDetails);

    const {publicationAuthor, publicationTitle, publicationjournalName, publicationYear, publicationVolume,
        publicationIssue, publicationArtcicleNumber, impactFactor} = investigatorPublicationDetails;

    let sql = {
        text : `INSERT INTO investigator_publication (publication_author, publication_title, publication_journal_name, publication_year, publication_volume, publication_issue, publication_artcile_number,
            publication_impact_factor, created_by, active) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning id`,
        values : [publicationAuthor, publicationTitle, publicationjournalName, publicationYear, publicationVolume,
            publicationIssue, publicationArtcicleNumber, impactFactor, userName, true]
    }
    console.log('sql ===>>>>', sql);

    const result = await researchDbW.query(sql);
    const response = result.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Inserted Successfully",
            publicationId: result.rows[0].id,
            rowCount: result.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record insertion.",
            errorCode: error?.code
        };
    
    return response;

}

module.exports.insertInvestigatorResearchImplementationDetails = async(researchProjectDetails, userName) => {
    console.log('data in models ====>>>>>', researchProjectDetails);

    const {researchTitle, researchAgency, researchRole, projectDuration, projectCost} = researchProjectDetails;

    let sql = {
        text : `INSERT INTO investigator_research_implementation (research_im_title, research_im_agency, research_im_role, research_im_duration, research_im_project_cost, created_by, active) values ($1, $2, $3, $4, $5, $6, $7) returning id`,
        values : [researchTitle, researchAgency, researchRole, projectDuration, projectCost, userName, true]
    }
    console.log('sql ===>>>>', sql);

    const result = await researchDbW.query(sql);
    const response = result.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Inserted Successfully",
            implementationId: result.rows[0].id,
            rowCount: result.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record insertion.",
            errorCode: error?.code
        };
    
    return response;

}

module.exports.insertInvestigatorResearchCompletedDetails = async(researchProjectCompleteDetails, userName) => {
    console.log('data in models ====>>>>>', researchProjectCompleteDetails);

    const { compltedProjecTitle, completedProjectAgency, completedProjectRole, completedProjectDuration, completedProjectCost} = researchProjectCompleteDetails;

    let sql = {
        text : `INSERT INTO investigator_research_complete (research_cm_title, research_cm_agency, research_cm_role, research_cm_duration, research_cm_project_cost, created_by, active) values ($1, $2, $3, $4, $5, $6, $7) returning id`,
        values : [ compltedProjecTitle, completedProjectAgency, completedProjectRole, completedProjectDuration, completedProjectCost, userName, true]
    }
    console.log('sql ===>>>>', sql);

    const result = await researchDbW.query(sql);
    const response = result.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Inserted Successfully",
            CompletedId: result.rows[0].id,
            rowCount: result.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record insertion.",
            errorCode: error?.code
        };
    
    return response;

}


module.exports.insertPharmacyDetails = async (pharmacySeedGrantDetails, userName, educationIdsArray, experienceIdsArray,
    bookIdsArray, bookChapterIdsArray, publicationIdsArray, patentIdsArray, researchImplementationIdsArray, researchCompletedIdsArray, investorDetails) => {
    console.log('pharmacySeedGrantDetails in models  ===>>>>', pharmacySeedGrantDetails);
    console.log('investorDetails ===>>', investorDetails)

    const {invatigatorName, investigatorDesignation, investigatorAddress, invatigatorMobile, invastigatorDateOfBirth} = investorDetails

    const {
        summaryTitle, summaryProjectTitle, principalInvestigator, coInvestigator, projectDuration, totalCost,
        consumablesAmount, analysisAmount, otherAmount, projectTitle, researchStatus, scientificImportance, projectObjectives,
        detailedMethodology, timeLines, budgetConsumableAmount, consumablesJustification, solventsAmount, solventsJustification,
        chemicalsAmount, chemicalsJustification, biomarkersReferenceAmount, biomarkersReferenceJustifications, hplcAmount,
        hplcJustification, experimentalAnimalsAmount, experimentalAnimalsJustification, cellLinesAmount, cellLinesJustifications,
        kitsAnalysisAmount, kitsAnalysisJustifications, evaluationAnalysisAmount, evaluationAnalysisJustification, proposedOutCome,
        previousProjectExplaination, references, projectBackGround, hypothesis
        
      } = pharmacySeedGrantDetails;
      
      
      let sql = {
        text: `INSERT INTO pharmacy_seed (
                  summary_title, summary_project_title, principle_investigator, co_investigator,
                  project_duration, total_cost, consumables_amount, analysis_amount, other_amount,
                  project_title, project_status, scientific_importance, project_objectives,
                  detailed_methodology, time_lines, budget_consumable_amount, consumables_justification,
                  solvents_amount, solvents_justification, chemicals_amount, chemicals_justification,
                  biomarkers_reference_amount, biomarkers_reference_justifications, hplc_amount,
                  hplc_justification, experimental_animals_amount, experimental_animals_justification,
                  cell_lines_amount, cell_lines_justifications, kits_analysis_amount, kits_analysis_justifications,
                  evaluation_analysis_amount, evaluation_analysis_justification, proposed_out_come,
                  previous_project_explaination, pharmacy_references, project_background, hypothesis, created_by, active
              ) VALUES (
                  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,
                  $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40
              ) RETURNING id`,
        values: [ 
          summaryTitle, summaryProjectTitle, principalInvestigator, coInvestigator, projectDuration, totalCost,
          consumablesAmount, analysisAmount, otherAmount, projectTitle, researchStatus, scientificImportance, projectObjectives,
          detailedMethodology, timeLines, budgetConsumableAmount, consumablesJustification, 
          solventsAmount, solventsJustification, chemicalsAmount, chemicalsJustification, 
          biomarkersReferenceAmount, biomarkersReferenceJustifications, hplcAmount, 
          hplcJustification, experimentalAnimalsAmount, experimentalAnimalsJustification, 
          cellLinesAmount, cellLinesJustifications, kitsAnalysisAmount, kitsAnalysisJustifications, 
          evaluationAnalysisAmount, evaluationAnalysisJustification, proposedOutCome, 
          previousProjectExplaination, references, projectBackGround, hypothesis, userName, true
        ]
      };
    console.log('sql =====>>>>>>', sql);

    const investigatorSql = {
        text: `INSERT INTO investigator (investigator_name, investigator_dsg, investigator_address, investigator_mobile, 
            investigator_dob, active, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        values: [investorDetails.invatigatorName, investorDetails.investigatorDesignation, investorDetails.investigatorAddress, investorDetails.invatigatorMobile, investorDetails.invastigatorDateOfBirth, true, userName]
    };
    
    const pharmacyResult = await researchDbW.query(sql);
    const result = await researchDbW.query(investigatorSql);
    const investigatorId = result.rows[0].id;
    const pharmacyIds = pharmacyResult.rows[0].id;
    const rowCount = pharmacyResult.rowCount
    console.log("investigatorId ====>>>>", investigatorId);
    let pharmacyInvestigatorId
    if(pharmacyIds , investigatorId){
        let pharmacyInvestigatorSql = {
            text: `INSERT INTO pharmacy_investigator (pharmacy_seed_id, investigator_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
            values: [pharmacyIds, investigatorId, userName, true]
        }
        let pharmacyInvestigator = await researchDbW.query(pharmacyInvestigatorSql)
        pharmacyInvestigatorId = pharmacyInvestigator.rows[0].id;
        console.log('pharmacyInvestigatorId inside function ===>>>', pharmacyInvestigatorId)
    }

    console.log('pharmacyInvestigatorId inside function ===>>>', pharmacyInvestigatorId)

    let pharmacyEducation = [];
    let pharmacyExeperienceIds = [];
    let pharmacyBookIds = [];
    let pharmacyBookChapetrIds = [];
    let pharmacyPatentIds = [];
    let pharmacyPublicationIds = [];
    let pharmacyImplementationIds= [];
    let pharmacyCompletedIds = [];
    let pharmacyEducationIds = educationIdsArray ? educationIdsArray.map(async (element) => {
      let sql = {
        text: `INSERT INTO pharmacy_investigator_education (pharmacy_seed_id, investigator_education_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
        values: [pharmacyIds, element, userName, true]
      };
      console.log("sql ===>>>>>", sql);
      const education = await researchDbW.query(sql);
      let seedEducationId = education.rows[0].id;
      console.log('seedEducationId ===>>>>>>', seedEducationId);
      pharmacyEducation.push(seedEducationId);
    }) : null;
    
    let pharmacyExperience = experienceIdsArray ? experienceIdsArray.map(async (element) => {
      let sql = {
        text: `INSERT INTO pharmacy_investigator_experience (pharmacy_seed_id, investigator_experience_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
        values: [pharmacyIds, element, userName, true],
      };
      console.log("sql in experient ===>>>>>", sql);
      let experience =  await researchDbW.query(sql);
      pharmacyExeperienceIds.push(experience.rows[0].id)
    }) : null;
    
    let pharmacyBook = bookIdsArray ? bookIdsArray.map(async (element) => {
        let sql = {
        text: `INSERT INTO pharmacy_investigator_book (pharmacy_seed_id, investigator_book, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
        values: [pharmacyIds, element, userName, true],
      };
      console.log("sql ===>>>>>", sql);
      let book =  await researchDbW.query(sql);
      pharmacyBookIds.push(book.rows[0].id)
    }) : null;
    
    let pharmacyBookchapter = bookChapterIdsArray ? bookChapterIdsArray.map(async (element) => {
        let sql = {
        text: `INSERT INTO pharmacy_investigator_book_chapter (pharmacy_seed_id, investigator_book_chapter_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
        values: [pharmacyIds, element, userName, true],
      };
      console.log("sql ===>>>>>", sql);
      let bookchapter =  await researchDbW.query(sql);
      pharmacyBookChapetrIds.push(bookchapter.rows[0].id)
    }) : null;
    
    let pharmacyPublication = publicationIdsArray ? publicationIdsArray.map(async (element) => {
        let sql = {
        text: `INSERT INTO pharmacy_investigator_publication (pharmacy_seed_id, investigator_publication_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
        values: [pharmacyIds, element, userName, true],
      };
      console.log("sql ===>>>>>", sql);
      let publication =  await researchDbW.query(sql);
      pharmacyPublicationIds.push(publication.rows[0].id)
    }) : null;
    
    let pharmacyPatent = patentIdsArray ? patentIdsArray.map(async (element) => {
        let sql = {
        text: `INSERT INTO pharmacy_investigator_patent (pharmacy_seed_id, investigator_patent_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
        values: [pharmacyIds, element, userName, true],
      };
      console.log("sql ===>>>>>", sql);
      let patent = await researchDbW.query(sql);
      pharmacyPatentIds.push(patent.rows[0].id)
    }) : null;
    
    let pharmacyImplementation = researchImplementationIdsArray ? researchImplementationIdsArray.map(async (element) => {
        let sql = {
        text: `INSERT INTO pharmacy_investigator_research_implementation (pharmacy_seed_id, investigator_research_implementation_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
    values: [pharmacyIds, element, userName, true],
      };
      console.log("sql ===>>>>>", sql);
      let researchImplementatio =  await researchDbW.query(sql);
      pharmacyImplementationIds.push(researchImplementatio.rows[0].id)
    }) : null;
    
    let pharmacyCompleted = researchCompletedIdsArray ? researchCompletedIdsArray.map(async (element) => {
        let sql = {
        text: `INSERT INTO pharmacy_investigator_research_complete (pharmacy_seed_id, investigator_research_complete_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
        values: [pharmacyIds, element, userName, true],
      };
      console.log("sql ===>>>>>", sql);
      let researchComplete =  await researchDbW.query(sql);
      pharmacyCompletedIds.push(researchComplete.rows[0].id)
    }) : null;
    
    const promises = [
      pharmacyIds,
      investigatorId,
      ...(pharmacyEducationIds || []),
      ...(pharmacyExperience || []),
      ...(pharmacyBook || []),
      ...(pharmacyBookchapter || []),
      ...(pharmacyPatent || []),
      ...(pharmacyPublication || []),
      ...(pharmacyImplementation || []),
      ...(pharmacyCompleted || [])
    ];
    
    console.log('promises ===>>>>>>', promises);
    
    return Promise.all(promises).then((values) => {
      const [
        pharmacyIds,
        investigatorId,
      ] = values;
    
      return {
        status: "Done",
        message: "Inserted successfully",
        pharmacyIds,
        investigatorId,
        pharmacyEducation,
        pharmacyExeperienceIds,
        pharmacyBookIds,
        pharmacyBookChapetrIds,
        pharmacyPatentIds,
        pharmacyPublicationIds,
        pharmacyImplementationIds,
        pharmacyCompletedIds,
        rowCount

      };
    }).catch((error) => {
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
    
    
    

}
