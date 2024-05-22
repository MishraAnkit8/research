const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');
// const { investigatorPublication } = require('../controllers/pharmacy-seed-grant-form-controller');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.renderPharmacyData = async(userName) => {

    let sql = {
        text : `SELECT DISTINCT
        ps.id AS pharmacy_seed_id,
        ps.summary_title,
        ps.summary_objectives,
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

        ppi.id AS pharmacy_principal_investigator_id,
        ppi.active AS pharmacy_principal_investigator_active,

        pco.id AS pharmacy_co_investigator_id,
        pco.active AS pharmacy_co_investigator_active,
        
        inv.id AS investigator_id,
        inv.investigator_name,
        inv.investigator_dsg,
        inv.investigator_email,
        inv.investigator_mobile,
        inv.investigator_dob,
        inv.investigator_address,

        piv.id AS principal_investigator_id,
        piv.principal_name,
        piv.principal_dsg,
        piv.principal_org,
        piv.principal_email,
        piv.principal_mobile,

        cid.id AS co_investigator_details_id,
        cid.co_investigator_name,
        cid.co_investigator_dsg,
        cid.co_investigator_org,
        cid.co_investigator_email,
        cid.co_investigator_mobile
        
   
    FROM
    pharmacy_seed AS ps
    LEFT JOIN 
      pharmacy_investigator AS pi ON ps.id = pi.pharmacy_seed_id
    LEFT JOIN 
      investigator AS inv ON pi.investigator_id = inv.id
    LEFT JOIN 
      pharmacy_principal_investigator AS ppi ON ps.id = ppi.pharmacy_seed_id
    LEFT JOIN 
      principal_investigator AS piv ON ppi.principal_investigator_id = piv.id
    LEFT JOIN 
      pharmacy_co_investigator AS pco ON ps.id = pco.pharmacy_seed_id
    LEFT JOIN 
            co_investigator_details AS cid ON pco.co_investigator_details_id = cid.id
    WHERE 
         ps.created_by = $1 AND ps.active = true AND pi.active = true AND inv.active = true 
    ORDER BY 
      ps.id DESC`,
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

    // console.log('sql ====>>>>>', sql);
    const pharmacyDataPromise = await researchDbR.query(sql);
    const investigatorPublication = await researchDbR.query(publicationDetails);
    // const investigatorEducation = await researchDbR.query(investorEducationalDetails);
    const promises = [pharmacyDataPromise, investigatorPublication]

    return Promise.all(promises).then(([pharmacyDataPromise, investigatorPublication]) => {
        return {
            status: 'Done',
            message: 'Data fetched successfully',
            pharmacyData: pharmacyDataPromise.rows,
            rowCount : pharmacyDataPromise.rowCount,
            publicationDetails : investigatorPublication.rows,
            // educationalDetails : investigatorEducation.rows
        };
    }).catch((error) => {
        console.error('Error fetching pharmacy data:', error);
        return {
            status : "Failed",
            message : "Failed to fecth data",
            errorCode : error.message
        };
    });
    
}

module.exports.insertInvestigatorEducationDetails = async(detailsDataArray, userName) => {
  const columns = ['created_by', 'active', 'course_name', 'university_name', 'passout_year'];
  return insertDetails('investigator_education', columns, detailsDataArray, userName);
  
};


module.exports.insertInvestigatorExperienceDetails = async(detailsDataArray, userName) => {
  const columns = ['created_by', 'active', 'possition', 'organization_name', 'experience'];
  return insertDetails('investigator_experience', columns, detailsDataArray, userName);
 
};

module.exports.insertInvestigatorBookDetails = async(detailsDataArray, userName) => {
  const columns = ['created_by', 'active', 'book_author', 'book_names', 'book_year', 'book_volume', 'book_publisher', 'book_isbn'];
  return insertDetails('investigator_book', columns, detailsDataArray, userName);

}

module.exports.insertInvestigatorBookChapterDetails = async(detailsDataArray, userName) => {
  const columns = ['created_by', 'active', 'book_chapter_author', 'book_chapter_title', 'book_chapter_names', 'book_chapter_year', 'book_chapter_volume', 'book_chapter_page_number', 'book_chapter_publisher', 'book_chapter_isbn'];
  return insertDetails('investigator_book_chapter', columns, detailsDataArray, userName);
 

}

module.exports.insertInvestigatorPatentDetails = async(detailsDataArray, userName) => {

  const columns = ['created_by', 'active', 'applicant_name', 'patent_title', 'patent_status', 'patent_number', 'patent_year'];
  return insertDetails('investigator_patent', columns, detailsDataArray, userName);

}

module.exports.insertInvestigatorPublicationDetails = async(detailsDataArray, userName) => {

  const columns = ['created_by', 'active', 'publication_author', 'publication_title', 'publication_journal_name', 'publication_year', 'publication_volume', 'publication_issue', 'publication_artcile_number',
  'publication_impact_factor'];
  return insertDetails('investigator_publication', columns, detailsDataArray, userName);

}

module.exports.insertInvestigatorResearchImplementationDetails = async(detailsDataArray, userName) => {

  const columns = ['created_by', 'active', 'research_im_title', 'research_im_agency', 'research_im_role', 'research_im_duration', 'research_im_project_cost'];
  return insertDetails('investigator_research_implementation', columns, detailsDataArray, userName);

}

module.exports.insertInvestigatorResearchCompletedDetails = async(detailsDataArray, userName) => {
  const columns = ['created_by', 'active', 'research_cm_title', 'research_cm_agency', 'research_cm_role', 'research_cm_duration', 'research_cm_project_cost'];
  return insertDetails('investigator_research_complete', columns, detailsDataArray, userName);

}



