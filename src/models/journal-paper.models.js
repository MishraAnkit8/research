const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

// for fetching journal paper data 
module.exports.fetchJournalPaper = () => {
    let sql = {
        text : `SELECT * FROM journal_papers ORDER BY id`
    }

    console.log('sql ==>>', sql)
    return researchDbR.query(sql);
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

    // Converting empty strings to null for integer fields
    // handling of webLinkNumberConverting empty strings to null for integer fields
    const webLinkNumberParsed = webLinkNumber === "" ? null : parseInt(webLinkNumber, 10);
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
            scsIndexedCategory, wosIndexedCategory, abdcIndexedCategory, ugcIndexedCategory, webLinkNumberParsed, nmimsStudentAuthors,
            countStudentAuthors
        ]
    };

    console.log('sql ==>>', sql);
    //handling the condng by tre and catch
    try {
        const result = await researchDbW.query(sql);
        console.log('Inserted row with id:', result.rows[0].id);
        return { status: 'Done', id: result.rows[0].id};
    } catch (error) {
        console.log('error.code ====>>>', error.code)
        console.log('error.constraint ====>>>>>', error.constraint);
        console.log('error.message ====>>>', error.message);
        if (error.code === '23505' && error.constraint === 'journal_papers_web_link_doi_number_key') {
            console.error('Insertion failed. web_link_doi_number already exists.');
            return { status: 'Failed', error: 'web_link_doi_number already exists' };
        } else {
            console.error('Error occurred::::::::::', error.message);
            return { status: 'Failed', error: error.message };
        }
    }
};

// for deleting journal paper  data 
module.exports.deleteJournalPaper =  async({journalPaperId}) => {
    let sql = {
        text : `DELETE FROM journal_papers WHERE id = $1 `,
        values : [journalPaperId]
    };
    console.log('sql ==>>'. sql)
    return researchDbR.query(sql);

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

    // handling of webLinkNumberConverting empty strings to null for integer fields
    const webLinkNumberParsed = webLinkNumber === "" ? null : parseInt(webLinkNumber, 10);

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
            scsIndexedCategory, wosIndexedCategory, abdcIndexedCategory, ugcIndexedCategory, webLinkNumberParsed, nmimsStudentAuthors,
            countStudentAuthors
        ]
    };

    try {
        const result = await researchDbW.query(sql);
        if (result.rowCount > 0) {
            console.log('sql ====>>>', sql)
            console.log('Updated successful:', result.rowCount, 'Row(s) Updated.');
            return { status: 'Done' };
        } else {
            console.log('No record found or updated with id:', journalPaperId);
            return { status: 'Failed', error: 'No record found or updated' };
        }
    } catch (error) {
        console.error('Error on update:', error.code, error.message);
        return { status: 'Failed', error: error.message };
    }
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
