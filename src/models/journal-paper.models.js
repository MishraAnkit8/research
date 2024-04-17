const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

// for fetching journal paper data 
module.exports.fetchJournalPaper = async () => {
    let sql = {
        text : `SELECT
        jpa.id AS article_id,
        jpa.title_of_paper,
        jpa.all_authors,
        jpa.total_authors,
        jpa.nmims_authors_count,
        jpa.journal_name,
        jpa.publisher,
        jpa.pages,
        jpa.issn_no,
        jpa.year,
        jpa.article_type,
        jpa.date_of_publishing,
        jpa.scs_cite_score,
        jpa.scs_indexed,
        jpa.abdc_indexed,
        jpa.wos_indexed,
        jpa.ugc_indexed,
        jpa.web_link_doi_number,
        ns.school_name,
        nc.campus_name,
        jaf.impact_factor,
        string_agg(DISTINCT sd.documents_name, ', ') AS supporting_documents,
        pc.cadre_name,
        f.faculty_name,
        f.designation,
        f.address,
        f.employee_id,
        nf.id AS nmims_faculties_id,
        string_agg(DISTINCT ns.school_name, ', ') AS associated_schools,
        string_agg(DISTINCT ns.id::text, ', ') AS school_id,
        string_agg(DISTINCT nc.campus_name, ', ') AS associated_campuses
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
        journal_article_impact_factor jaif ON jpa.id = jaif.journal_article_id
    LEFT JOIN
        impact_factor jaf ON jaif.impact_factor_id = jaf.id
    LEFT JOIN
        nmims_faculties nf ON jpa.id = nf.journal_article_id
    LEFT JOIN
        faculties f ON nf.faculty_id = f.id
    LEFT JOIN
        journal_article_documents jad ON jpa.id = jad.journal_article_id
    LEFT JOIN
        supporting_documents sd ON jad.supporting_documents_id = sd.id
    LEFT JOIN
        journal_article_policy_cadre japc ON jpa.id = japc.journal_article_id
    LEFT JOIN
        policy_cadre pc ON japc.policy_cadre_id = pc.id
    GROUP BY
        jpa.id,
        jpa.title_of_paper,
        ns.school_name,
        nc.campus_name,
        jaf.impact_factor,
        pc.cadre_name,
        f.faculty_name,
        f.designation,
        f.address,
        f.employee_id,
        nf.id`
    }

    let internalEmpSql = {
        text: `select *  FROM faculties WHERE faculty_type_id = 1`
    };

     
    let journalPaperSql = {
        text: `select *  FROM journal_paper_article ORDER BY id`
    };

    let supportingoDcumentsSql = {
        text: `select *  FROM supporting_documents ORDER BY id`
    };

    let allAuthorsSql = {
        text: `select *  FROM faculties ORDER BY id`
    }

    let nmimsSchoolSql = {
        text: `select *  FROM nmims_school ORDER BY id`
    };

    let nmimsCampusSql = {
        text: `select *  FROM nmims_campus ORDER BY id`
    };

    let policyCadreSql = {
        text: `select *  FROM policy_cadre ORDER BY id`
    };

    let impactFactorSql = {
        text: `select *  FROM impact_factor ORDER BY id`
    };

    console.log('sql ==>>', sql)
    const journalArticleData = await researchDbR.query(sql);
    const nmimsSchool = await researchDbR.query(nmimsSchoolSql);
    const nmimsFaculty = await researchDbR.query(internalEmpSql);
    const nmimsCampus = await researchDbR.query(nmimsCampusSql);
    const policyCadre = await researchDbR.query(policyCadreSql);
    const impactFactor = await researchDbR.query(impactFactorSql);
    const journalPaper = await researchDbR.query(journalPaperSql);
    const allAuthorList = await researchDbR.query(allAuthorsSql)

    const promises = [journalArticleData, nmimsSchool, nmimsFaculty, nmimsCampus, policyCadre, impactFactor, journalPaper, allAuthorList]

    return Promise.all(promises).then(([journalArticleData, nmimsSchool, nmimsFaculty, nmimsCampus, policyCadre, impactFactor, journalPaper, allAuthorList]) => {
            return {
                status : 'Done',
                message : "Data Fetched Successfully",
                journalArticleData : journalArticleData.rows,
                rowCount : journalPaper.rowCount,
                nmimsSchool : nmimsSchool.rows,
                internalEmpList : nmimsFaculty.rows,
                nmimsCampus : nmimsCampus.rows,
                policyCadre : policyCadre.rows,
                impactFactor : impactFactor.rows,
                allAuthorList : allAuthorList.rows
            }
    })
    .catch((error) => {
        return{status : "Failed" , message : error.message , errorCode : error.code}
    }) 
   
};

