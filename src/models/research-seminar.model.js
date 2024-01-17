const { autoriders_read_db, autoriders_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const autoDbR = dbPoolManager.get('autoDbR', autoriders_read_db);
const autoDbW = dbPoolManager.get('autoDbW', autoriders_write_db);

// for fetching journal paper data 
module.exports.fetchResearchSeminar = () => {
    let sql = {
        text : 'SELECT * FROM research_seminars  ORDER BY id',

    };
    return autoDbR.query(sql);
};

// for inserting journal paper  data
module.exports.createResearchSeminar = ({seminarDetails}) => {
    const {year, school, campus, NmimsFaculty, publisherCategory, titleOfPaper, journalName, publisher, pages, issnNo, dateOfPublishing, impactFactor, scsCiteScore, scsIndexed, wosIndexed, gsIndexed, abcdIndexed, ugcIndexed, webLink, uid  } = seminarDetails ;

    let sql = {
        text : `INSERT INTO research_seminars ( year, school, campus, nmims_faculty, publisher_category, title_of_paper, journal_name, publisher, 
               pages, issn_no, date_of_publishing, impact_factor, scs_cite_score, scs_indexed, wos_indexed, gs_indexed, abdc_indexed, ugc_indexed, web_link, uid)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING id ` ,

        values : [year, school, campus, NmimsFaculty, publisherCategory, titleOfPaper, journalName, publisher, pages, issnNo, dateOfPublishing, impactFactor, scsCiteScore, scsIndexed, wosIndexed, gsIndexed, abcdIndexed, ugcIndexed, webLink, uid ]
    };
    return autoDbW.query(sql);
}
// for deleting journal paper  data 
module.exports.deleteRsearchSeminar =  async({seminarId}) => {
    let sql = {
        text : `DELETE FROM research_seminars WHERE id = $1 `,
        values : [seminarId]
    };
    return autoDbW.query(sql);

}
// for updating 
module.exports.updateRsearchSeminar = async ({seminarId , updateResearchSeminar}) => {
    const {year, school, campus, NmimsFaculty, publisherCategory, titleOfPaper, journalName, publisher, pages, issnNo, dateOfPublishing, impactFactor, scsCiteScore, scsIndexed, wosIndexed, gsIndexed, abcdIndexed, ugcIndexed, webLink, uid } = updateResearchSeminar ;

    let sql = {
         text : ` UPDATE research_seminars SET  year = $2, school = $3, campus = $4, nmims_faculty = $5, publisher_category = $6, title_of_paper = $7, journal_name = $8, publisher = $9, 
          pages = $10, issn_no = $11, date_of_publishing = $12, impact_factor = $13, scs_cite_score = $14, scs_indexed = $15, wos_indexed = $16, gs_indexed = $17, abdc_indexed = $18, ugc_indexed = $19, web_link = $20, uid = $21  WHERE id = $1`,
        values : [seminarId, year, school, campus, NmimsFaculty, publisherCategory, titleOfPaper, journalName, publisher, pages, issnNo, dateOfPublishing, impactFactor, scsCiteScore, scsIndexed, wosIndexed, gsIndexed, abcdIndexed, ugcIndexed, webLink, uid ]
    };
    return autoDbW.query(sql);
 
};

// for viewing 

module.exports.viewRsearchSeminarData = async ({seminarId}) => {
    const sql = {
        text : `SELECT  year, school, campus, nmims_faculty, publisher_category, title_of_paper, journal_name, publisher, 
        pages, issn_no, TO_CHAR(date_of_publishing, 'DD-MM-YYYY') as date_of_publishing, impact_factor, scs_cite_score, scs_indexed, wos_indexed, gs_indexed, abdc_indexed, ugc_indexed, web_link, uid FROM research_seminars WHERE id = $1 `,
        values : [seminarId]
    }
    console.log('sql ==>>>', sql)
    return autoDbR.query(sql);
}