const insertDetails = async(tableName, columns, detailsDataArray, userName) => {
  let ids = [];
  let rowCount = 0;

  const insertPromises = detailsDataArray.map(details => {
    if (details.length > 0) {
      const values = [userName, true].concat(details);

      const sql = {
        text: `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${Array(columns.length).fill('$').map((_, i) => `$${i + 1}`).join(', ')}) RETURNING id`,
        values
      };
      console.log('sql ====>>>>>>', sql)
      return researchDbW.query(sql)
        .then(result => {
          if (result.rowCount > 0 && result.rows[0].id) {
            rowCount += 1
            ids.push(result.rows[0].id)
          }
        })
        .catch(error => {
          throw {
            status: "Failed",
            message: error.message ?? "An error occurred.",
            errorCode: error.code
          };
        })
    }
  });

  return Promise.all(insertPromises)
    .then(() => ({
      status: "Done",
      message: `Details inserted for ${tableName}`,
      ids,
      rowCount
    }))
    .catch(error => ({
      status: "Failed",
      message: error.message ?? "An error occurred.",
      errorCode: error.code
    }));
};


module.exports.insertPharmacyDetails = async (pharmacySeedGrantDetails, userName, educationalData, experienceData, bookData, bookChapterData, publicationData, 
  patentData, implementationData, completedData, investorDetails,
  principalInvestigatorDetails, coInvestigatorDetails) => {
    console.log('pharmacySeedGrantDetails in models  ===>>>>', pharmacySeedGrantDetails);
    console.log('investorDetails ===>>', investorDetails)

    const {invatigatorName, investigatorDesignation, investigatorAddress, invatigatorMobile, investigatorEmail, invastigatorDateOfBirth} = investorDetails;

    const {principalName, principalDsg, principalOrg, principalMob, principalEmail} = principalInvestigatorDetails;

    const {coIvestigatorName, coIvestigatorDsg, coIvestigatorOrg, coIvestigatorMob, coIvestigatorEmail} = coInvestigatorDetails;


    const {
        summaryTitle, summaryProjectTitle, projectDuration, totalCost,
        consumablesAmount, analysisAmount, otherAmount, projectTitle, researchStatus, scientificImportance, projectObjectives,
        detailedMethodology, timeLines, budgetConsumableAmount, consumablesJustification, solventsAmount, solventsJustification,
        chemicalsAmount, chemicalsJustification, biomarkersReferenceAmount, biomarkersReferenceJustifications, hplcAmount,
        hplcJustification, experimentalAnimalsAmount, experimentalAnimalsJustification, cellLinesAmount, cellLinesJustifications,
        kitsAnalysisAmount, kitsAnalysisJustifications, evaluationAnalysisAmount, evaluationAnalysisJustification, proposedOutCome,
        previousProjectExplaination, references, projectBackGround, hypothesis
        
      } = pharmacySeedGrantDetails;
      
      
      let sql = {
        text: `INSERT INTO pharmacy_seed (
                  summary_title, summary_objectives,
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
                  $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38
              ) RETURNING id`,
        values: [ 
          summaryTitle, summaryProjectTitle, projectDuration, totalCost,
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
        text: `INSERT INTO investigator (investigator_name, investigator_dsg, investigator_address, investigator_mobile, investigator_email, 
            investigator_dob, active, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        values: [invatigatorName, investigatorDesignation, investigatorAddress, invatigatorMobile, investigatorEmail, invastigatorDateOfBirth, true, userName]
    };

    const principalSql = {
        text: `INSERT INTO principal_investigator (principal_name, principal_dsg, principal_org, principal_mobile, 
          principal_email,  active, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        values: [principalName, principalDsg, principalOrg, principalMob, principalEmail, true, userName]
    };

    const coInvestigatorSql = {
        text: `INSERT INTO co_investigator_details (co_investigator_name, co_investigator_dsg, co_investigator_org, co_investigator_mobile, co_investigator_email,  created_by, active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        values: [coIvestigatorName, coIvestigatorDsg, coIvestigatorOrg, coIvestigatorMob, coIvestigatorEmail, userName, true]
    };
    
    const pharmacyResult = await researchDbW.query(sql);
    const result = await researchDbW.query(investigatorSql);
    const investigatorId = result.rows[0].id;
    const pharmacyIds = pharmacyResult.rows[0].id;
    const rowCount = pharmacyResult.rowCount;
    const principalSummary = await researchDbW.query(principalSql);
    const coInvestigatorSummary = await researchDbW.query(coInvestigatorSql);
    const principalInvSummaryId = principalSummary.rows[0].id;
    const coInvSummaryId = coInvestigatorSummary.rows[0].id;

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
    if(pharmacyIds , principalInvSummaryId){
        let pharmacyPrinciplaSql = {
            text: `INSERT INTO pharmacy_principal_investigator (pharmacy_seed_id, principal_investigator_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
            values: [pharmacyIds, principalInvSummaryId, userName, true]
        }
        let pharmacyPrincipal = await researchDbW.query(pharmacyPrinciplaSql)
        let principalId = pharmacyPrincipal.rows[0].id;
        console.log('pharmacyInvestigatorId inside function ===>>>', pharmacyInvestigatorId)
    }

    if(pharmacyIds , coInvSummaryId){
        let pharmacyCoSql = {
            text: `INSERT INTO pharmacy_co_investigator (pharmacy_seed_id, co_investigator_details_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
            values: [pharmacyIds, coInvSummaryId, userName, true]
        }
        let pharmacyCoInvestigator = await researchDbW.query(pharmacyCoSql)
        let pharmacyCoInvestigatorId = pharmacyCoInvestigator.rows[0].id;
        console.log('pharmacyCoInvestigatorId inside function ===>>>', pharmacyCoInvestigatorId)
    }

    console.log('pharmacyInvestigatorId inside function ===>>>', pharmacyInvestigatorId)


    const insertEducation = educationalData ? (educationalData.map(async (educationDetails) => {
      console.log('educationDetails ===.>>>', educationDetails);
      const [courseName, universityName, passOutYear] = educationDetails;
  
      let sql = {
          text: `INSERT INTO investigator_education (course_name, university_name, passout_year, created_by, active) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          values: [courseName, universityName, passOutYear, userName, true]
      };
      const result = await researchDbW.query(sql);
      return result.rows[0].id;
    })) : null;
  
    const educationsIds = await Promise.all(insertEducation);
    console.log("educationsIds ====>>>>", educationsIds);
  

    const insertExperience = experienceData ? (experienceData.map(async (experienceDetails) => {
      console.log('experienceDetails ===.>>>', experienceDetails);
      const [possition, organizationName, experience] = experienceDetails;
      let sql = {
          text: `INSERT INTO investigator_experience(possition, organization_name, experience, created_by, active) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          values: [possition, organizationName, experience, userName, true]
      };
      const result = await researchDbW.query(sql);
      return result.rows[0].id;
    })) : null;
  
    const experienceIds = await Promise.all(insertExperience);
    console.log("experienceIds ====>>>>", experienceIds);

  const insertInvestorBook = bookData ? (bookData.map(async (bookDetails) => {
    console.log('bookDetails ===.>>>', bookDetails);
    const [bookAuthor, bookNames, bookYear, bookVolume, bookPublisher, bookIsbn] = bookDetails;

    let sql = {
        text: `INSERT INTO investigator_book(book_author, book_names, book_year, book_volume, 
          book_publisher, book_isbn, created_by, active) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        values: [bookAuthor, bookNames, bookYear,  bookVolume, bookPublisher, bookIsbn, userName, true]
    };
    const result = await researchDbW.query(sql);
    return result.rows[0].id;
  })) : null;

  const bookDetailsIds = await Promise.all(insertInvestorBook);
  console.log("bookDetailsIds ====>>>>", bookDetailsIds);


  const insertInvestorBookChapter = bookChapterData ? (bookChapterData.map(async (bookChapterDetails) => {
    console.log('bookChapterDetails ===.>>>', bookChapterDetails);
    const [book_chapter_author, book_chapter_title, book_chapter_names, book_chapter_volume, book_chapter_year,
      book_chapter_page_number, book_chapter_publisher, book_chapter_isbn
    ] = bookChapterDetails;

    let sql = {
        text: `INSERT INTO investigator_book_chapter (book_chapter_author, book_chapter_title, book_chapter_names, book_chapter_volume,
          book_chapter_page_number, book_chapter_year, book_chapter_publisher, book_chapter_isbn, created_by, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        values: [book_chapter_author, book_chapter_title, book_chapter_names, book_chapter_volume, book_chapter_year,
          book_chapter_page_number, book_chapter_publisher, book_chapter_isbn, userName, true]
    };
    const result = await researchDbW.query(sql);
      return result.rows[0].id;
  })) : null;

  const bookChapterIds  = await Promise.all(insertInvestorBookChapter);
  console.log("bookChapterIds ====>>>>", bookChapterIds);


  const insertInvestorPublication = publicationData ? (publicationData.map(async (publicationDetails) => {
    console.log('publicationDetails ===.>>>', publicationDetails);
    const [publication_author, publication_title, publication_journal_name, 
      publication_year, publication_volume, publication_issue, publication_artcile_number, publication_impact_factor] = publicationDetails;

    let sql = {
        text: `INSERT INTO investigator_publication (publication_author, publication_title, publication_journal_name, 
          publication_year, publication_volume, publication_issue, publication_artcile_number, publication_impact_factor, created_by, active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        values: [publication_author, publication_title, publication_journal_name, 
          publication_year, publication_volume, publication_issue, publication_artcile_number, publication_impact_factor, userName, true]
    };
    const result = await researchDbW.query(sql);
    return result.rows[0].id;
  })) : null;

  const publicationIds  = await Promise.all(insertInvestorPublication);
  console.log("publicationIds ====>>>>", publicationIds);

  const insertInvestorPatent = patentData ?(patentData.map(async (patentDetails) => {
    console.log('patentDetails ===.>>>', patentDetails);
    const [applicant_name, patent_title, patent_status, patent_year, patent_number] = patentDetails;

    let sql = {
        text: `INSERT INTO investigator_patent (applicant_name, patent_title, patent_status, patent_year, patent_number, created_by, active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        values: [applicant_name, patent_title, patent_status, patent_year, patent_number, userName, true]
    };
    const result = await researchDbW.query(sql);
    return result.rows[0].id;
  })) : null;

  const patentIds  = await Promise.all(insertInvestorPatent);
  console.log("patentIds ====>>>>", patentIds);

  const insertImplementationDetails = implementationData ? (implementationData.map(async (implementationDetails) => {
    console.log('implementationDetails ===.>>>', implementationDetails);
    const [researchTitle, researchAgency, researchRole, researchDuration, researchCost] = implementationDetails;

    let sql = {
        text: `INSERT INTO investigator_research_implementation (research_im_title, research_im_agency, research_im_role, research_im_duration, research_im_project_cost, created_by, active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        values: [researchTitle, researchAgency, researchRole, researchDuration, researchCost, userName, true]
    };
    const result = await researchDbW.query(sql);
    return result.rows[0].id;
  })) : null;

  const implementationIds  = await Promise.all(insertImplementationDetails);
  console.log("implementationIds ====>>>>", implementationIds);

  const insertCompletedReserch = completedData ? (completedData.map(async (completedDetails) => {
    console.log('completedDetails ===.>>>', completedDetails);
    const [researchTitle, researchAgency, researchRole, researchDuration, researchCost] = completedDetails;

    let sql = {
        text: `INSERT INTO investigator_research_complete (research_cm_title, research_cm_agency, research_cm_role, research_cm_duration, research_cm_project_cost, created_by, active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        values: [researchTitle, researchAgency, researchRole, researchDuration, researchCost, userName, true]
    };
    const result = await researchDbW.query(sql);
    return result.rows[0].id;
  })) : null;

  const completedIds  = await Promise.all(insertCompletedReserch);
  console.log("completedIds ====>>>>", completedIds);
    

  let pharmacyEduction = educationsIds ? educationsIds.map(async (element) => {
    console.log('element ====>>>>', element)
    let sql = {
      text: `INSERT INTO pharmacy_investigator_education (pharmacy_seed_id, investigator_education_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
      values: [pharmacyIds, element, userName, true],
    };
    return researchDbW.query(sql)
  }) : null;

  let pharmacyExperience = experienceIds ? experienceIds.map(async (element) => {
      let sql = {
        text: `INSERT INTO pharmacy_investigator_experience (pharmacy_seed_id, investigator_experience_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
        values: [pharmacyIds, element, userName, true],
      };
      return researchDbW.query(sql)
    }) : null;

    
    let pharmacyBook = bookDetailsIds ? bookDetailsIds.map(async (element) => {
        let sql = {
        text: `INSERT INTO pharmacy_investigator_book (pharmacy_seed_id, investigator_book_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
        values: [pharmacyIds, element, userName, true],
      };
      console.log("sql ===>>>>>", sql);
      return researchDbW.query(sql)
    }) : null;

    
    let pharmacyBookchapter = bookChapterIds ? bookChapterIds.map(async (element) => {
        let sql = {
        text: `INSERT INTO pharmacy_investigator_book_chapter (pharmacy_seed_id, investigator_book_chapter_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
        values: [pharmacyIds, element, userName, true],
      };
      console.log("sql ===>>>>>", sql);
      return researchDbW.query(sql)
    }) : null;

    
    let pharmacyPublication = publicationIds ? publicationIds.map(async (element) => {
        let sql = {
        text: `INSERT INTO pharmacy_investigator_publication (pharmacy_seed_id, investigator_publication_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
        values: [pharmacyIds, element, userName, true],
      };
      console.log("sql ===>>>>>", sql);
      return researchDbW.query(sql)
    }) : null;
    
    let pharmacyPatent = patentIds ? patentIds.map(async (element) => {
        let sql = {
        text: `INSERT INTO pharmacy_investigator_patent (pharmacy_seed_id, investigator_patent_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
        values: [pharmacyIds, element, userName, true],
      };
      console.log("sql ===>>>>>", sql);
      return researchDbW.query(sql)
    }) : null;

    
    let pharmacyImplementation = implementationIds ? implementationIds.map(async (element) => {
        let sql = {
        text: `INSERT INTO pharmacy_investigator_research_implementation (pharmacy_seed_id, investigator_research_implementation_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
    values: [pharmacyIds, element, userName, true],
      };
      console.log("sql ===>>>>>", sql);
      return researchDbW.query(sql)
    }) : null;
    
    let pharmacyCompleted = completedIds ? completedIds.map(async (element) => {
      let sql = {
          text: `INSERT INTO pharmacy_investigator_research_complete (pharmacy_seed_id, investigator_research_complete_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
          values: [pharmacyIds, element, userName, true]
      };
      console.log("sql ===>>>>>", sql);
      return researchDbW.query(sql)
  }) : null;
  
    
    const promises = [
      pharmacyIds,
      investigatorId
      
    ];
    
    console.log('promises ===>>>>>>', promises);
    
    return Promise.all(promises).then((values) => {
      const [
        pharmacyIds,
        investigatorId,
        pharmacyEduction,
        pharmacyExperience,
        pharmacyBook,
        pharmacyBookchapter, 
        pharmacyPublication,
        pharmacyPatent,
        pharmacyImplementation, 
        pharmacyCompleted
      ] = values;
    
      return {
        status: "Done",
        message: "Inserted successfully",
        pharmacyIds,
        investigatorId,
        
        bookDetailsIds,
        bookChapterIds, 
        experienceIds,
        educationsIds,
        publicationIds,
        patentIds,
        completedIds,
        implementationIds,
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


module.exports.viewPharmacyGrantData = async(pharmacyId, userName) => {
    console.log('pharmacyId in models ===>>>>>>>', pharmacyId);
    console.log('userName in models ===>>>>>>>', userName);

    let sql = {
        text : `SELECT
        ps.id AS pharmacy_seed_id,
        ps.summary_title,
        ps.summary_objectives,
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

        ppi.id AS pharmacy_principal_investigator_id,
        ppi.active AS pharmacy_principal_investigator_active,

        pco.id AS pharmacy_co_investigator_id,
        pco.active AS pharmacy_co_investigator_active,
        
        inv.id AS investigator_id,
        inv.investigator_name,
        inv.investigator_dsg,
        inv.investigator_email,
        inv.investigator_mobile,
        inv.investigator_dob,
        inv.investigator_address,

        piv.id AS principal_investigator_id,
        piv.principal_name,
        piv.principal_dsg,
        piv.principal_org,
        piv.principal_email,
        piv.principal_mobile,

        cid.id AS co_investigator_details_id,
        cid.co_investigator_name,
        cid.co_investigator_dsg,
        cid.co_investigator_org,
        cid.co_investigator_email,
        cid.co_investigator_mobile
     
    FROM
    pharmacy_seed AS ps
    LEFT JOIN 
      pharmacy_investigator AS pi ON ps.id = pi.pharmacy_seed_id
    LEFT JOIN 
      investigator AS inv ON pi.investigator_id = inv.id
    LEFT JOIN 
      pharmacy_principal_investigator AS ppi ON ps.id = ppi.pharmacy_seed_id
    LEFT JOIN 
      principal_investigator AS piv ON ppi.principal_investigator_id = piv.id
    LEFT JOIN 
      pharmacy_co_investigator AS pco ON ps.id = pco.pharmacy_seed_id
    LEFT JOIN 
            co_investigator_details AS cid ON pco.co_investigator_details_id = cid.id
  
    WHERE 
        ps.id = $1 AND  ps.created_by = $2 AND ps.active = true AND pi.active = true AND inv.active = true AND cid.active = true`,
        values : [pharmacyId , userName]
    }

    let principalSql = {
        text: `select  pi.principal_name, pi.principal_dsg, pi.principal_org, pi.principal_email,
                pi.principal_mobile  FROM pharmacy_principal_investigator ppi
                JOIN principal_investigator pi ON ppi.principal_investigator_id = pi.id
                WHERE ppi.pharmacy_seed_id = $1 and ppi.active=true and pi.active=true `,
        values : [pharmacyId]
    };

    let investigatorEduSql = {
      text: `select  ie.course_name, ie.university_name, ie.passout_year
             FROM pharmacy_investigator_education pie
            JOIN investigator_education ie ON pie.investigator_education_id = ie.id
            WHERE pie.pharmacy_seed_id = $1 and pie.active=true and ie.active=true `,
      values: [pharmacyId],
    };

    let investigatorExeSql = {
        text: `select iex.possition, iex.organization_name, iex.experience
               FROM pharmacy_investigator_experience piex
              JOIN investigator_experience iex ON piex.investigator_experience_id = iex.id
              WHERE piex.pharmacy_seed_id = $1 and piex.active=true and iex.active=true `,
        values: [pharmacyId],
      };

      let investigatorBookSql = {
        text: `select  ib.book_author, ib.book_names, ib.book_year,
            ib.book_year, ib.book_volume, ib.book_publisher, ib.book_isbn
               FROM pharmacy_investigator_book pib
              JOIN investigator_book ib ON pib.investigator_book_id = ib.id
              WHERE pib.pharmacy_seed_id = $1 and pib.active=true and ib.active=true `,
        values: [pharmacyId],
      };

      let investigatorBookChapterSql = {
        text: `select  ibc.book_chapter_author, ibc.book_chapter_title, ibc.book_chapter_names,
                ibc.book_chapter_year, ibc.book_chapter_volume, ibc.book_chapter_page_number, ibc.book_chapter_publisher,
                ibc.book_chapter_isbn
                FROM pharmacy_investigator_book_chapter pibc
                JOIN investigator_book_chapter ibc ON pibc.investigator_book_chapter_id = ibc.id
                WHERE pibc.pharmacy_seed_id = $1 and pibc.active=true and ibc.active=true `,
        values: [pharmacyId],
      };

      let investigatorPubSql = {
        text: `select  ipub.publication_author, ipub.publication_title, ipub.publication_journal_name,
                ipub.publication_issue, ipub.publication_year, ipub.publication_volume, ipub.publication_artcile_number,
                ipub.publication_impact_factor
                FROM pharmacy_investigator_publication pipub
                JOIN investigator_publication ipub ON pipub.investigator_publication_id = ipub.id
                WHERE pipub.pharmacy_seed_id = $1 and pipub.active=true and ipub.active=true `,
        values : [pharmacyId]
      };

      let investigatorPatentSql = {
        text: `select  ipa.applicant_name, ipa.patent_title, ipa.patent_status,
                ipa.patent_year, ipa.patent_number
                FROM pharmacy_investigator_patent pip
                JOIN investigator_patent ipa ON pip.investigator_patent_id = ipa.id
                WHERE pip.pharmacy_seed_id = $1 and pip.active=true and ipa.active=true `,
        values: [pharmacyId],
      };


      let investigatorImplementationSql = {
        text: `select  irm.research_im_title, irm.research_im_agency, irm.research_im_role,
                irm.research_im_duration, irm.research_im_project_cost
                FROM pharmacy_investigator_research_implementation pirm
                JOIN investigator_research_implementation irm ON pirm.investigator_research_implementation_id = irm.id
                WHERE pirm.pharmacy_seed_id = $1 and pirm.active=true and irm.active=true `,
        values: [pharmacyId],
      };

      let investigatorCompletedSql = {
        text: `select irc.id, irc.research_cm_title, irc.research_cm_agency, irc.research_cm_role,
                irc.research_cm_duration, irc.research_cm_project_cost
                FROM pharmacy_investigator_research_complete pirc
                JOIN investigator_research_complete irc ON pirc.investigator_research_complete_id = irc.id
                WHERE pirc.pharmacy_seed_id = $1 and pirc.active=true and irc.active=true  `,
        values: [pharmacyId],
      };


    
    const pharmacyDataPromise = await researchDbR.query(sql);
    const principalInvestigator = await researchDbR.query(principalSql);
    const educaltionalDetails = await researchDbR.query(investigatorEduSql);
    const experienceDetails = await researchDbR.query(investigatorExeSql);
    const bookDetails = await researchDbR.query(investigatorBookSql);
    const bookChapterDetails = await researchDbR.query(investigatorBookChapterSql);
    const PublicationDetails = await researchDbR.query(investigatorPubSql);
    const patentDetails = await researchDbR.query(investigatorPatentSql);
    const researchImplementationDetails = await researchDbR.query(investigatorImplementationSql);
    const completedResearchDetails = await researchDbR.query(investigatorCompletedSql);

    const promises = [pharmacyDataPromise, principalInvestigator, educaltionalDetails, experienceDetails,
        bookDetails, bookChapterDetails, PublicationDetails, patentDetails, researchImplementationDetails, completedResearchDetails]

    return Promise.all(promises).then(([pharmacyDataPromise]) => {
        return {
            status : "Done",
            message : "Data Fetched Successfully",
            pharmacyData : pharmacyDataPromise.rows,
            principalInvestigator : principalInvestigator.rows,
            educaltionalDetails : educaltionalDetails.rows,
            experienceDetails : experienceDetails.rows,
            bookDetails : bookDetails.rows,
            bookChapterDetails : bookChapterDetails.rows,
            PublicationDetails : PublicationDetails.rows,
            patentDetails : patentDetails.rows,
            researchImplementationDetails : researchImplementationDetails.rows,
            completedResearchDetails : completedResearchDetails.rows
        }
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


module.exports.retriveDataFromDetailsTable = async(pharmacyId) => {
  console.log(' id in models ===>>>>', pharmacyId)

  let investigatorEduSql = {
    text: `select ie.id, ie.course_name, ie.university_name, ie.passout_year
           FROM pharmacy_investigator_education pie
          JOIN investigator_education ie ON pie.investigator_education_id = ie.id
          WHERE pie.pharmacy_seed_id = $1 and pie.active=true and ie.active=true `,
    values: [pharmacyId],
  };

  let investigatorExeSql = {
      text: `select  iex.id, iex.possition, iex.organization_name, iex.experience
             FROM pharmacy_investigator_experience piex
            JOIN investigator_experience iex ON piex.investigator_experience_id = iex.id
            WHERE piex.pharmacy_seed_id = $1 and piex.active=true and iex.active=true `,
      values: [pharmacyId],
    };

    let investigatorBookSql = {
      text: `select  ib.id, ib.book_author, ib.book_names, ib.book_year,
          ib.book_year, ib.book_volume, ib.book_publisher, ib.book_isbn
             FROM pharmacy_investigator_book pib
            JOIN investigator_book ib ON pib.investigator_book_id = ib.id
            WHERE pib.pharmacy_seed_id = $1 and pib.active=true and ib.active=true `,
      values: [pharmacyId],
    };

    let investigatorBookChapterSql = {
      text: `select  ibc.id,  ibc.book_chapter_author, ibc.book_chapter_title, ibc.book_chapter_names,
              ibc.book_chapter_year, ibc.book_chapter_volume, ibc.book_chapter_page_number, ibc.book_chapter_publisher,
              ibc.book_chapter_isbn
              FROM pharmacy_investigator_book_chapter pibc
              JOIN investigator_book_chapter ibc ON pibc.investigator_book_chapter_id = ibc.id
              WHERE pibc.pharmacy_seed_id = $1 and pibc.active=true and ibc.active=true `,
      values: [pharmacyId],
    };

    let investigatorPubSql = {
      text: `select  ipub.id, ipub.publication_author, ipub.publication_title, ipub.publication_journal_name,
              ipub.publication_issue, ipub.publication_year, ipub.publication_volume, ipub.publication_artcile_number,
              ipub.publication_impact_factor
              FROM pharmacy_investigator_publication pipub
              JOIN investigator_publication ipub ON pipub.investigator_publication_id = ipub.id
              WHERE pipub.pharmacy_seed_id = $1 and pipub.active=true and ipub.active=true `,
      values : [pharmacyId]
    };

    let investigatorPatentSql = {
      text: `select  ipa.id, ipa.applicant_name, ipa.patent_title, ipa.patent_status,
              ipa.patent_year, ipa.patent_number
              FROM pharmacy_investigator_patent pip
              JOIN investigator_patent ipa ON pip.investigator_patent_id = ipa.id
              WHERE pip.pharmacy_seed_id = $1 and pip.active=true and ipa.active=true `,
      values: [pharmacyId],
    };


    let investigatorImplementationSql = {
      text: `select  irm.id, irm.research_im_title, irm.research_im_agency, irm.research_im_role,
              irm.research_im_duration, irm.research_im_project_cost
              FROM pharmacy_investigator_research_implementation pirm
              JOIN investigator_research_implementation irm ON pirm.investigator_research_implementation_id = irm.id
              WHERE pirm.pharmacy_seed_id = $1 and pirm.active=true and irm.active=true `,
      values: [pharmacyId],
    };

    let investigatorCompletedSql = {
      text: `select  irc.id, irc.research_cm_title, irc.research_cm_agency, irc.research_cm_role,
              irc.research_cm_duration, irc.research_cm_project_cost
              FROM pharmacy_investigator_research_complete pirc
              JOIN investigator_research_complete irc ON pirc.investigator_research_complete_id = irc.id
              WHERE pirc.pharmacy_seed_id = $1 and pirc.active=true and irc.active=true  `,
      values: [pharmacyId],
    };

    const educaltionalDetails = await researchDbR.query(investigatorEduSql);
    const experienceDetails = await researchDbR.query(investigatorExeSql);
    const bookDetails = await researchDbR.query(investigatorBookSql);
    const bookChapterDetails = await researchDbR.query(investigatorBookChapterSql);
    const PublicationDetails = await researchDbR.query(investigatorPubSql);
    const patentDetails = await researchDbR.query(investigatorPatentSql);
    const researchImplementationDetails = await researchDbR.query(investigatorImplementationSql);
    const completedResearchDetails = await researchDbR.query(investigatorCompletedSql);

    const promises = [educaltionalDetails, experienceDetails,
      bookDetails, bookChapterDetails, PublicationDetails, patentDetails, researchImplementationDetails, completedResearchDetails]

  return Promise.all(promises).then(([educaltionalDetails, experienceDetails,
    bookDetails, bookChapterDetails, PublicationDetails, patentDetails, researchImplementationDetails, completedResearchDetails]
) => {
      return {
          status : "Done",
          message : "Data Fetched Successfully",
          educaltionalDetails : educaltionalDetails.rows,
          experienceDetails : experienceDetails.rows,
          bookDetails : bookDetails.rows,
          bookChapterDetails : bookChapterDetails.rows,
          PublicationDetails : PublicationDetails.rows,
          patentDetails : patentDetails.rows,
          researchImplementationDetails : researchImplementationDetails.rows,
          completedResearchDetails : completedResearchDetails.rows
      }
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


module.exports.updatePharmacySeedData = async(
  pharmacyId, updatePharmacyDetails, userName, educationalData, experienceData, bookData, bookChapterData, publicationData, 
    patentData, implementationData, completedData, investorDetails,
    principalInvestigatorDetails, coInvestigatorDetails
) => {
  console.log('updatePharmacyDetails data in models ====>>>>>', updatePharmacyDetails);
  console.log('patentData ===>>>>>', patentData);

  const {invatigatorName, investigatorDesignation, investigatorAddress, invatigatorMobile, investigatorEmail, invastigatorDateOfBirth} = investorDetails;

  const {principalName, principalDsg, principalOrg, principalMob, principalEmail} = principalInvestigatorDetails;

  const {coIvestigatorName, coIvestigatorDsg, coIvestigatorOrg, coIvestigatorMob, coIvestigatorEmail} = coInvestigatorDetails;


  const {
      summaryTitle, summaryProjectTitle, projectDuration, totalCost,
      consumablesAmount, analysisAmount, otherAmount, projectTitle, researchStatus, scientificImportance, projectObjectives,
      detailedMethodology, timeLines, budgetConsumableAmount, consumablesJustification, solventsAmount, solventsJustification,
      chemicalsAmount, chemicalsJustification, biomarkersReferenceAmount, biomarkersReferenceJustifications, hplcAmount,
      hplcJustification, experimentalAnimalsAmount, experimentalAnimalsJustification, cellLinesAmount, cellLinesJustifications,
      kitsAnalysisAmount, kitsAnalysisJustifications, evaluationAnalysisAmount, evaluationAnalysisJustification, proposedOutCome,
      previousProjectExplaination, references, projectBackGround, hypothesis
      
    } = updatePharmacyDetails;
    
    
    let sql = {
      text: `UPDATE  pharmacy_seed 
                summary_title = $2, summary_objectives = $3,
                project_duration = $4, total_cost = $4, consumables_amount = $5, analysis_amount = $6, other_amount = $7,
                project_title = $8, project_status = $9, scientific_importance = $10, project_objectives = $11,
                detailed_methodology = $12, time_lines = $13, budget_consumable_amount = $14, consumables_justification = $15,
                solvents_amount = $16, solvents_justification = $17, chemicals_amount = $18, chemicals_justification = $19,
                biomarkers_reference_amount = $20, biomarkers_reference_justifications = $21, hplc_amount = $22,
                hplc_justification = $23, experimental_animals_amount = $24, experimental_animals_justification = $25,
                cell_lines_amount = $26, cell_lines_justifications = $27, kits_analysis_amount = $28, kits_analysis_justifications = $29,
                evaluation_analysis_amount = $30, evaluation_analysis_justification = $31, proposed_out_come = $32,
                previous_project_explaination = $33, pharmacy_references = $34, project_background = $35, hypothesis = $36, updated_by = $37 WHERE id = $1
            `,
      values: [ pharmacyId,
        summaryTitle, summaryProjectTitle, projectDuration, totalCost,
        consumablesAmount, analysisAmount, otherAmount, projectTitle, researchStatus, scientificImportance, projectObjectives,
        detailedMethodology, timeLines, budgetConsumableAmount, consumablesJustification, 
        solventsAmount, solventsJustification, chemicalsAmount, chemicalsJustification, 
        biomarkersReferenceAmount, biomarkersReferenceJustifications, hplcAmount, 
        hplcJustification, experimentalAnimalsAmount, experimentalAnimalsJustification, 
        cellLinesAmount, cellLinesJustifications, kitsAnalysisAmount, kitsAnalysisJustifications, 
        evaluationAnalysisAmount, evaluationAnalysisJustification, proposedOutCome, 
        previousProjectExplaination, references, projectBackGround, hypothesis, userName
      ]
    };
  console.log('sql =====>>>>>>', sql);


// Insert educational data
const insertEducation = insertOrUpdateRecords(
  educationalData, 
  'investigator_education', 
  ['course_name', 'university_name', 'passout_year'], 
  ['course_name', 'university_name', 'passout_year'], 
  userName
);

// Insert experience data
const insertExperience = insertOrUpdateRecords(
  experienceData, 
  'investigator_experience', 
  ['possition', 'organization_name', 'experience'], 
  ['possition', 'organization_name', 'experience'], 
  userName
);

// Insert book data
const insertBookDetails = insertOrUpdateRecords(
  bookData, 
  'investigator_book', 
  ['book_author', 'book_names', 'book_year', 'book_volume', 'book_publisher', 'book_isbn'], 
  ['book_author', 'book_names', 'book_year', 'book_volume', 'book_publisher', 'book_isbn'], 
  userName
);

// Insert bookChapterData data
const insertBookChapterDetails = insertOrUpdateRecords(
  bookChapterData, 
  'investigator_book_chapter', 
  ['book_chapter_author', 'book_chapter_title', 'book_chapter_names', 'book_chapter_volume',
    'book_chapter_page_number', 'book_chapter_year', 'book_chapter_publisher', 'book_chapter_isbn'], 
  ['book_chapter_author', 'book_chapter_title', 'book_chapter_names', 'book_chapter_volume',
  'book_chapter_page_number', 'book_chapter_year', 'book_chapter_publisher', 'book_chapter_isbn'], 
  userName
);

// Insert patentData data
const insertPatentDetails = insertOrUpdateRecords(
  patentData, 
  'investigator_patent', 
  ['applicant_name', 'patent_title', 'patent_status', 'patent_year', 'patent_number'], 
  ['applicant_name', 'patent_title', 'patent_status', 'patent_year', 'patent_number'], 
  userName
);

// Insert publicationData data
const insertPublicationDetails = insertOrUpdateRecords(
  publicationData, 
  'investigator_publication', 
  ['publication_author', 'publication_title', 'publication_journal_name', 
    'publication_issue', 'publication_year', 'publication_volume', 'publication_artcile_number', 'publication_impact_factor'], 
  ['publication_author', 'publication_title', 'publication_journal_name', 
  'publication_issue', 'publication_year', 'publication_volume', 'publication_artcile_number', 'publication_impact_factor'], 
  userName
);

// Insert implementationData data
const insertImplementationDetails = insertOrUpdateRecords(
  implementationData, 
  'investigator_research_implementation', 
  ['research_im_title', 'research_im_agency', 'research_im_role', 'research_im_duration', 'research_im_project_cost'], 
  ['research_im_title', 'research_im_agency', 'research_im_role', 'research_im_duration', 'research_im_project_cost'], 
  userName
);

// Insert completedData data
const insertCompletedDetails = insertOrUpdateRecords(
  completedData, 
  'investigator_research_complete', 
  ['research_cm_title', 'research_cm_agency', 'research_cm_role', 'research_cm_duration', 'research_cm_project_cost'], 
  ['research_cm_title', 'research_cm_agency', 'research_cm_role', 'research_cm_duration', 'research_cm_project_cost'], 
  userName
);

console.log('insertCompletedDetails ===>>>>', insertCompletedDetails);

// Add more datasets as needed
Promise.all([insertEducation, insertExperience, insertBookDetails, insertBookChapterDetails, insertPatentDetails, insertPublicationDetails, insertImplementationDetails, insertCompletedDetails])
    .then(async ([
    educationIds, 
    experienceIds, 
    bookDetailsIds, 
    bookChapterIds, 
    patentIds, 
    publicationIds, 
    implementationIds, 
    completedIds
  ]) => {
    console.log('All data processed, collected IDs:', {
      educationIds, 
      experienceIds, 
      bookDetailsIds, 
      bookChapterIds, 
      patentIds, 
      publicationIds, 
      implementationIds, 
      completedIds
    });
 
     await insertAllPharmacyInvestigatorRecords(pharmacyId, educationIds, userName)
     await insertAllPharmacyInvestigatorRecords(pharmacyId, experienceIds, userName)
     await insertAllPharmacyInvestigatorRecords(pharmacyId, bookDetailsIds, userName)
     await insertAllPharmacyInvestigatorRecords(pharmacyId, bookChapterIds, userName)
     await insertAllPharmacyInvestigatorRecords(pharmacyId, publicationIds, userName)
     await insertAllPharmacyInvestigatorRecords(pharmacyId, patentIds, userName)
     await insertAllPharmacyInvestigatorRecords(pharmacyId, implementationIds, userName)
     await insertAllPharmacyInvestigatorRecords(pharmacyId, completedIds, userName)

    console.log('Pharmacy investigator records inserted successfully', educationIds);
  })
  .catch(error => {
    console.error('Error processing data:', error);
  });

}




const insertOrUpdateRecords = async (data, tableName, uniqueColumns, allColumns, userName) => {
  return Promise.all(data.map(async (details) => {
    try {
      console.log(`Processing details for table ${tableName}:`, details);

      const modifiedData = data.map(details => {
        return details.slice(0, -1);
      });

      console.log('modifiedData ===>>>>>', modifiedData);

    
      let idsArray = data.map(item => item[item.length - 1]);
      console.log('idsArray ====>>>>', idsArray)

      // Check if the record exists
      const queries = idsArray.map(async (id) => {
        const existingRecord = await researchDbW.query({
          text: `SELECT * FROM ${tableName} WHERE id = $1 AND created_by = $2 AND active=true`,
          values: [id, userName],
        });
        console.log('existingRecord.rowCount ====>>>>>>>', existingRecord.rowCount)
  
        if (existingRecord.rowCount === 0) {
          // Insert new record
          const placeholders = allColumns.map((_, i) => `$${i + 1}`).join(', ');
          const result = await researchDbW.query({
            text: `INSERT INTO ${tableName} (${allColumns.join(', ')}, created_by, active) VALUES (${placeholders}, $${allColumns.length + 1}, $${allColumns.length + 2}) RETURNING id`,
            values: [...detailsWithoutId, userName, true]
          });
          console.log(`Inserted new record in ${tableName} with ID: ${result.rows[0].id}`);
          return result.rows[0];
        } else {
          // Update existing record
          const updateColumns = allColumns.map((col, i) => `${col} = $${i + 1}`).join(', ');
          const result = await researchDbW.query({
            text: `UPDATE ${tableName} SET ${updateColumns}, updated_by = $${allColumns.length + 1}, updated_at = NOW() WHERE id = $${allColumns.length + 2} RETURNING id`,
            values: [...modifiedData, userName, id]
          });
          console.log(`Updated existing record in ${tableName} with ID: ${result.rows[0].id}`);
          return result.rows[0];
        }
      });
  
      const results = await Promise.all(queries);
      console.log('All operations completed:', results);
    } catch (error) {
      console.error(`Error processing details for table ${tableName}:`, error);
      throw error;  
    }
  }));
};



async function insertIfNotExists(tableName, pharmacySeedId, relationalId, tableId, userName) {
  // console.log('tableId ankit  ===>>>>', tableId);
  // console.log(`id :::${tableId} ${tableName}`)
  return Promise.all(tableId ? tableId.map(async (element) => {
    // console.log('element id ===>>>>>>>', element.id);
    // console.log('relationalId =====>>>>>>', relationalId);

    const checkSql = {
      text: `SELECT *  FROM ${tableName} WHERE pharmacy_seed_id = $1 AND ${relationalId} = $2 AND created_by = $3 AND active = true`,
      values: [pharmacySeedId, element.id, userName],
    }

    // console.log(`Executing SQL for ${tableName} check:`, checkSql);

    const result = await researchDbW.query(checkSql);
    // console.log('result row count ===>>>>>>', result.rowCount)

    if (result.rowCount === 0) {
      // console.log(`No existing record found. Inserting into ${tableName}.`);

      const insertSql = {
        text: `insert into ${tableName} (pharmacy_seed_id, ${relationalId}, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
        values: [pharmacySeedId, element.id, userName, true],
      };

      // console.log(`Executing SQL for ${tableName} insert:`, insertSql);

      return researchDbW.query(insertSql);
    } else {
      // console.log(`Record already exists in ${tableName}. Skipping insert.`);
      return null;
    }
  }) : null);
}


const insertAllPharmacyInvestigatorRecords = async (pharmacySeedId, tableId, userName) => {
  // console.log('tableId ++++>>>>>>', tableId)
  try {
    const insertPharmacyEducation = insertIfNotExists('pharmacy_investigator_education', pharmacySeedId,  'investigator_education_id', tableId, userName);
    const insertPharmacyExperience = insertIfNotExists('pharmacy_investigator_experience', pharmacySeedId, 'investigator_experience_id', tableId, userName);
    const insertPharmacyBook = insertIfNotExists('pharmacy_investigator_book', pharmacySeedId, 'investigator_book_id', tableId, userName);
    const insertPharmacyBookChapter = insertIfNotExists('pharmacy_investigator_book_chapter', pharmacySeedId, 'investigator_book_chapter_id', tableId, userName);
    const insertPharmacyPublication = insertIfNotExists('pharmacy_investigator_publication', pharmacySeedId, 'investigator_publication_id', tableId, userName);
    const insertPharmacyPatent = insertIfNotExists('pharmacy_investigator_patent', pharmacySeedId, 'investigator_patent_id', tableId, userName);
    const insertPharmacyImplementation = insertIfNotExists('pharmacy_investigator_research_implementation', pharmacySeedId, 'investigator_research_implementation_id', tableId, userName);
    const insertPharmacyCompleted = insertIfNotExists('pharmacy_investigator_research_complete', pharmacySeedId, 'investigator_research_complete_id', tableId, userName);

    const results = await Promise.all([
      insertPharmacyEducation,
      insertPharmacyExperience,
      insertPharmacyBook,
      insertPharmacyBookChapter,
      insertPharmacyPublication,
      insertPharmacyPatent,
      insertPharmacyImplementation,
      insertPharmacyCompleted
    ]);

    // console.log('All data inserted:', results);
  } catch (error) {
    // console.error('Error inserting data:', error);
  }
};



