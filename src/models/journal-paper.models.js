const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

const insertDbModels = require('./insert-update-records.models')

// for fetching journal paper data
module.exports.fetchJournalPaper = async (userName) => {
  let sql = {
    text: ` SELECT
                    jpa.id AS article_id,
                    jpa.title_of_paper,
                    jpa.total_authors,
                    jpa.others_authers,
                    jpa.nmims_authors_count,
                    jpa.journal_name,
                    jpa.publisher,
                    jpa.pages,
                    jpa.issn_no,
                    jpa.uid,
                    jpa.nmims_campus,
                    jpa.nmims_school,
                    jpa.year,
                    jpa.impact_factor,
                    jpa.article_type,
                    jpa.date_of_publishing,
                    jpa.scs_cite_score,
                    jpa.scs_indexed,
                    jpa.abdc_indexed,
                    jpa.gs_index,
                    jpa.wos_indexed,
                    jpa.ugc_indexed,
                    jpa.web_link_doi,
                    jpa.nmims_student_foreign_authors,
                    jpa.foreign_authors_name,
                    jpa.foreign_auhtor_no,
                    jpa.article_supporting_documents,
                    jpa.no_nmims_student_author,
                    string_agg(DISTINCT pc.cadre_name, ', ') AS policy_cadre,
                    string_agg(DISTINCT pc.id::text, ', ') AS policy_cadre_ids,
                    string_agg(DISTINCT f.faculty_name, ', ') AS internal_faculty_names,
                    string_agg(DISTINCT f.id::text, ', ') AS nmims_facilty_id,
                    string_agg(DISTINCT a.faculty_name, ', ') AS all_article_authors_names,
                    string_agg(DISTINCT a.id::text, ', ') AS articles_faculties_ids
                    
                FROM
                    journal_paper_article jpa

                LEFT JOIN
                    nmims_faculties nf ON jpa.id = nf.journal_article_id
                LEFT JOIN
                    faculties f ON nf.faculty_id = f.id
                LEFT JOIN
                    all_article_authors aa ON jpa.id = aa.journal_article_id
                LEFT JOIN
                    faculties a ON aa.faculty_id = a.id
                LEFT JOIN
                    journal_article_policy_cadre japc ON jpa.id = japc.journal_article_id
                LEFT JOIN
                    policy_cadre pc ON japc.policy_cadre_id = pc.id
                where jpa.created_by = $1 and pc.active=true and japc.active=true and a.active=true and aa.active=true and f.active=true 
                and nf.active=true
                and jpa.active=true
                   
                GROUP BY
                    jpa.id,
                    jpa.title_of_paper,
                    jpa.total_authors,
                    jpa.nmims_authors_count,
                    jpa.journal_name,
                    jpa.publisher,
                    jpa.pages,
                    jpa.issn_no,
                    jpa.year,
                    jpa.nmims_campus,
                    jpa.nmims_school,
                    jpa.impact_factor,
                    jpa.article_type,
                    jpa.date_of_publishing,
                    jpa.scs_cite_score,
                    jpa.scs_indexed,
                    jpa.abdc_indexed,
                    jpa.wos_indexed,
                    jpa.ugc_indexed,
                    jpa.nmims_student_foreign_authors,
                    jpa.foreign_authors_name,
                    jpa.foreign_auhtor_no,
                    jpa.no_nmims_student_author,
                    jpa.web_link_doi,
                    jpa.article_supporting_documents
                ORDER BY
                    article_id desc`,
    values: [userName],
  };

  let internalEmpSql = {
    text: `select *  FROM faculties WHERE faculty_type_id = 1 and active=true`,
  };

  let journalPaperSql = {
    text: `select *  FROM journal_paper_article  where active=true  ORDER BY id`,
  };

  let supportingoDcumentsSql = {
    text: `select *  FROM supporting_documents  where active=true  ORDER BY id`,
  };

  let allAuthorsSql = {
    text: `select id,faculty_name,faculty_type_id  FROM faculties  where active=true  ORDER BY id`,
  };

  let nmimsSchoolSql = {
    text: `select *  FROM nmims_school  where active=true  ORDER BY id`,
  };

  let nmimsCampusSql = {
    text: `select *  FROM nmims_campus  where active=true  ORDER BY id`,
  };

  let policyCadreSql = {
    text: `select *  FROM policy_cadre  where active=true  ORDER BY id`,
  };

  let impactFactorSql = {
    text: `select *  FROM impact_factor where active=true  ORDER BY id`,
  };

  console.log("sql ==>>", sql);
  const journalArticleData = await researchDbR.query(sql);
  const nmimsSchool = await researchDbR.query(nmimsSchoolSql);
  const nmimsFaculty = await researchDbR.query(internalEmpSql);
  const nmimsCampus = await researchDbR.query(nmimsCampusSql);
  const policyCadre = await researchDbR.query(policyCadreSql);
  const impactFactor = await researchDbR.query(impactFactorSql);
  const journalPaper = await researchDbR.query(journalPaperSql);
  const allAuthorList = await researchDbR.query(allAuthorsSql);

  const promises = [
    journalArticleData,
    nmimsSchool,
    nmimsFaculty,
    nmimsCampus,
    policyCadre,
    impactFactor,
    journalPaper,
    allAuthorList,
  ];

  return Promise.all(promises)
    .then(
      ([
        journalArticleData,
        nmimsSchool,
        nmimsFaculty,
        nmimsCampus,
        policyCadre,
        impactFactor,
        journalPaper,
        allAuthorList,
      ]) => {
        return {
          status: "Done",
          message: "Data Fetched Successfully",
          journalArticleData: journalArticleData.rows,
          rowCount: journalArticleData.rowCount,
          nmimsSchool: nmimsSchool.rows,
          internalEmpList: nmimsFaculty.rows,
          nmimsCampus: nmimsCampus.rows,
          policyCadre: policyCadre.rows,
          impactFactor: impactFactor.rows,
          allAuthorList: allAuthorList.rows,
        };
      }
    )
    .catch((error) => {
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
};

// for inserting journal paper  data
module.exports.insertJournalArticle = async (
  journalDetails, articleFilesNameArray, policyCadreArray, allAuthorsArray, nmimsAuthorsArray, journalFiles,
  userName) => {
  console.log("journalDetails in models ==>>", journalDetails);
  const {nmimsSchool, nmimsCampus, year, publisher, totalAuthors, journalName, otherAuthorsNames, pages, issnNo,
    scsCiteScore, wosIndexedCategory, abdcIndexedCategory, ugcIndexedCategory, webLinkNumber, uid, dateOfPublishing,
    titleOfPaper, journalCategory, nmimsAuthorsCount, gsIndex, nmimsStudentForeignAuthors, foreignAuthorsName,
    foreignAuhtorNo, noNmimsStudentAuthor, scsIndex, impactFactor
  } = journalDetails;

    // insert into journal_paper_article
    const journalArticleValues = [
      nmimsSchool, nmimsCampus, year, publisher, totalAuthors, journalName, otherAuthorsNames, pages, issnNo,
      scsCiteScore, wosIndexedCategory, abdcIndexedCategory, ugcIndexedCategory, webLinkNumber, uid, dateOfPublishing,
      titleOfPaper, journalCategory, nmimsAuthorsCount, gsIndex, nmimsStudentForeignAuthors, foreignAuthorsName,
      foreignAuhtorNo, noNmimsStudentAuthor, scsIndex, impactFactor, journalFiles, userName
    ];

    const articleDbFields = ['nmims_school', 'nmims_campus', 'year', 'publisher', 'total_authors', 'journal_name', 'others_authers', 'pages', 'issn_no', 'scs_cite_score', 'wos_indexed',
      'abdc_indexed', 'ugc_indexed', 'web_link_doi', 'uid', 'date_of_publishing', 'title_of_paper', 'article_type', 'nmims_authors_count', 'gs_index', 'nmims_student_foreign_authors',
      'foreign_authors_name', 'foreign_auhtor_no', 'no_nmims_student_author', 'scs_indexed', 'impact_factor', 'article_supporting_documents', 'created_by'];

    const insertJournalDetails = await insertDbModels.insertRecordIntoMainDb('journal_paper_article', articleDbFields, journalArticleValues, userName);
    console.log('insertJournalDetails   =====>>>>>', insertJournalDetails);
    const journalPaperId = insertJournalDetails.insertedId;
    console.log('journalPaperId ===>>>>>>>', journalPaperId)

    // insert intop journal_article_policy_cadre
    const policyCadreFields = ['journal_article_id', 'policy_cadre_id', 'created_by']
    const insertArticlePolicyCadre = await insertDbModels.insertIntoRelationalDb('journal_article_policy_cadre', policyCadreFields, journalPaperId, policyCadreArray, userName);
    console.log('insertArticlePolicyCadre ====>>>>>>>', insertArticlePolicyCadre);

    // insert intop all_article_authors
    const articleAuthorsFields = ['journal_article_id', 'faculty_id', 'created_by']
    const insertAllArticleAuthors = await insertDbModels.insertIntoRelationalDb('all_article_authors', articleAuthorsFields, journalPaperId, allAuthorsArray, userName);
    console.log('insertAllArticleAuthors ====>>>>>', insertAllArticleAuthors)

    // insert intop nmims_faculties
    const InternalAuthorsFields = ['journal_article_id', 'faculty_id', 'created_by']
    const insertInternalAuthors = await insertDbModels.insertIntoRelationalDb('nmims_faculties', InternalAuthorsFields, journalPaperId, nmimsAuthorsArray, userName);
    console.log('insertInternalAuthors ====>>>>>', insertInternalAuthors);

         // Check if all insertions are successful
  if (
    insertJournalDetails.status === 'Done' &&
    insertInternalAuthors.status === 'Done' &&
    insertAllArticleAuthors.status === 'Done' &&
    insertArticlePolicyCadre.status === 'Done'
  ) {
    return {
      status: 'Done',
      message: 'All records inserted successfully'
    };
  } else {
    return {
      status: 'Failed',
      message: 'Failed to insert'
    };
  }

    
  
};

// for deleting journal paper  data
module.exports.deleteJournalPaper = async ({ journalPaperId }) => {
  console.log("journalPaperId in models ====>>>>>>", journalPaperId);

  const articleDocSql = {
    // text : `DELETE FROM journal_article_documents WHERE journal_article_id = $1 `,
    text: `update journal_article_documents set active=false WHERE journal_article_id = $1 `,
    values: [journalPaperId],
  };

  const articlSchSql = {
    //   text: `DELETE FROM journal_article_school WHERE journal_article_id = $1 `,
    text: `update journal_article_school set active=false WHERE journal_article_id = $1 `,
    values: [journalPaperId],
  };

  const articleCamSql = {
    //text : `DELETE FROM journal_article_campus WHERE journal_article_id = $1 `,
    text: `update journal_article_campus set active=false WHERE journal_article_id = $1 `,
    values: [journalPaperId],
  };

  // const articleFactorSql = {
  //   // text : `DELETE FROM journal_article_impact_factor WHERE journal_article_id = $1 `,
  //   text: `update journal_article_impact_factor set active=false WHERE journal_article_id = $1 `,

  //   values: [journalPaperId],
  // };

  const articlePolicySql = {
    // text : `DELETE FROM journal_article_policy_cadre WHERE journal_article_id = $1 `,
    text: `update journal_article_policy_cadre set active=false WHERE journal_article_id = $1 `,

    values: [journalPaperId],
  };

  const articleInternalAuthorSql = {
    //  text: `DELETE FROM nmims_faculties WHERE journal_article_id = $1 `,
    text: `update nmims_faculties set active=false WHERE journal_article_id = $1 `,
    values: [journalPaperId],
  };

  const articleAllauthorsSql = {
    // text : `DELETE FROM all_article_authors WHERE journal_article_id = $1 `,
    text: `update all_article_authors set active=false WHERE journal_article_id = $1 `,

    values: [journalPaperId],
  };

  const deleteArticleAllAuthors = await researchDbW.query(articleAllauthorsSql);
  const deleteNmimsArticleAuthors = await researchDbW.query(
    articleInternalAuthorSql
  );
  const deleteArticleDocuments = await researchDbW.query(articleDocSql);
  const deleteArticleSchools = await researchDbW.query(articlSchSql);
  const deleteArticleCampus = await researchDbW.query(articleCamSql);
  // const deleteArlicleFactor = await researchDbW.query(articleFactorSql);
  const deleteArticlePolicy = await researchDbW.query(articlePolicySql);

  const deletePromises = [
    deleteArticleAllAuthors,
    deleteArticleDocuments,
    deleteNmimsArticleAuthors,
    deleteArticleSchools,
    deleteArticleCampus,
    // deleteArlicleFactor,
    deleteArticlePolicy,
  ];

  return Promise.all(deletePromises)
    .then((result) => {
      // console.log('result ==>>>>', result);
      return researchDbW.query({
        //   text : `DELETE FROM journal_paper_article WHERE id = $1 `,
        text: `update journal_paper_article set active=false WHERE id = $1 `,
        values: [journalPaperId],
      });
    })
    .then((finalResult) => {
      // console.log('finalResult ===>>>>>>', finalResult);
      return {
        status: "Done",
        message: "Record deleted successfully",
        nmimsFacultyRowCount: deleteNmimsArticleAuthors.rowCount,
        allAuthorRowCount: deleteArticleAllAuthors.rowCount,
        documentsRowCount: deleteArticleDocuments.rowCount,
        campusRowCount: deleteArticleCampus.rowCount,
        schoolRowcount: deleteArticleSchools.rowCount,
        // factorRowCount: deleteArlicleFactor.rowCount,
        policyRowCount: deleteArticlePolicy.rowCount,
      };
    })
    .catch((error) => {
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
};
// for updating
module.exports.updateJournalPaperData = async (
  journalPaperId, updateJournalDetails, updateNmimsAuthorsArray, updatePolicyCadreArray, updateAllAuthorsArray, updatedArticleFilesNameArray,
  journalFiles, userName) => {
  console.log("updateJournalDetails in models:", updateJournalDetails);
  console.log("journalFiles ===>>>>", journalFiles);

  // Extract variables from updateJournalDetails
  const {
    nmimsSchool, nmimsCampus, year, publisher, totalAuthors, journalName, otherAuthorsNames, pages, issnNo,
    scsCiteScore, wosIndexedCategory, abdcIndexedCategory, ugcIndexedCategory, webLinkNumber, uid, dateOfPublishing,
    titleOfPaper, journalCategory, nmimsAuthorsCount, gsIndex, nmimsStudentForeignAuthors, foreignAuthorsName,
    foreignAuhtorNo, noNmimsStudentAuthor, scsIndex, impactFactor
  } = updateJournalDetails;

  let updateJournalArticles;

  if(journalFiles){
     // insert into journal_paper_article
     const journalArticleValues = [
      nmimsSchool, nmimsCampus, year, publisher, totalAuthors, journalName, otherAuthorsNames, pages, issnNo,
      scsCiteScore, wosIndexedCategory, abdcIndexedCategory, ugcIndexedCategory, webLinkNumber, uid, dateOfPublishing,
      titleOfPaper, journalCategory, nmimsAuthorsCount, gsIndex, nmimsStudentForeignAuthors, foreignAuthorsName,
      foreignAuhtorNo, noNmimsStudentAuthor, scsIndex, impactFactor, journalFiles, userName, journalPaperId
    ];

    const articleDbFields = ['nmims_school', 'nmims_campus', 'year', 'publisher', 'total_authors', 'journal_name', 'others_authers', 'pages', 'issn_no', 'scs_cite_score', 'wos_indexed',
      'abdc_indexed', 'ugc_indexed', 'web_link_doi', 'uid', 'date_of_publishing', 'title_of_paper', 'article_type', 'nmims_authors_count', 'gs_index', 'nmims_student_foreign_authors',
      'foreign_authors_name', 'foreign_auhtor_no', 'no_nmims_student_author', 'scs_indexed', 'impact_factor', 'article_supporting_documents', 'updated_by'];

      updateJournalArticles = await insertDbModels.updateFieldWithFiles('journal_paper_article', articleDbFields, journalArticleValues, userName);
    console.log('updateJournalArticles   =====>>>>>', updateJournalArticles);
    
  } 

  else{
    const journalArticleValues = [
      nmimsSchool, nmimsCampus, year, publisher, totalAuthors, journalName, otherAuthorsNames, pages, issnNo,
      scsCiteScore, wosIndexedCategory, abdcIndexedCategory, ugcIndexedCategory, webLinkNumber, uid, dateOfPublishing,
      titleOfPaper, journalCategory, nmimsAuthorsCount, gsIndex, nmimsStudentForeignAuthors, foreignAuthorsName,
      foreignAuhtorNo, noNmimsStudentAuthor, scsIndex, impactFactor, userName, journalPaperId
    ];

    const articleDbFields = ['nmims_school', 'nmims_campus', 'year', 'publisher', 'total_authors', 'journal_name', 'others_authers', 'pages', 'issn_no', 'scs_cite_score', 'wos_indexed',
      'abdc_indexed', 'ugc_indexed', 'web_link_doi', 'uid', 'date_of_publishing', 'title_of_paper', 'article_type', 'nmims_authors_count', 'gs_index', 'nmims_student_foreign_authors',
      'foreign_authors_name', 'foreign_auhtor_no', 'no_nmims_student_author', 'scs_indexed', 'impact_factor', 'updated_by'];

    updateJournalArticles = await insertDbModels.updateFieldWithOutFiles('journal_paper_article', articleDbFields, journalArticleValues, userName);
    console.log('updateJournalArticles   =====>>>>>', updateJournalArticles);

     
  } 

     // insert intop journal_article_policy_cadre
     const policyCadreFields = ['journal_article_id', 'policy_cadre_id', 'created_by']
     const updateArticlePolicyCadre = await insertDbModels.insertOrUpdateRelationalDb('journal_article_policy_cadre', policyCadreFields, journalPaperId, updatePolicyCadreArray, userName);
     console.log('updateArticlePolicyCadre ====>>>>>>>', updateArticlePolicyCadre);
 
     // insert intop all_article_authors
     const articleAuthorsFields = ['journal_article_id', 'faculty_id', 'updated_by']
     const updateAllArticleAuthors = await insertDbModels.insertOrUpdateRelationalDb('all_article_authors', articleAuthorsFields, journalPaperId, updateAllAuthorsArray, userName);
     console.log('updateAllArticleAuthors ====>>>>>', updateAllArticleAuthors)
 
     // insert intop nmims_faculties
     const InternalAuthorsFields = ['journal_article_id', 'faculty_id', 'updated_by']
     const updateInternalAuthors = await insertDbModels.insertOrUpdateRelationalDb('nmims_faculties', InternalAuthorsFields, journalPaperId, updateNmimsAuthorsArray, userName);
     console.log('updateInternalAuthors ====>>>>>', updateInternalAuthors);
 
    // Check if all insertions are successful
 

   if (
    updateJournalArticles &&
     updateInternalAuthors &&
     updateAllArticleAuthors &&
     updateArticlePolicyCadre
  ) {
    return {
      status: 'Done',
      message: 'All Records updated',
    };
  } else {
    return {
      status: 'Failed',
      message: 'Failed to update'
    };
  }

}
  



// for viewing
module.exports.viewJournalPaperData = async (journalPaperId, userName) => {
  const sql = {
    text: `SELECT
                    jpa.id AS article_id,
                    jpa.title_of_paper,
                    jpa.created_by AS created_by,
                    jpa.total_authors,
                    jpa.others_authers,
                    jpa.nmims_authors_count,
                    jpa.nmims_campus,
                    jpa.nmims_school,
                    jpa.journal_name,
                    jpa.publisher,
                    jpa.pages,
                    jpa.issn_no,
                    jpa.uid,
                    jpa.year,
                    jpa.article_type,
                    jpa.date_of_publishing,
                    jpa.scs_cite_score,
                    jpa.scs_indexed,
                    jpa.abdc_indexed,
                    jpa.gs_index,
                    jpa.wos_indexed,
                    jpa.ugc_indexed,
                    jpa.web_link_doi,
                    jpa.impact_factor,
                    jpa.nmims_student_foreign_authors,
                    jpa.foreign_authors_name,
                    jpa.foreign_auhtor_no,
                    jpa.article_supporting_documents,
                    jpa.no_nmims_student_author,
                    string_agg(DISTINCT pc.cadre_name, ', ') AS policy_cadre,
                    string_agg(DISTINCT pc.id::text, ', ') AS policy_cadre_ids,
                    string_agg(DISTINCT f.faculty_name, ', ') AS internal_faculty_names,
                    string_agg(DISTINCT f.id::text, ', ') AS nmims_facilty_id,
                    string_agg(DISTINCT a.faculty_name, ', ') AS all_article_authors_names,
                    string_agg(DISTINCT a.id::text, ', ') AS articles_faculties_ids
                FROM
                    journal_paper_article jpa
                LEFT JOIN
                    nmims_faculties nf ON jpa.id = nf.journal_article_id
                LEFT JOIN
                    faculties f ON nf.faculty_id = f.id
                LEFT JOIN
                    all_article_authors aa ON jpa.id = aa.journal_article_id
                LEFT JOIN
                    faculties a ON aa.faculty_id = a.id
                LEFT JOIN
                    journal_article_policy_cadre japc ON jpa.id = japc.journal_article_id
                LEFT JOIN
                    policy_cadre pc ON japc.policy_cadre_id = pc.id
                WHERE 
                         jpa.id = $1 AND jpa.created_by = $2 
                         and pc.active = true and japc.active = true and a.active = true 
                         and f.active = true and nf.active = true and jpa.active = true
                GROUP BY
                    jpa.id,
                    jpa.title_of_paper,
                    jpa.total_authors,
                    jpa.nmims_authors_count,
                    jpa.journal_name,
                    jpa.publisher,
                    jpa.pages,
                    jpa.issn_no,
                    jpa.year,
                    jpa.nmims_campus,
                    jpa.nmims_school,
                    jpa.impact_factor,
                    jpa.article_type,
                    jpa.date_of_publishing,
                    jpa.scs_cite_score,
                    jpa.scs_indexed,
                    jpa.abdc_indexed,
                    jpa.wos_indexed,
                    jpa.nmims_campus,
                    jpa.nmims_school,
                    jpa.ugc_indexed,
                    jpa.web_link_doi,
                    jpa.nmims_student_foreign_authors,
                    jpa.foreign_authors_name,
                    jpa.foreign_auhtor_no,
                    jpa.no_nmims_student_author,
                    jpa.article_supporting_documents`,
                   

    values: [journalPaperId, userName],
  };

  const nmimsAuthorsSql = {
    text: `SELECT
                    f.faculty_name,
                    f.designation,
                    f.institution_name,
                    f.address
                    
                FROM
                    nmims_faculties nf
                JOIN
                    faculties f ON nf.faculty_id = f.id
                WHERE
                    nf.journal_article_id = $1 and nf.active = true and f.active = true`,

    values: [journalPaperId],
  };

  const allauthorsSql = {
    text: `SELECT
                    f.faculty_name,
                    f.designation,
                    f.institution_name,
                    f.address,
                    ft.name AS faculty_type
                FROM
                all_article_authors aaa
                JOIN
                    faculties f ON aaa.faculty_id = f.id
                JOIN
                    faculty_types ft ON f.faculty_type_id = ft.id
                WHERE
                    aaa.journal_article_id = $1 and aaa.active = true and  ft.active = true `,
    values: [journalPaperId],
  };

  // const factorSql = {
  //   text: `SELECT 
  //                   imf.impact_factor,
  //                   imf.id
  //               FROM 
  //               journal_article_impact_factor aimf 
  //               JOIN 
  //               impact_factor imf ON aimf.impact_factor_id =  imf.id
  //               WHERE 
  //               aimf.journal_article_id = $1 and aimf.active = true and imf.active = true `,
  //   values: [journalPaperId],
  // };

  const policyCadreSql = {
    text: `SELECT 
                    pc.impact_factor,
                    pc.id
                FROM 
                journal_article_policy_cadre japc  
                JOIN 
                impact_factor pc ON japc.policy_cadre_id =  pc.id
                WHERE 
                japc.journal_article_id = $1 and japc.active = true and pc.active = true `,
    values: [journalPaperId],
  };

  const articleSchoolSql = {
    text: `SELECT 
                    ns.school_name,
                    ns.id
                FROM 
                journal_article_school jas 
                JOIN 
                    nmims_school ns ON jas.school_id =  ns.id
                WHERE 
                    jas.journal_article_id = $1`,
    values: [journalPaperId],
  };

  const articleCampusSql = {
    text: `SELECT 
                    nc.campus_name,
                    nc.id
                FROM
                journal_article_campus jac 
                JOIN 
                    nmims_campus nc ON jac.campus_id = nc.id
                WHERE
                    jac.journal_article_id = $1 and jac.active = true and nc.active = true `,
    values: [journalPaperId],
  };

  const articleDocumentsSql = {
    text: `SELECT 
                    sd.documents_name,
                    sd.id
                FROM
                journal_article_documents jad 
                JOIN 
                    supporting_documents sd ON jad.supporting_documents_id = sd.id
                WHERE
                    jad.journal_article_id = $1 and jad.active = true and sd.active = true`,
    values: [journalPaperId],
  };

  const journalAricleData = await researchDbW.query(sql);
  const nmimsAuthors = await researchDbR.query(nmimsAuthorsSql);
  const allAuthorsData = await researchDbR.query(allauthorsSql);
  const articleSchoolData = await researchDbR.query(articleSchoolSql);
  const articleCampusData = await researchDbR.query(articleCampusSql);
  const articleDocuments = await researchDbR.query(articleDocumentsSql);
  // const articleImpactFactor = await researchDbR.query(factorSql);
  const articlePolicyCadre = await researchDbR.query(policyCadreSql);

  const viewPromises = [
    journalAricleData,
    nmimsAuthors,
    allAuthorsData,
    articleSchoolData,
    articleCampusData,
    articleDocuments,
    // articleImpactFactor,
    articlePolicyCadre,
  ];

  return Promise.all(viewPromises)
    .then(
      ([
        journalAricleData,
        nmimsAuthors,
        allAuthorsData,
        articleSchoolData,
        articleCampusData,
        articleDocuments,
        // articleImpactFactor,
        articlePolicyCadre,
      ]) => {
        return {
          status: "Done",
          message: "Record Fetched Successfully",
          journalAricleData: journalAricleData.rows[0],
          nmimsAuthors: nmimsAuthors.rows,
          allAuthorsData: allAuthorsData.rows,
          articleSchoolData: articleSchoolData.rows,
          articleCampusData: articleCampusData.rows,
          articleDocuments: articleDocuments.rows,
          // articleImpactFactor: articleImpactFactor.rows,
          articlePolicyCadre: articlePolicyCadre.rows,
        };
      }
    )
    .catch((error) => {
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
};

//all authors 
module.exports.deleteAllAuthorsDetails = async(externalId, journalPaperId, userName) => {
  console.log('externalId in models  =====>>>>>>>', externalId);

  const allAuthorsDetails = externalId.map(async(externalId) => {
    let externalSql = {
      text : `UPDATE all_article_authors SET active=false WHERE faculty_id = $1 AND journal_article_id = $2`,
      values : [externalId, journalPaperId]
    }
    console.log('externalSql', externalSql);
  
    return await researchDbW.query(externalSql);

  });

  return Promise.all(allAuthorsDetails).then((result) => {
    return {
      status : "Done",
      message : "Record Deleted successfully",
      result : result
    } 
  }).catch((error) => {
    return {
      status: "Failed",
      message: error.message,
      errorCode: error.code,
    };
  });


}

//nmims internal  authors 
module.exports.deleteInternalFaculty = async(internalId, journalPaperId, userName) => {
  console.log("internalId in models ====>>>>>>", internalId);

  const internalNmimsDetails = internalId.map(async(internalId) => {
    let sql = {
      text: `UPDATE  nmims_faculties  SET active = false WHERE faculty_id = $1 And journal_article_id = $2`,
      values: [internalId, journalPaperId],
    };
    console.log("sql ===>>>>>>>>>", sql);
    return await researchDbW.query(sql)

  })
 
  return Promise.all(internalNmimsDetails).then((result) => {
    return {
      status : "Done",
      message : "Record Deleted successfully",
      result : result
    } 
  }).catch((error) => {
    return {
      status: "Failed",
      message: error.message,
      errorCode: error.code,
    };
  });

}

//nmims school
module.exports.deleteNmimsSchool = async (internalId, journalPaperId, userName) => {
  console.log("internalId in models ====>>>>>>", internalId);

  const nmimsArticleSchoolsPromises = internalId.map(async (id) => {
    let sql = {
      text: `UPDATE journal_article_school SET active = false WHERE school_id = $1 And journal_article_id = $2`,
      values: [id, journalPaperId],
    };

    return await researchDbW.query(sql);
  });

  return await Promise.all(nmimsArticleSchoolsPromises)
    .then((result) => {
      return {
        status: "Done",
        message: "Record Deleted successfully",
        result: result,
      };
    })
    .catch((error) => {
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
};

//nmims campus
module.exports.deleteNmimsCampus = async(internalId, journalPaperId, userName) => {

  console.log("internalId in models ====>>>>>>", internalId);
  const articleCampus = internalId.map(async(internalId) => {
    let sql = {
      text: `UPDATE  journal_article_campus  SET active = false WHERE campus_id = $1 And journal_article_id = $2`,
      values: [internalId, journalPaperId],
    };
    console.log("sql ===>>>>>>>>>", sql);
    return await researchDbW.query(sql);

  })
  
  return Promise.all(articleCampus).then((result) => {
    return {
      status : "Done",
      message : "Record Deleted successfully",
      result : result
    } 
  }).catch((error) => {
    return {
      status: "Failed",
      message: error.message,
      errorCode: error.code,
    };
  });

}
//nmims policy cadre
module.exports.deletPolicyCadre = async(internalId, journalPaperId, userName) => {
  console.log('internalId in models ====>>>>>>', internalId);

  const articlePolicyCadre = internalId.map(async(internalId) => {
    let policysql = {
      text: `UPDATE  journal_article_policy_cadre  SET active = false WHERE policy_cadre_id = $1 And journal_article_id = $2`,
      values: [internalId, journalPaperId]
    };

    console.log('policysql ===>>>>>>', policysql);
    return await researchDbW.query(policysql);
  })

  return Promise.all(articlePolicyCadre).then((result) => {
      return {
        status : "Done",
        message : "Record Deleted successfully",
        result : result
      } 
    }).catch((error) => {
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
}
