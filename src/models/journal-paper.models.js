const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

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
                    jpa.year,
                    jpa.impact_factor,
                    jpa.jorunal_article_type_id,
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
                    string_agg(DISTINCT sd.documents_name, ', ') AS supporting_documents,
                    string_agg(DISTINCT sd.id::text, ', ') AS supporting_documents_ids,
                    string_agg(DISTINCT pc.cadre_name, ', ') AS policy_cadre,
                    string_agg(DISTINCT pc.id::text, ', ') AS policy_cadre_ids,
                    string_agg(DISTINCT f.faculty_name, ', ') AS internal_faculty_names,
                    string_agg(DISTINCT f.id::text, ', ') AS nmims_facilty_id,
                    string_agg(DISTINCT a.faculty_name, ', ') AS all_article_authors_names,
                    string_agg(DISTINCT a.id::text, ', ') AS articles_faculties_ids,
                    string_agg(DISTINCT ns.school_name, ', ') AS associated_schools,
                    string_agg(DISTINCT ns.id::text, ', ') AS school_id,
                    string_agg(DISTINCT nc.campus_name, ', ') AS associated_campuses,
                    string_agg(DISTINCT nc.id::text, ', ') AS campus_id
                FROM
                    journal_paper_article jpa
                LEFT JOIN
                    journal_article_school jas ON jpa.id = jas.journal_article_id
                LEFT JOIN
                    nmims_school ns ON jas.school_id = ns.id
                LEFT JOIN
                    journal_article_campus jac ON jpa.id = jac.journal_article_id
                LEFT JOIN
                    nmims_campus nc ON jac.campus_id = nc.id
                LEFT JOIN
                    nmims_faculties nf ON jpa.id = nf.journal_article_id
                LEFT JOIN
                    faculties f ON nf.faculty_id = f.id
                LEFT JOIN
                    all_article_authors aa ON jpa.id = aa.journal_article_id
                LEFT JOIN
                    faculties a ON aa.faculty_id = a.id
                LEFT JOIN
                    journal_article_documents jad ON jpa.id = jad.journal_article_id
                LEFT JOIN
                    supporting_documents sd ON jad.supporting_documents_id = sd.id
                LEFT JOIN
                    journal_article_policy_cadre japc ON jpa.id = japc.journal_article_id
                LEFT JOIN
                    policy_cadre pc ON japc.policy_cadre_id = pc.id
                where jpa.created_by = $1 and pc.active=true and japc.active=true and sd.active=true
                and jad.active=true and a.active=true and aa.active=true and f.active=true 
                and nf.active=true and nc.active=true 
                and jac.active=true and ns.active=true and jpa.active=true and jas.active=true
                   
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
                    jpa.impact_factor,
                    jpa.jorunal_article_type_id,
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
                    jpa.id desc`,
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
    text: `select *  FROM faculties  where active=true  ORDER BY id`,
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
  journalDetails,
  articleFilesNameArray,
  schoolIdsArray,
  campusIdsArray,
  policyCadreArray,
  allAuthorsArray,
  nmimsAuthorsArray,
  journalFiles,
  userName
) => {
  console.log("journalDetails in models ==>>", journalDetails);
  const {
    year,
    publisher,
    totalAuthors,
    journalName,
    countOtherFaculty,
    pages,
    issnNo,
    scsCiteScore,
    wosIndexedCategory,
    abdcIndexedCategory,
    ugcIndexedCategory,
    webLinkNumber,
    uid,
    dateOfPublishing,
    titleOfPaper,
    journalCategory,
    nmimsAuthorsCount,
    gsIndex,
    nmimsStudentForeignAuthors,
    foreignAuthorsName,
    foreignAuhtorNo,
    noNmimsStudentAuthor,
    scsIndex,
    impactFactor,
  } = journalDetails;

  let articleSql = {
    text: `INSERT INTO journal_paper_article (year, publisher, total_authors, journal_name, others_authers, pages, issn_no, scs_cite_score, wos_indexed,
                abdc_indexed, ugc_indexed, web_link_doi, uid, date_of_publishing, title_of_paper, jorunal_article_type_id, nmims_authors_count, gs_index, nmims_student_foreign_authors,
                foreign_authors_name, foreign_auhtor_no, no_nmims_student_author, scs_indexed, article_supporting_documents, impact_factor, created_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26) RETURNING id`,

    values: [
      year,
      publisher,
      totalAuthors,
      journalName,
      countOtherFaculty,
      pages,
      issnNo,
      scsCiteScore,
      wosIndexedCategory,
      abdcIndexedCategory,
      ugcIndexedCategory,
      webLinkNumber,
      uid,
      dateOfPublishing,
      titleOfPaper,
      journalCategory,
      nmimsAuthorsCount,
      gsIndex,
      nmimsStudentForeignAuthors,
      foreignAuthorsName,
      foreignAuhtorNo,
      noNmimsStudentAuthor,
      scsIndex,
      journalFiles,
      impactFactor,
      userName,
    ],
  };

  console.log("articleSql ==>>", articleSql);

  const insertDocumentPromises = articleFilesNameArray
    ? articleFilesNameArray.map(async (fileName) => {
        const documentInsertSql = {
          text: `INSERT INTO supporting_documents (documents_name, created_at, updated_at) VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id`,
          values: [fileName],
        };
        const result = await researchDbW.query(documentInsertSql);
        return result.rows[0].id;
      })
    : null;

  const documentIds = await Promise.all(insertDocumentPromises);
  // console.log('documentIds ====>>>>', documentIds);

  const insertJournalRecord = await researchDbW.query(articleSql);
  const journalPaperId = insertJournalRecord.rows[0].id;
  console.log("journalPaperId ===>>>>", journalPaperId);

  const insertJournalArticleDocuments = documentIds.map((element) => {
    const articleDocumentSql = {
      text: `INSERT INTO journal_article_documents (journal_article_id, supporting_documents_id) VALUES ($1, $2) RETURNING id`,
      values: [journalPaperId, element],
    };
    // console.log('articleDocumentSql ===>>>>>', articleDocumentSql);
    return researchDbW.query(articleDocumentSql);
  });

  // const insertArticleFactor = impactFactorArray.map((element) => {
  //   const articleFactorSql = {
  //     text: `INSERT INTO journal_article_impact_factor (journal_article_id, impact_factor_id) VALUES ($1, $2) RETURNING id`,
  //     values: [journalPaperId, element],
  //   };
  //   // console.log('articleFactorSql ====>>>>>', articleFactorSql);
  //   return researchDbW.query(articleFactorSql);
  // });

  const insertJournalPolicy = policyCadreArray.map((element) => {
    const journalPolicySql = {
      text: `INSERT INTO journal_article_policy_cadre (journal_article_id, policy_cadre_id) VALUES ($1, $2) RETURNING id`,
      values: [journalPaperId, element],
    };

    // console.log('journalPolicySql ===>>>>>>', journalPolicySql);
    return researchDbW.query(journalPolicySql);
  });

  const insertJournalSchool = schoolIdsArray.map((element) => {
    const journalSchoolSql = {
      text: `INSERT INTO journal_article_school (journal_article_id, school_id) VALUES ($1, $2) RETURNING id`,
      values: [journalPaperId, element],
    };

    // console.log('journalSchoolSql ===>>>>>>', journalSchoolSql);
    return researchDbW.query(journalSchoolSql);
  });

  const insertJournalCampus = campusIdsArray.map((element) => {
    const journalCampusSql = {
      text: `INSERT INTO journal_article_campus (journal_article_id, campus_id) VALUES ($1, $2) RETURNING id`,
      values: [journalPaperId, element],
    };
    // console.log('journalCampusSql ===>>>>>>', journalCampusSql);
    return researchDbW.query(journalCampusSql);
  });

  const insertAllarticlAuthors = allAuthorsArray.map((element) => {
    const allAuthorsSql = {
      text: `INSERT INTO all_article_authors (journal_article_id, faculty_id) VALUES ($1, $2) RETURNING id`,
      values: [journalPaperId, element],
    };
    // console.log('allAuthorsSql ===>>>>>>', allAuthorsSql);
    return researchDbW.query(allAuthorsSql);
  });

  const insertNmimsAuthors = nmimsAuthorsArray.map((element) => {
    const nmimsAuthorsSql = {
      text: `INSERT INTO nmims_faculties (journal_article_id, faculty_id) VALUES ($1, $2) RETURNING id`,
      values: [journalPaperId, element],
    };
    // console.log('nmimsAuthorsSql ===>>>>>>', nmimsAuthorsSql);
    return researchDbW.query(nmimsAuthorsSql);
  });

  const selectSchoolDataPromises = schoolIdsArray.map(async (schoolId) => {
    const schoolSql = {
      text: `SELECT * FROM nmims_school WHERE id = $1 and active = true`,
      values: [schoolId],
    };
    const schoolResult = await researchDbR.query(schoolSql);
    return schoolResult.rows[0];
  });

  const selectCampusDataPromises = campusIdsArray.map(async (campusId) => {
    const campusSql = {
      text: `SELECT * FROM nmims_campus WHERE id = $1 and active = true`,
      values: [campusId],
    };
    const campusResult = await researchDbR.query(campusSql);
    return campusResult.rows[0];
  });

  // const selectImpactFactorData = impactFactorArray.map(
  //   async (impactFactorId) => {
  //     const impactSql = {
  //       text: `SELECT * FROM impact_factor WHERE id = $1 and active = true`,
  //       values: [impactFactorId],
  //     };
  //     const impactData = await researchDbR.query(impactSql);
  //     return impactData.rows[0];
  //   }
  // );

  const selectPolicyCadreData = policyCadreArray.map(async (policyId) => {
    const policySql = {
      text: `SELECT * FROM policy_cadre WHERE id = $1 and active = true`,
      values: [policyId],
    };
    const policyData = await researchDbR.query(policySql);
    return policyData.rows[0];
  });

  const articleFileLength = articleFilesNameArray.length;
  // const impactFactorLength = impactFactorArray.length;
  const policyCadreLength = policyCadreArray.length;
  const schoolIdsLength = schoolIdsArray.length;
  const campusIdsLength = campusIdsArray.length;
  const allAuthorsIdsLength = allAuthorsArray.length;
  const nmimsAuthorsLength = nmimsAuthorsArray.length;

  return Promise.all([
    ...insertJournalArticleDocuments,
    ...insertJournalPolicy,
    ...insertJournalSchool,
    ...insertJournalCampus,
    ...insertNmimsAuthors,
    ...insertAllarticlAuthors,
    ...selectSchoolDataPromises,
    ...selectCampusDataPromises,
    ...selectPolicyCadreData,
  ])
    .then((results) => {
      // console.log("result ===>>>>>", results);

      const extractIds = (startIndex, length) => {
        return results
          .slice(startIndex, startIndex + length)
          .map((result) => result?.rows[0]?.id);
      };

      const articledocumentsIds = extractIds(0, articleFileLength);
      // const articlImpactFactorIds = extractIds(
      //   articleFileLength,
      // );
      const articlePolicyCadreIds = extractIds(
        articleFileLength,
        policyCadreLength  
      );
      const articleSchoolIds = extractIds(
        articleFileLength  + policyCadreLength,
        schoolIdsLength
      );
      const articleCampusIds = extractIds(
        articleFileLength +
          policyCadreLength +
          schoolIdsLength,
        campusIdsLength
      );
      const journalAuthorsIds = extractIds(
        articleFileLength +
          policyCadreLength +
          schoolIdsLength +
          campusIdsLength,
        nmimsAuthorsLength
      );
      const allArticleAuthorIds = extractIds(
        articleFileLength +
          policyCadreLength +
          schoolIdsLength +
          campusIdsLength +
          nmimsAuthorsLength,
        allAuthorsIdsLength
      );

      const schoolList = results
        .slice(
          articleFileLength + policyCadreLength,
          articleFileLength +
            policyCadreLength +
            schoolIdsLength +
            campusIdsLength
        )
        .map((result) => result[0]);
      const campusList = results
        .slice(
          articleFileLength +
            policyCadreLength +
            schoolIdsLength,
          articleFileLength +
            policyCadreLength +
            schoolIdsLength +
            campusIdsLength
        )
        .map((result) => result[0]);
      const schoolNames = [];
      const campusNames = [];
      const impactFactorNames = [];
      const policyCadreNames = [];

      results.forEach((result) => {
        if (result.school_name) {
          schoolNames.push(result.school_name);
        }
        if (result.cadre_name) {
          policyCadreNames.push(result.cadre_name);
        }
        if (result.campus_name) {
          campusNames.push(result.campus_name);
        }
        // if (result.impact_factor) {
        //   impactFactorNames.push(result.impact_factor);
        // }
      });

      // console.log("School Names:", schoolNames);
      // console.log("Campus Names:", campusNames);
      // console.log("Impact Factors:", impactFactorNames);
      // console.log("policy Cadre:", impactFactorNames);

      return {
        status: "Done",
        message: "Record Inserted Successfully",
        journalPaperId: journalPaperId,
        rowCount: insertJournalRecord.rowCount,
        documentIds: documentIds,
        articledocumentsIds: articledocumentsIds,
        // articlImpactFactorIds: articlImpactFactorIds,
        articlePolicyCadreIds: articlePolicyCadreIds,
        articleSchoolIds: articleSchoolIds,
        articleCampusIds: articleCampusIds,
        journalAuthorsIds: journalAuthorsIds,
        allArticleAuthorIds: allArticleAuthorIds,
        schoolList: schoolNames,
        campusList: campusNames,
        // impactFactorList: impactFactorNames,
        policyCadreList: policyCadreNames,
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
  const deleteArlicleFactor = await researchDbW.query(articleFactorSql);
  const deleteArticlePolicy = await researchDbW.query(articlePolicySql);

  const deletePromises = [
    deleteArticleAllAuthors,
    deleteArticleDocuments,
    deleteNmimsArticleAuthors,
    deleteArticleSchools,
    deleteArticleCampus,
    deleteArlicleFactor,
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
        factorRowCount: deleteArlicleFactor.rowCount,
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
  journalPaperId,
  updateJournalDetails,
  updateSchoolIdsArray,
  updateCampusIdsArray,
  updateNmimsAuthorsArray,
  updatePolicyCadreArray,
  updateAllAuthorsArray,
  updatedArticleFilesNameArray,
  journalFiles,
  userName
) => {
  console.log("updateJournalDetails in models:", updateJournalDetails);
  console.log("journalFiles ===>>>>", journalFiles);

  // Extract variables from updateJournalDetails
  const {
    year,
    publisher,
    totalAuthors,
    journalName,
    countOtherFaculty,
    pages,
    issnNo,
    scsCiteScore,
    wosIndexedCategory,
    abdcIndexedCategory,
    ugcIndexedCategory,
    webLinkNumber,
    uid,
    dateOfPublishing,
    titleOfPaper,
    journalCategory,
    nmimsAuthorsCount,
    gsIndex,
    foreignAuhtorNo,
    foreignAuthorsName,
    noNmimsStudentAuthor,
    nmimsStudentForeignAuthors,
    scsIndex,
    impactFactor
  } = updateJournalDetails;

  // const supportingDocument = journalFiles || null;

  let baseQuery =  `UPDATE journal_paper_article 
                SET year = $2, publisher = $3, total_authors = $4,journal_name = $5,others_authers = $6,
                    pages = $7,issn_no = $8,scs_cite_score = $9,wos_indexed = $10,abdc_indexed = $11,
                    ugc_indexed = $12, web_link_doi = $13,uid = $14,date_of_publishing = $15,
                    title_of_paper = $16,jorunal_article_type_id = $17,nmims_authors_count = $18,gs_index = $19,
                    foreign_auhtor_no = $20, foreign_authors_name = $21, no_nmims_student_author = $22, nmims_student_foreign_authors = $23,
                    scs_indexed = $24 , impact_factor = $25, updated_by = $26`;

 let documentsQuery = journalFiles ?  `, article_supporting_documents = $27` : '';
 let queryText = baseQuery + documentsQuery + ` WHERE id = $1`;

let values = [
                      journalPaperId,
                      year,
                      publisher,
                      totalAuthors,
                      journalName,
                      countOtherFaculty,
                      pages,
                      issnNo,
                      scsCiteScore,
                      wosIndexedCategory,
                      abdcIndexedCategory,
                      ugcIndexedCategory,
                      webLinkNumber,
                      uid,
                      dateOfPublishing,
                      titleOfPaper,
                      journalCategory,
                      nmimsAuthorsCount,
                      gsIndex,
                      foreignAuhtorNo,
                      foreignAuthorsName,
                      noNmimsStudentAuthor,
                      nmimsStudentForeignAuthors,
                      scsIndex,
                      impactFactor,
                      userName,
                      ...(journalFiles ? [journalFiles] : [])
                    ]

  let sql = {
    text: queryText,
    values: values,
  };
   
  const updateJournalarticles = await researchDbW.query(sql);
  console.log("AFTER UPDATE>>>>>>>>>>>>");
  const insertDocumentPromises = updatedArticleFilesNameArray
    ? updatedArticleFilesNameArray.map(async (fileName) => {
        const documentInsertSql = {
          text: `INSERT INTO supporting_documents (documents_name, created_at, updated_at) VALUES ($1, NOW(), NOW()) RETURNING id`,
          values: [fileName],
        };
        const result = await researchDbW.query(documentInsertSql);
        return result.rows[0].id;
      })
    : null;

  const documentIds = await Promise.all(insertDocumentPromises);
  console.log("documentIds ==>>>", documentIds);

  const insertJournalArticleDocuments = documentIds.map((element) => {
    const articleDocumentSql = {
      text: `INSERT INTO journal_article_documents (journal_article_id, supporting_documents_id) VALUES ($1, $2) RETURNING id`,
      values: [journalPaperId, element],
    };
    console.log("articleDocumentSql ===>>>>>", articleDocumentSql);
    return researchDbW.query(articleDocumentSql);
  });

  // const insertArticleFactor = updateImpactFactorArray
  //   ? updateImpactFactorArray.map(async (factorId) => {
  //       const existingRecord = await researchDbW.query({
  //         text: `SELECT id FROM journal_article_impact_factor WHERE journal_article_id = $1 AND impact_factor_id = $2 and active = true`,
  //         values: [journalPaperId, factorId],
  //       });

  //       return existingRecord.rows.length === 0
  //         ? researchDbW.query({
  //             text: `INSERT INTO journal_article_impact_factor (journal_article_id, impact_factor_id) VALUES ($1, $2) RETURNING id`,
  //             values: [journalPaperId, factorId],
  //           })
  //         : Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] });
  //     })
  //   : [];

  // console.log("insertArticleFactor ====>>>>>>", insertArticleFactor);

  const insertJournalPolicy = updatePolicyCadreArray
    ? updatePolicyCadreArray.map(async (policyId) => {
        const existingRecord = await researchDbW.query({
          text: `SELECT id FROM journal_article_policy_cadre WHERE journal_article_id = $1 AND policy_cadre_id = $2 and active = true`,
          values: [journalPaperId, policyId],
        });

        return existingRecord.rows.length === 0
          ? researchDbW.query({
              text: `INSERT INTO journal_article_policy_cadre (journal_article_id, policy_cadre_id) VALUES ($1, $2) RETURNING id`,
              values: [journalPaperId, policyId],
            })
          : Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] });
      })
    : [];

  const insertJournalSchool = updateSchoolIdsArray
    ? updateSchoolIdsArray.map(async (schoolId) => {
        const existingRecord = await researchDbW.query({
          text: `SELECT id FROM journal_article_school WHERE journal_article_id = $1 AND school_id = $2 and active = true`,
          values: [journalPaperId, schoolId],
        });

        return existingRecord.rows.length === 0
          ? researchDbW.query({
              text: `INSERT INTO journal_article_school (journal_article_id, school_id) VALUES ($1, $2) RETURNING id`,
              values: [journalPaperId, schoolId],
            })
          : Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] });
      })
    : [];

  const insertJournalCampus = updateCampusIdsArray
    ? updateCampusIdsArray.map(async (campusId) => {
        const existingRecord = await researchDbW.query({
          text: `SELECT id FROM journal_article_campus WHERE journal_article_id = $1 AND campus_id = $2 and active = true`,
          values: [journalPaperId, campusId],
        });

        return existingRecord.rows.length === 0
          ? researchDbW.query({
              text: `INSERT INTO journal_article_campus (journal_article_id, campus_id) VALUES ($1, $2) RETURNING id`,
              values: [journalPaperId, campusId],
            })
          : Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] });
      })
    : [];

  const insertAllarticlAuthors = updateAllAuthorsArray
    ? updateAllAuthorsArray.map(async (facultyId) => {
        const existingRecord = await researchDbW.query({
          text: `SELECT id FROM all_article_authors WHERE journal_article_id = $1 AND faculty_id = $2 and active = true`,
          values: [journalPaperId, facultyId],
        });

        return existingRecord.rows.length === 0
          ? researchDbW.query({
              text: `INSERT INTO all_article_authors (journal_article_id, faculty_id) VALUES ($1, $2) RETURNING id`,
              values: [journalPaperId, facultyId],
            })
          : Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] });
      })
    : [];

  const insertNmimsAuthors = updateNmimsAuthorsArray
    ? updateNmimsAuthorsArray.map(async (facultyId) => {
        const existingRecord = await researchDbW.query({
          text: `SELECT id FROM nmims_faculties WHERE journal_article_id = $1 AND faculty_id = $2 and active = true`,
          values: [journalPaperId, facultyId],
        });

        return existingRecord.rows.length === 0
          ? researchDbW.query({
              text: `INSERT INTO nmims_faculties (journal_article_id, faculty_id) VALUES ($1, $2) RETURNING id`,
              values: [journalPaperId, facultyId],
            })
          : Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] });
      })
    : [];

  const selectSchoolDataPromises = updateSchoolIdsArray
    ? updateSchoolIdsArray.map(async (schoolId) => {
        const schoolSql = {
          text: `SELECT * FROM nmims_school WHERE id = $1 and active = true`,
          values: [schoolId],
        };
        const schoolResult = await researchDbR.query(schoolSql);
        return schoolResult.rows[0];
      })
    : [];

  const selectCampusDataPromises = updateCampusIdsArray
    ? updateCampusIdsArray.map(async (campusId) => {
        const campusSql = {
          text: `SELECT * FROM nmims_campus WHERE id = $1 and active = true`,
          values: [campusId],
        };
        const campusResult = await researchDbR.query(campusSql);
        return campusResult.rows[0];
      })
    : [];

  // const selectImpactFactorData = updateImpactFactorArray
  //   ? updateImpactFactorArray.map(async (impactFactorId) => {
  //       const impactSql = {
  //         text: `SELECT * FROM impact_factor WHERE id = $1 and active = true`,
  //         values: [impactFactorId],
  //       };
  //       const impactData = await researchDbR.query(impactSql);
  //       return impactData.rows[0];
  //     })
  //   : [];

  const selectPolicyCadreData = updatePolicyCadreArray
    ? updatePolicyCadreArray.map(async (policyId) => {
        const policySql = {
          text: `SELECT * FROM policy_cadre WHERE id = $1 and active = true`,
          values: [policyId],
        };
        const policyData = await researchDbR.query(policySql);
        return policyData.rows[0];
      })
    : [];

  const articleFileLength = updatedArticleFilesNameArray.length;
  // const impactFactorLength = updateImpactFactorArray.length;
  const policyCadreLength = updatePolicyCadreArray.length;
  const schoolIdsLength = updateSchoolIdsArray.length;
  const campusIdsLength = updateCampusIdsArray.length;
  const allAuthorsIdsLength = updateAllAuthorsArray.length;
  const nmimsAuthorsLength = updateNmimsAuthorsArray.length;

  return Promise.all([
    ...insertJournalArticleDocuments,
    ...insertJournalPolicy,
    ...insertJournalSchool,
    ...insertJournalCampus,
    ...insertNmimsAuthors,
    ...insertAllarticlAuthors,
    ...selectSchoolDataPromises,
    ...selectCampusDataPromises,
    ...selectPolicyCadreData,
  ])
    .then((results) => {
      console.log("result ===>>>>>", results);

      const extractIds = (startIndex, length) => {
        return results
          .slice(startIndex, startIndex + length)
          .map((result) => result?.rows[0]?.id);
      };

      const articledocumentsIds = extractIds(0, articleFileLength);
      const articlImpactFactorIds = extractIds(
        articleFileLength
      );
      const articlePolicyCadreIds = extractIds(
        articleFileLength,
        policyCadreLength
      );
      const articleSchoolIds = extractIds(
        articleFileLength  + policyCadreLength,
        schoolIdsLength
      );
      const articleCampusIds = extractIds(
        articleFileLength  +
          policyCadreLength +
          schoolIdsLength,
        campusIdsLength
      );
      const journalAuthorsIds = extractIds(
        articleFileLength +
          policyCadreLength +
          schoolIdsLength +
          campusIdsLength,
        nmimsAuthorsLength
      );
      const allArticleAuthorIds = extractIds(
        articleFileLength +
          policyCadreLength +
          schoolIdsLength +
          campusIdsLength +
          nmimsAuthorsLength,
        allAuthorsIdsLength
      );

      const schoolList = results
        .slice(
          articleFileLength + policyCadreLength,
          articleFileLength +
            policyCadreLength +
            schoolIdsLength +
            campusIdsLength
        )
        .map((result) => result[0]);
      const campusList = results
        .slice(
          articleFileLength +
            policyCadreLength +
            schoolIdsLength,
          articleFileLength +
            policyCadreLength +
            schoolIdsLength +
            campusIdsLength
        )
        .map((result) => result[0]);
      const schoolNames = [];
      const campusNames = [];
      const impactFactorNames = [];
      const policyCadreNames = [];

      results.forEach((result) => {
        if (result.school_name) {
          schoolNames.push(result.school_name);
        }
        if (result.cadre_name) {
          policyCadreNames.push(result.cadre_name);
        }
        if (result.campus_name) {
          campusNames.push(result.campus_name);
        }
        // if (result.impact_factor) {
        //   impactFactorNames.push(result.impact_factor);
        // }
      });

      console.log("School Names:", schoolNames);
      console.log("Campus Names:", campusNames);
      // console.log("Impact Factors:", impactFactorNames);
      console.log("policy Cadre:", impactFactorNames);

      return {
        status: "Done",
        message: "Record Updated Successfully",
        rowCount: updateJournalarticles.rowCount,
        documentIds: documentIds,
        articledocumentsIds: articledocumentsIds,
        articlImpactFactorIds: articlImpactFactorIds,
        articlePolicyCadreIds: articlePolicyCadreIds,
        articleSchoolIds: articleSchoolIds,
        articleCampusIds: articleCampusIds,
        journalAuthorsIds: journalAuthorsIds,
        allArticleAuthorIds: allArticleAuthorIds,
        schoolList: schoolNames,
        campusList: campusNames,
        // impactFactorList: impactFactorNames,
        policyCadreList: policyCadreNames,
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
                    jpa.journal_name,
                    jpa.publisher,
                    jpa.pages,
                    jpa.issn_no,
                    jpa.uid,
                    jpa.year,
                    jpa.jorunal_article_type_id,
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
                    string_agg(DISTINCT sd.documents_name, ', ') AS supporting_documents,
                    string_agg(DISTINCT sd.id::text, ', ') AS supporting_documents_ids,
                    string_agg(DISTINCT pc.cadre_name, ', ') AS policy_cadre,
                    string_agg(DISTINCT pc.id::text, ', ') AS policy_cadre_ids,
                    string_agg(DISTINCT f.faculty_name, ', ') AS internal_faculty_names,
                    string_agg(DISTINCT f.id::text, ', ') AS nmims_facilty_id,
                    string_agg(DISTINCT a.faculty_name, ', ') AS all_article_authors_names,
                    string_agg(DISTINCT a.id::text, ', ') AS articles_faculties_ids,
                    string_agg(DISTINCT ns.school_name, ', ') AS associated_schools,
                    string_agg(DISTINCT ns.id::text, ', ') AS school_id,
                    string_agg(DISTINCT nc.campus_name, ', ') AS associated_campuses,
                    string_agg(DISTINCT nc.id::text, ', ') AS campus_id
                FROM
                    journal_paper_article jpa
                LEFT JOIN
                    journal_article_school jas ON jpa.id = jas.journal_article_id
                LEFT JOIN
                    nmims_school ns ON jas.school_id = ns.id
                LEFT JOIN
                    journal_article_campus jac ON jpa.id = jac.journal_article_id
                LEFT JOIN
                    nmims_campus nc ON jac.campus_id = nc.id
                LEFT JOIN
                    nmims_faculties nf ON jpa.id = nf.journal_article_id
                LEFT JOIN
                    faculties f ON nf.faculty_id = f.id
                LEFT JOIN
                    all_article_authors aa ON jpa.id = aa.journal_article_id
                LEFT JOIN
                    faculties a ON aa.faculty_id = a.id
                LEFT JOIN
                    journal_article_documents jad ON jpa.id = jad.journal_article_id
                LEFT JOIN
                    supporting_documents sd ON jad.supporting_documents_id = sd.id
                LEFT JOIN
                    journal_article_policy_cadre japc ON jpa.id = japc.journal_article_id
                LEFT JOIN
                    policy_cadre pc ON japc.policy_cadre_id = pc.id
                WHERE 
                         jpa.id = $1 AND jpa.created_by = $2 
                         and pc.active = true and japc.active = true and sd.active = true and jad.active = true and a.active = true 
                         and f.active = true and nf.active = true and nc.active = true 
                         and jac.active = true and ns.active = true and jas.active = true and jpa.active = true
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
                    jpa.impact_factor,
                    jpa.jorunal_article_type_id,
                    jpa.date_of_publishing,
                    jpa.scs_cite_score,
                    jpa.scs_indexed,
                    jpa.abdc_indexed,
                    jpa.wos_indexed,
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
                    f.address,
                    f.employee_id
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
                    f.address,
                    f.employee_id,
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