// for inserting journal paper  data
module.exports.insertJournalArticle = async (journalDetails, articleFilesNameArray, schoolIdsArray, campusIdsArray,
        impactFactorArray, policyCadreArray, allAuthorsArray, nmimsAuthorsArray) => {
    console.log('journalDetails in models ==>>', journalDetails);
    const { year, publisher, totalAuthors, journalName, countOtherFaculty, pages, issnNo, scsCiteScore, wosIndexedCategory,
            abdcIndexedCategory, ugcIndexedCategory, webLinkNumber, uid, dateOfPublishing, titleOfPaper, journalCategory, nmimsAuthorsCount
       } = journalDetails;


    let articleSql = {
        text: `INSERT INTO journal_paper_article (year, publisher, total_authors, journal_name, count_other_faculty, pages, issn_no, scs_cite_score, wos_indexed,
                abdc_indexed, ugc_indexed, web_link_doi_number, uid, date_of_publishing, title_of_paper, article_type, nmims_authors_count)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id`,

        values: [year, publisher, totalAuthors, journalName, countOtherFaculty, pages, issnNo, scsCiteScore, wosIndexedCategory,
                abdcIndexedCategory, ugcIndexedCategory, webLinkNumber, uid, dateOfPublishing, titleOfPaper, journalCategory, nmimsAuthorsCount]
    };

    // console.log('articleSql ==>>', articleSql);

    const insertDocumentPromises = articleFilesNameArray ? articleFilesNameArray.map(async (fileName) => {
        const documentInsertSql = {
            text: `INSERT INTO supporting_documents (documents_name, created_at, updated_at) VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id`,
            values: [fileName]
        };
        const result = await researchDbW.query(documentInsertSql);
        return result.rows[0].id; 
    }) : null;

    const documentIds = await Promise.all(insertDocumentPromises);
    // console.log('documentIds ====>>>>', documentIds);

    const insertJournalRecord = await researchDbW.query(articleSql);
    const journalPaperId = insertJournalRecord.rows[0].id;
    console.log('journalPaperId ===>>>>', journalPaperId);

    const insertJournalArticleDocuments = documentIds.map((element) => {
        const articleDocumentSql = {
            text: `INSERT INTO journal_article_documents (journal_article_id, supporting_documents_id) VALUES ($1, $2) RETURNING id`,
            values: [journalPaperId, element]
        };
        // console.log('articleDocumentSql ===>>>>>', articleDocumentSql);
        return researchDbW.query(articleDocumentSql);
    });

    const insertArticleFactor = impactFactorArray.map((element) => {
        const articleFactorSql = {
            text: `INSERT INTO journal_article_impact_factor (journal_article_id, impact_factor_id) VALUES ($1, $2) RETURNING id`,
            values: [journalPaperId, element]
        }
        // console.log('articleFactorSql ====>>>>>', articleFactorSql);
        return researchDbW.query(articleFactorSql)
    });

    const insertJournalPolicy = policyCadreArray.map((element) => {
        const journalPolicySql = {
            text: `INSERT INTO journal_article_policy_cadre (journal_article_id, policy_cadre_id) VALUES ($1, $2) RETURNING id`,
            values: [journalPaperId, element]
        }

        // console.log('journalPolicySql ===>>>>>>', journalPolicySql);
        return researchDbW.query(journalPolicySql)
    });

    const insertJournalSchool = schoolIdsArray.map((element) => {
        const journalSchoolSql = {
            text: `INSERT INTO journal_article_school (journal_article_id, school_id) VALUES ($1, $2) RETURNING id`,
            values: [journalPaperId, element]
        }

        // console.log('journalSchoolSql ===>>>>>>', journalSchoolSql);
        return researchDbW.query(journalSchoolSql)
    });

    const insertJournalCampus = campusIdsArray.map((element) => {
        const journalCampusSql = {
            text: `INSERT INTO journal_article_campus (journal_article_id, campus_id) VALUES ($1, $2) RETURNING id`,
            values: [journalPaperId, element]
        }
        // console.log('journalCampusSql ===>>>>>>', journalCampusSql);
        return researchDbW.query(journalCampusSql)
    });

    const insertAllarticlAuthors = allAuthorsArray.map((element) => {
        const allAuthorsSql = {
            text: `INSERT INTO all_article_authors (journal_article_id, faculty_id) VALUES ($1, $2) RETURNING id`,
            values: [journalPaperId, element]
        }
        // console.log('allAuthorsSql ===>>>>>>', allAuthorsSql);
        return researchDbW.query(allAuthorsSql)
    });

    const insertNmimsAuthors = nmimsAuthorsArray.map((element) => {
        const nmimsAuthorsSql = {
            text: `INSERT INTO nmims_faculties (journal_article_id, faculty_id) VALUES ($1, $2) RETURNING id`,
            values: [journalPaperId, element]
        }
        // console.log('nmimsAuthorsSql ===>>>>>>', nmimsAuthorsSql);
        return researchDbW.query(nmimsAuthorsSql)
    });

    const selectSchoolDataPromises = schoolIdsArray.map(async (schoolId) => {
        const schoolSql = {
            text: `SELECT * FROM nmims_school WHERE id = $1`,
            values: [schoolId]
        };
        const schoolResult = await researchDbR.query(schoolSql);
        return schoolResult.rows[0]; 
    });
    
    const selectCampusDataPromises = campusIdsArray.map(async (campusId) => {
        const campusSql = {
            text: `SELECT * FROM nmims_campus WHERE id = $1`,
            values: [campusId]
        };
        const campusResult = await researchDbR.query(campusSql);
        return campusResult.rows[0];
    });

    const selectImpactFactorData = impactFactorArray.map(async (impactFactorId) => {
        const impactSql = {
            text: `SELECT * FROM impact_factor WHERE id = $1`,
            values: [impactFactorId]
        };
        const impactData = await researchDbR.query(impactSql);
        return impactData.rows[0];
    });
    
    const selectPolicyCadreData = policyCadreArray.map(async (policyId) => {
        const policySql = {
            text: `SELECT * FROM policy_cadre WHERE id = $1`,
            values: [policyId]
        };
        const policyData = await researchDbR.query(policySql);
        return policyData.rows[0]; 
    });
    
    const articleFileLength = articleFilesNameArray.length;
    const impactFactorLength = impactFactorArray.length;
    const policyCadreLength = policyCadreArray.length;
    const schoolIdsLength = schoolIdsArray.length;
    const campusIdsLength = campusIdsArray.length;
    const allAuthorsIdsLength = allAuthorsArray.length;
    const nmimsAuthorsLength = nmimsAuthorsArray.length;
    
    return Promise.all([
        ...insertJournalArticleDocuments,
        ...insertArticleFactor,
        ...insertJournalPolicy,
        ...insertJournalSchool,
        ...insertJournalCampus,
        ...insertNmimsAuthors,
        ...insertAllarticlAuthors,
        ...selectSchoolDataPromises,
        ...selectCampusDataPromises,
        ...selectImpactFactorData,
        ...selectPolicyCadreData
    ])
    .then((results) => {
        // console.log("result ===>>>>>", results);
    
        const extractIds = (startIndex, length) => {
            return results
                .slice(startIndex, startIndex + length)
                .map((result) => result?.rows[0]?.id);
        };
    
        const articledocumentsIds = extractIds(0, articleFileLength);
        const articlImpactFactorIds = extractIds(articleFileLength, impactFactorLength);
        const articlePolicyCadreIds = extractIds(articleFileLength + impactFactorLength, policyCadreLength);
        const articleSchoolIds = extractIds(articleFileLength + impactFactorLength + policyCadreLength, schoolIdsLength);
        const articleCampusIds = extractIds(articleFileLength + impactFactorLength + policyCadreLength + schoolIdsLength, campusIdsLength);
        const journalAuthorsIds = extractIds(articleFileLength + impactFactorLength + policyCadreLength + schoolIdsLength + campusIdsLength, nmimsAuthorsLength);
        const allArticleAuthorIds = extractIds(articleFileLength + impactFactorLength + policyCadreLength + schoolIdsLength + campusIdsLength + nmimsAuthorsLength, allAuthorsIdsLength);
    
        const schoolList = results.slice(articleFileLength + impactFactorLength + policyCadreLength, articleFileLength + impactFactorLength + policyCadreLength + schoolIdsLength + campusIdsLength).map(result => result[0]);
        const campusList = results.slice(articleFileLength + impactFactorLength + policyCadreLength + schoolIdsLength, articleFileLength + impactFactorLength + policyCadreLength + schoolIdsLength + campusIdsLength).map(result => result[0]);
        const schoolNames = [];
        const campusNames = [];
        const impactFactorNames = [];
        const policyCadreNames = []

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
            if (result.impact_factor) {
                impactFactorNames.push(result.impact_factor);
            }
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
            articlImpactFactorIds: articlImpactFactorIds,
            articlePolicyCadreIds: articlePolicyCadreIds,
            articleSchoolIds: articleSchoolIds,
            articleCampusIds: articleCampusIds,
            journalAuthorsIds: journalAuthorsIds,
            allArticleAuthorIds: allArticleAuthorIds,
            schoolList: schoolNames,
            campusList: campusNames,
            impactFactorList : impactFactorNames,
            policyCadreList : policyCadreNames
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
module.exports.deleteJournalPaper =  async({journalPaperId}) => {
    let sql = {
        text : `DELETE FROM journal_papers WHERE id = $1 `,
        values : [journalPaperId]
    };
    console.log('sql ===>>>', sql)
    const deletedRecord = await researchDbW.query(sql);
    const promises = [deletedRecord];
    return Promise.all(promises).then(([deletedRecord]) => {
        return  { status : "Done" , message : "Record Deleted Successfully", rowCount : deletedRecord.rowCount}
    })
    .catch((error) => {
        return{status : "Failed" , message : error.message , errorCode : error.code}
    })

}
// for updating 
module.exports.updateJournalPaperData = async ({ journalPaperId, updateJournalDetails }) => {
    console.log('updateJournalDetails in models:', updateJournalDetails);
    
    // Extract variables from updateJournalDetails
    const {
        year, school, campus, policyCadre, journalCategory, allAuthors, totalAuthors, nmimsAuthors,
        journalName, foreignAuthors, foreignAuthorsNumbers, nmimsAuthorsCount, countOtherFaculty, 
        titleOfPaper, publisher, pages, issnNo, dateOfPublishing, impactFactor, scsCiteScore, 
        scsIndexedCategory, wosIndexedCategory, abdcIndexedCategory, ugcIndexedCategory, webLinkNumber, nmimsStudentAuthors,
        countStudentAuthors
    } = updateJournalDetails;

    let sql = {
        text: `UPDATE journal_papers SET
            year = $2, school = $3, campus = $4, policy_cadre = $5, journal_category = $6, all_authors = $7,
            total_authors = $8, nmims_authors = $9, foreign_authors = $10, numbers_foreign_authors = $11,
            nmims_authors_count = $12, count_other_faculty = $13, title_of_paper = $14, journal_name = $15,
            publisher = $16, pages = $17, issn_no = $18, date_of_publishing = $19, impact_factor = $20,
            scs_cite_score = $21, scs_indexed = $22, wos_indexed = $23, abdc_indexed = $24, ugc_indexed = $25,
            web_link_doi_number = $26, names_nmims_student_author = $27, no_nmims_student_author = $28
            WHERE id = $1`,
        values: [
            journalPaperId, year, school, campus, policyCadre, journalCategory, allAuthors, totalAuthors, nmimsAuthors,
            foreignAuthors, foreignAuthorsNumbers, nmimsAuthorsCount, countOtherFaculty, 
            titleOfPaper, journalName, publisher, pages, issnNo, dateOfPublishing, impactFactor, scsCiteScore, 
            scsIndexedCategory, wosIndexedCategory, abdcIndexedCategory, ugcIndexedCategory, webLinkNumber, nmimsStudentAuthors,
            countStudentAuthors
        ]
    };

    console.log('sql ====>>>', sql);
    // return researchDbW.query(sql)
    const updateJournalRecord = await researchDbW.query(sql);
    const promises = [updateJournalRecord];
    return Promise.all(promises).then(([updateJournalRecord]) => {
        return  { status : "Done" , message : "Record Updated Successfully" ,  rowCount : updateJournalRecord.rowCount}
    })
    .catch((error) => {
        return{status : "Failed" , message : error.message , errorCode : error.code}
    })

};

// for viewing 

module.exports.viewJournalPaperData = async ({journalPaperId}) => {
    const sql = {
        text : `SELECT  year, school, campus, policy_cadre, journal_category, all_authors,
        total_authors, nmims_authors, foreign_authors, numbers_foreign_authors, nmims_authors_count,
        count_other_faculty, title_of_paper, journal_name, publisher, pages, issn_no,
        TO_CHAR(date_of_publishing, 'DD-MM-YYYY'), impact_factor, scs_cite_score, scs_indexed, wos_indexed,
        abdc_indexed, ugc_indexed, web_link_doi_number, names_nmims_student_author, no_nmims_student_author FROM journal_papers WHERE id = $1 `,
        values : [journalPaperId]
    }
    console.log('sql ==>>', sql)
    return researchDbR.query(sql);
   
}
