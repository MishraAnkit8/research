const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchCaseStudy = async(userName) =>{
    const sql = {
        text : `SELECT * FROM case_studies  WHERE created_by = $1  ORDER BY id`,
        values : [userName]

    }
    return researchDbR.query(sql);
};

module.exports.insertDataIntoCaseStudies =async ({caseStudyData}, userName) => {
    console.log('caseStudyData in models ==>>', caseStudyData);
    const {authorsFirstName, authorLastName, titleOfCaseStudy, edition, volumeNumber, publisherName, publicationYear, pageNumber, urlOfCaseStudy,
               numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, publisherCategory } = caseStudyData ;
    let sql = {
        text : `INSERT INTO case_studies (author_first_name, author_last_name, title_of_case_study, edition, volume_number, publisher_name, publication_year, page_number, url_of_case_study,
                number_of_nmims_authors, nmims_authors, nmims_campus_authors, nmims_school_authors, publisher_category, created_by) VALUES ($1, $2 , $3 ,$4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id ` ,
        values : [authorsFirstName, authorLastName, titleOfCaseStudy, edition, volumeNumber, publisherName, publicationYear, pageNumber, urlOfCaseStudy,
                 numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, publisherCategory, userName]
    }
    console.log('sql ==>>', sql)
    const insertCaseStudyRecord = await researchDbW.query(sql);
    const promises = [insertCaseStudyRecord];
    return Promise.all(promises).then(([insertCaseStudyRecord]) => {
        return  { status : "Done" , message : "Record Inserted Successfully" , caseStudyId : insertCaseStudyRecord.rows.id, rowCount : insertCaseStudyRecord.rowCount}
    })
    .catch((error) => {
        return{status : "Failed" , message : error.message , errorCode : error.code}
    })
    
}

module.exports.deleteCaseStudies = async ({caseStudyId}) => {
    let sql = {
        text : `DELETE FROM case_studies WHERE id = $1` ,
        values : [caseStudyId]
    }
    console.log('sql ==>>', sql);
    return new Promise((resolve, reject) => {
        researchDbW.query(sql)
          .then(result => {
            resolve({ status : "Done", message : "Record Insertd Successfully", rowCount : result.rowCount, id : result.rows[0] });
          })
          .catch(error => {
            console.error('Error on update:', error.code, error.message);
            console.log('error.message ====>>>>>', error.message);
            const message = error.code === '23505' ? "DOI ID Of Book Chapter Should Be Unique" : error.message;
            reject({ status: 'Failed', message : message, errorCode : error.code});
          });
      });
}

module.exports.viewCaseStudyData = async (caseStudyId, userName) => {
    let sql = {
        text : `  SELECT * FROM case_studies WHERE  id = $1 AND created_by = $2 `,
        values : [caseStudyId, userName]
    }
    return researchDbR.query(sql)

}

module.exports.updateCaseStudies = async ({caseStudyId, updatedCaseStudies}, userName) => {
    const {authorsFirstName, authorLastName, titleOfCaseStudy, edition, volumeNumber, publisherName, publicationYear, pageNumber, urlOfCaseStudy,
        numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, publisherCategory} = updatedCaseStudies;
    let sql = {
        text : ` UPDATE case_studies SET 
                author_first_name = $2, author_last_name = $3, title_of_case_study = $4, edition = $5, volume_number = $6, publisher_name = $7,
                publication_year = $8, page_number = $9, url_of_case_study = $10, number_of_nmims_authors = $11, nmims_authors = $12, nmims_campus_authors = $13, nmims_school_authors = $14, publisher_category = $15,
                updated_by = $16  WHERE id = $1 ` ,
        values : [caseStudyId, authorsFirstName, authorLastName, titleOfCaseStudy, edition, volumeNumber, publisherName, publicationYear, pageNumber, urlOfCaseStudy,
            numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, publisherCategory, userName]

    }
    // return researchDbW.query(sql);
    const updatedCaseStudyRecord = await researchDbW.query(sql);
    const promises = [updatedCaseStudyRecord];
    return Promise.all(promises).then(([updatedCaseStudyRecord]) => {
        return  { status : "Done" , message : "Record Updated Successfully"}
    })
    .catch((error) => {
        return{status : "Failed" , message : error.message , errorCode : error.code}
    })
}