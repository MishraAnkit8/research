const { autoriders_read_db, autoriders_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const autoDbR = dbPoolManager.get('autoDbR', autoriders_read_db);
const autoDbW = dbPoolManager.get('autoDbW', autoriders_write_db);

// for fetching journal paper data 
module.exports.fetchJournalPaper = () => {
    let sql = {
        text : 'SELECT * FROM journal_papers  ORDER BY id',

    };
    return autoDbR.query(sql);
};

// for inserting journal paper  data
module.exports.createJournalPaper = (journalDetails) => {
    const {year, school, campus, policyCadre, researchType, allAuthors, totalAuthors, nmimsAuthors, nmimsAuthorsCount,  countOtherFaculty, titleOfPaper, journalName, publisher, volume, iss, pages, issnNo, dateOfPublishing, impactFactor, scsCiteScore, scsIndexed, wosIndexed, gsIndexed, abcdIndexed, ugcIndexed, webLink, uid  } = journalDetails ;

    let sql = {
        text : `INSERT INTO journal_papers ( year, school, campus, policy_cadre, research_type, all_authors,
              total_authors, nmims_authors, nmims_authors_count, count_other_faculty, title_of_paper, journal_name, publisher, 
              volume,  iss, pages, issn_no, date_of_publishing, impact_factor, scs_cite_score, scs_indexed, wos_indexed, gs_indexed, abdc_indexed, ugc_indexed, web_link, uid)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27) RETURNING id ` ,

        values : [year, school, campus, policyCadre, researchType, allAuthors, totalAuthors, nmimsAuthors, nmimsAuthorsCount,        countOtherFaculty, titleOfPaper, journalName, publisher, volume, iss, pages, issnNo, dateOfPublishing, impactFactor, scsCiteScore, scsIndexed, wosIndexed, gsIndexed, abcdIndexed, ugcIndexed, webLink, uid ]
    };
    return autoDbW.query(sql);
}
// for deleting journal paper  data 
module.exports.deleteJournalPaper =  async({journalPaperId}) => {
    let sql = {
        text : `DELETE FROM journal_papers WHERE id = $1 `,
        values : [journalPaperId]
    };
    return autoDbR.query(sql);

}
// for updating 
module.exports.updateJournalPaperData = async ({journalPaperId, updateJournalDetails}) => {
    const {year, school, campus, policyCadre, researchType, allAuthors, totalAuthors, nmimsAuthors, nmimsAuthorsCount, countOtherFaculty, titleOfPaper, journalName, publisher, volume, iss, pages, issnNo, dateOfPublishing, impactFactor, scsCiteScore, scsIndexed, wosIndexed, gsIndexed, abcdIndexed, ugcIndexed, webLink, uid } = updateJournalDetails;
    let sql = {
         text : ` UPDATE journal_papers SET year = $2, school = $3, campus = $4, policy_cadre = $5, research_type = $6, all_authors = $7, total_authors = $8, nmims_authors = $9, nmims_authors_count = $10, count_other_faculty = $11, title_of_paper = $12, journal_name = $13, publisher = $14, volume = $15, iss = $16, pages = $17, issn_no = $18, date_of_publishing = $19, impact_factor =  $20, scs_cite_score = $21, scs_indexed = $22, wos_indexed = $23, gs_indexed = $24, abdc_indexed = $25, ugc_indexed = $26, web_link = $27, uid = $28 WHERE id = $1`,
        values : [journalPaperId, year, school, campus, policyCadre, researchType, allAuthors, totalAuthors, nmimsAuthors, nmimsAuthorsCount,  countOtherFaculty, titleOfPaper, journalName, publisher, volume, iss, pages, issnNo, dateOfPublishing, impactFactor, scsCiteScore, scsIndexed, wosIndexed, gsIndexed, abcdIndexed, ugcIndexed, webLink, uid ]
    };
    return autoDbW.query(sql);
 
};

// for viewing 

module.exports.viewJournalPaperData = async ({journalPaperId}) => {
    const sql = {
        text : `SELECT * FROM journal_papers WHERE id = $1  `,
        values : [journalPaperId]
    }
    return autoDbR.query(sql);
}
