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
        jpa.date_of_publishing,
        jpa.scs_cite_score,
        jpa.scs_indexed,
        jpa.abdc_indexed,
        jpa.wos_indexed,
        jpa.ugc_indexed,
        jpa.web_link_doi_number,
        jat.article_type,
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
    JOIN
        jorunal_article_type jat ON jpa.jorunal_article_type_id = jat.id
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
        jat.article_type,
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


    console.log('sql ==>>', sql)
    const journalArticleData = await researchDbR.query(sql);

    const promises = [journalArticleData]

    return Promise.all(promises).then(([journalArticleData]) => {
            return {
                status : 'Done',
                message : "Data Fetched Successfully",
                journalArticleData : journalArticleData.rows,
                rowCount : journalArticleData.rowCount
            }
    })
    .catch((error) => {
        return{status : "Failed" , message : error.message , errorCode : error.code}
    }) 
   
};

// for inserting journal paper  data
module.exports.createJournalPaper = async ({ journalDetails }) => {
    console.log('journalDetails in models ==>>', journalDetails);
    const {
        year, school, campus, policyCadre, journalCategory, allAuthors, totalAuthors, nmimsAuthors,
        journalName, foreignAuthors, foreignAuthorsNumbers, nmimsAuthorsCount, countOtherFaculty,
        titleOfPaper, publisher, pages, issnNo, dateOfPublishing, impactFactor, scsCiteScore,
        scsIndexedCategory, wosIndexedCategory, abdcIndexedCategory, ugcIndexedCategory, webLinkNumber, nmimsStudentAuthors,
        countStudentAuthors
    } = journalDetails;

    let sql = {
        text: `INSERT INTO journal_papers (
            year, school, campus, policy_cadre, journal_category, all_authors,
            total_authors, nmims_authors, foreign_authors, numbers_foreign_authors, nmims_authors_count,
            count_other_faculty, title_of_paper, journal_name, publisher, pages, issn_no,
            date_of_publishing, impact_factor, scs_cite_score, scs_indexed, wos_indexed,
            abdc_indexed, ugc_indexed, web_link_doi_number, names_nmims_student_author, no_nmims_student_author
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27) RETURNING id`,
        values: [
            year, school, campus, policyCadre, journalCategory, allAuthors, totalAuthors, nmimsAuthors,
            foreignAuthors, foreignAuthorsNumbers, nmimsAuthorsCount, countOtherFaculty,
            titleOfPaper, journalName, publisher, pages, issnNo, dateOfPublishing, impactFactor, scsCiteScore,
            scsIndexedCategory, wosIndexedCategory, abdcIndexedCategory, ugcIndexedCategory, webLinkNumber, nmimsStudentAuthors,
            countStudentAuthors
        ]
    };

    console.log('sql ==>>', sql);
    // return researchDbW.query(sql);
    const insertJournalRecord = await researchDbW.query(sql);
    const promises = [insertJournalRecord];
    return Promise.all(promises).then(([insertJournalRecord]) => {
        return  { status : "Done" , message : "Record Inserted Successfully" , journalPaperId : insertJournalRecord.rows.id, rowCount : insertJournalRecord.rowCount}
    })
    .catch((error) => {
        return{status : "Failed" , message : error.message , errorCode : error.code}
    })
    
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
