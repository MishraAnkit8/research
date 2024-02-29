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
module.exports.createJournalPaper = ({journalDetails}) => {
    console.log('journalDetails in models ==>>', journalDetails)
    const {year, school, campus, policyCadre, journalCategory, allAuthors, totalAuthors, nmimsAuthors, nmimsAuthorsCount, countOtherFaculty, titleOfPaper, journalName, publisher, pages, issnNo, dateOfPublishing, impactFactor, scsCiteScore, scsIndexed, wosIndexed, gsIndexed, abcdIndexed, ugcIndexed, webLink, uid } = journalDetails ;

    let sql = {
        text : `INSERT INTO journal_papers (year, school, campus, policy_cadre, journal_category, all_authors,
              total_authors, nmims_authors, nmims_authors_count, count_other_faculty, title_of_paper, journal_name, publisher, 
              pages, issn_no, date_of_publishing, impact_factor, scs_cite_score, scs_indexed, wos_indexed, gs_indexed, abdc_indexed, ugc_indexed, web_link, uid)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25) RETURNING id ` ,

        values : [year, school, campus, policyCadre, journalCategory, allAuthors, totalAuthors, nmimsAuthors, nmimsAuthorsCount, countOtherFaculty, titleOfPaper, journalName, publisher, pages, issnNo, dateOfPublishing, impactFactor, scsCiteScore, scsIndexed, wosIndexed, gsIndexed, abcdIndexed, ugcIndexed, webLink, uid ]
    };
    console.log('sql ==>>', sql)
    return researchDbW.query(sql);
}
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
module.exports.updateJournalPaperData = async ({journalPaperId, updateJournalDetails}) => {
    const {year, school, campus, policyCadre, journalCategory, allAuthors, totalAuthors, nmimsAuthors, nmimsAuthorsCount, countOtherFaculty, titleOfPaper, journalName, publisher, pages, issnNo, dateOfPublishing, impactFactor, scsCiteScore, scsIndexed, wosIndexed, gsIndexed, abcdIndexed, ugcIndexed, webLink, uid } = updateJournalDetails;
    let sql = {
         text : ` UPDATE journal_papers SET year = $2, school = $3, campus = $4, policy_cadre = $5, journal_category = $6, all_authors = $7, total_authors = $8, nmims_authors = $9, nmims_authors_count = $10, count_other_faculty = $11, title_of_paper = $12, journal_name = $13, publisher = $14, pages = $15, issn_no = $16, date_of_publishing = $17, impact_factor =  $18, scs_cite_score = $19, scs_indexed = $20, wos_indexed = $21, gs_indexed = $22, abdc_indexed = $23, ugc_indexed = $24, web_link = $25, uid = $26 WHERE id = $1`,
        values : [journalPaperId, year, school, campus, policyCadre, journalCategory, allAuthors, totalAuthors, nmimsAuthors, nmimsAuthorsCount,  countOtherFaculty, titleOfPaper, journalName, publisher, pages, issnNo, dateOfPublishing, impactFactor, scsCiteScore, scsIndexed, wosIndexed, gsIndexed, abcdIndexed, ugcIndexed, webLink, uid ]
    };
    return researchDbW.query(sql);
 
};

// for viewing 

module.exports.viewJournalPaperData = async ({journalPaperId}) => {
    const sql = {
        text : `SELECT year, school, campus, policy_cadre, journal_category, all_authors,
        total_authors, nmims_authors, nmims_authors_count, count_other_faculty, title_of_paper, journal_name, publisher, 
        pages, issn_no, TO_CHAR(date_of_publishing, 'DD-MM-YYYY') as date_of_publishing, impact_factor, scs_cite_score, scs_indexed, wos_indexed, gs_indexed, abdc_indexed, ugc_indexed, web_link, uid FROM journal_papers WHERE id = $1 `,
        values : [journalPaperId]
    }
    console.log('sql ==>>', sql)
    return researchDbR.query(sql);
}
