const { autoriders_read_db, autoriders_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const autoDbR = dbPoolManager.get('autoDbR', autoriders_read_db);
const autoDbW = dbPoolManager.get('autoDbW', autoriders_write_db);

module.exports.fetchCaseStudy = async() =>{
    const sql = {
        text : `SELECT * FROM case_studies ORDER BY id`,

    }
    return autoDbR.query(sql);
};

module.exports.insertDataIntoCaseStudies = ({caseStudyData}) => {
    console.log('caseStudyData in models ==>>', caseStudyData);
    const {authorsFirstName, authorLastName, titleOfCaseStudy, edition, volumeNumber, publisherName, publicationYear, pageNumber, urlOfCaseStudy,
               numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, publisherCategory } = caseStudyData ;
    let sql = {
        text : `INSERT INTO case_studies (author_first_name, author_last_name, title_of_case_study, edition, volume_number, publisher_name, publication_year, page_number, url_of_case_study,
                number_of_nmims_authors, nmims_authors, nmims_campus_authors, nmims_school_authors, publisher_category) VALUES ($1, $2 , $3 ,$4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id ` ,
        values : [authorsFirstName, authorLastName, titleOfCaseStudy, edition, volumeNumber, publisherName, publicationYear, pageNumber, urlOfCaseStudy,
                 numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, publisherCategory]
    }
    console.log('sql ==>>', sql)
    return autoDbW.query(sql);
}

module.exports.deleteCaseStudies = ({caseStudyId}) => {
    let sql = {
        text : `DELETE FROM case_studies WHERE id = $1` ,
        values : [caseStudyId]
    }
    return autoDbW.query(sql);
}

module.exports.viewCaseStudyData = async (caseStudyId) => {
    let sql = {
        text : `  SELECT * FROM case_studies WHERE id = $1 `,
        values : [caseStudyId]
    }
    return autoDbR.query(sql)

}

module.exports.updateCaseStudies = async ({caseStudyId, updatedCaseStudies}) => {
    const {authorsFirstName, authorLastName, titleOfCaseStudy, edition, volumeNumber, publisherName, publicationYear, pageNumber, urlOfCaseStudy,
        numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, publisherCategory} = updatedCaseStudies;
    let sql = {
        text : ` UPDATE case_studies SET 
                author_first_name = $2, author_last_name = $3, title_of_case_study = $4, edition = $5, volume_number = $6, publisher_name = $7,
                publication_year = $8, page_number = $9, url_of_case_study = $10, number_of_nmims_authors = $11, nmims_authors = $12, nmims_campus_authors = $13, nmims_school_authors = $14, publisher_category = $15  
                WHERE id = $1 ` ,
        values : [caseStudyId, authorsFirstName, authorLastName, titleOfCaseStudy, edition, volumeNumber, publisherName, publicationYear, pageNumber, urlOfCaseStudy,
            numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, publisherCategory]

    }
    return autoDbW.query(sql);
}