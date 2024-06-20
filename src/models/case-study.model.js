const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

const insertDbModels = require('./insert-update-records.models');

module.exports.fetchCaseStudy = async (userName) => {
  const sql = {
    text: `SELECT * FROM case_studies  WHERE created_by = $1 and active=true ORDER BY id desc`,
    values: [userName],
  };
  return researchDbR.query(sql);
};

module.exports.insertDataIntoCaseStudies = async (caseStudyData, caseStudyFiles, userName) => {
  console.log("caseStudyData in models ==>>", caseStudyData);
  const {authorsFirstName, titleOfCaseStudy, edition, volumeNumber, publisherName, publicationYear,
    pageNumber, urlOfCaseStudy, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors,
    publisherCategory} = caseStudyData;

  const caseStudiesValues = [authorsFirstName, titleOfCaseStudy, edition, volumeNumber, publisherName, publicationYear,
    pageNumber, urlOfCaseStudy, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors,
    publisherCategory, caseStudyFiles, userName];

  const caseStudiesFields = ['author_first_name', 'title_of_case_study', 'edition', 'volume_number', 'publisher_name', 'publication_year', 'page_number', 'url_of_case_study',
    'number_of_nmims_authors', 'nmims_authors', 'nmims_campus_authors', 'nmims_school_authors', 'publisher_category', 'supporting_documents', 'created_by'];

  const insertCaseStudiesData = await insertDbModels.insertRecordIntoMainDb('case_studies', caseStudiesFields, caseStudiesValues, userName)
  
  console.log('insertCaseStudiesData ===>>>>', insertCaseStudiesData);
  return insertCaseStudiesData.status === "Done" ? {
    status : insertCaseStudiesData.status,
    message : insertCaseStudiesData.message
  } : {
    status : insertCaseStudiesData.status,
    message : insertCaseStudiesData.message
  }
 
};

module.exports.deleteCaseStudies = async ({ caseStudyId }) => {
  let sql = {
    // text : `DELETE FROM case_studies WHERE id = $1` ,
    text: `UPDATE case_studies set active=false WHERE id = $1`,
    values: [caseStudyId],
  };
  console.log("sql ==>>", sql);
  return new Promise((resolve, reject) => {
    researchDbW
      .query(sql)
      .then((result) => {
        resolve({
          status: "Done",
          message: "Record Insertd Successfully",
          rowCount: result.rowCount,
          id: result.rows[0],
        });
      })
      .catch((error) => {
        console.error("Error on update:", error.code, error.message);
        console.log("error.message ====>>>>>", error.message);
        const message =
          error.code === "23505"
            ? "DOI ID Of Book Chapter Should Be Unique"
            : error.message;
        reject({ status: "Failed", message: message, errorCode: error.code });
      });
  });
};

module.exports.viewCaseStudyData = async (caseStudyId, userName) => {
  let sql = {
    text: `  SELECT author_first_name, title_of_case_study, edition, volume_number, publisher_name, publication_year, page_number, url_of_case_study,
        number_of_nmims_authors, nmims_authors, nmims_campus_authors, nmims_school_authors, publisher_category, supporting_documents, created_by  FROM case_studies WHERE  id = $1 AND created_by = $2 and active=true`,
    values: [caseStudyId, userName],
  };
  const caseStudyData = await researchDbR.query(sql);
  const promises = [caseStudyData];

  return Promise.all(promises)
    .then(([caseStudyData]) => {
      return {
        status: "Done",
        message: "Data Fetched for view",
        caseStudyData: caseStudyData.rows,
        rowCount: caseStudyData.rowCount,
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

module.exports.updateCaseStudies = async (caseStudyId, updatedCaseStudies, userName, caseStudyFiles) => {
  
  const {authorsFirstName, titleOfCaseStudy, edition, volumeNumber, publisherName, publicationYear,
    pageNumber, urlOfCaseStudy, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors,
    publisherCategory } = updatedCaseStudies;

  let updateCaseStudiesData;

  if(caseStudyFiles){
    const caseStudiesValues = [authorsFirstName, titleOfCaseStudy, edition, volumeNumber, publisherName, publicationYear,
      pageNumber, urlOfCaseStudy, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors,
      publisherCategory, caseStudyFiles, userName, caseStudyId];
  
    const caseStudiesFields = ['author_first_name', 'title_of_case_study', 'edition', 'volume_number', 'publisher_name', 'publication_year', 'page_number', 'url_of_case_study',
      'number_of_nmims_authors', 'nmims_authors', 'nmims_campus_authors', 'nmims_school_authors', 'publisher_category', 'supporting_documents', 'updated_by'];
  
    updateCaseStudiesData = await insertDbModels.updateFieldWithFiles('case_studies', caseStudiesFields, caseStudiesValues, userName)
    

  } else{
    const caseStudiesValues = [authorsFirstName, titleOfCaseStudy, edition, volumeNumber, publisherName, publicationYear,
      pageNumber, urlOfCaseStudy, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors,
      publisherCategory, userName, caseStudyId];
  
    const caseStudiesFields = ['author_first_name', 'title_of_case_study', 'edition', 'volume_number', 'publisher_name', 'publication_year', 'page_number', 'url_of_case_study',
      'number_of_nmims_authors', 'nmims_authors', 'nmims_campus_authors', 'nmims_school_authors', 'publisher_category', 'updated_by'];
  
    updateCaseStudiesData = await insertDbModels.updateFieldWithOutFiles('case_studies', caseStudiesFields, caseStudiesValues, userName)
    
  }

  console.log('updateCaseStudiesData ===>>>>', updateCaseStudiesData);
  return updateCaseStudiesData.status === "Done" ? {
    status : updateCaseStudiesData.status,
    message : updateCaseStudiesData.message
  } : {
    status : updateCaseStudiesData.status,
    message : updateCaseStudiesData.message
  }

};
