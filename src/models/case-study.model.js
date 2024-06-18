const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

module.exports.fetchCaseStudy = async (userName) => {
  const sql = {
    text: `SELECT * FROM case_studies  WHERE created_by = $1 and active=true ORDER BY id desc`,
    values: [userName],
  };
  return researchDbR.query(sql);
};

module.exports.insertDataIntoCaseStudies = async (
  caseStudyData,
  caseStudyFiles,
  userName
) => {
  console.log("caseStudyData in models ==>>", caseStudyData);
  const {
    authorsFirstName,
    titleOfCaseStudy,
    edition,
    volumeNumber,
    publisherName,
    publicationYear,
    pageNumber,
    urlOfCaseStudy,
    numberOfNmimsAuthors,
    nmimsAuthors,
    nmimsCampusAuthors,
    nmimsSchoolAuthors,
    publisherCategory,
  } = caseStudyData;
  // Convert empty strings to NULL for edition and volumeNumber
const editionValue = edition !== '' ? edition : null;
const volumeNumberValue = volumeNumber !== '' ? volumeNumber : null;
  let sql = {
    text: `INSERT INTO case_studies (author_first_name, title_of_case_study, edition, volume_number, publisher_name, publication_year, page_number, url_of_case_study,
                number_of_nmims_authors, nmims_authors, nmims_campus_authors, nmims_school_authors, publisher_category, supporting_documents, created_by) VALUES ($1, $2 , $3 ,$4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id `,
    values: [
      authorsFirstName,
      titleOfCaseStudy,
      editionValue,
      volumeNumberValue,
      publisherName,
      publicationYear,
      pageNumber,
      urlOfCaseStudy,
      numberOfNmimsAuthors,
      nmimsAuthors,
      nmimsCampusAuthors,
      nmimsSchoolAuthors,
      publisherCategory,
      caseStudyFiles,
      userName,
    ],
  };
  console.log("sql ==>>", sql);
  const insertCaseStudyRecord = await researchDbW.query(sql);
  const promises = [insertCaseStudyRecord];
  return Promise.all(promises)
    .then(([insertCaseStudyRecord]) => {
      return {
        status: "Done",
        message: "Record Inserted Successfully",
        caseStudyId: insertCaseStudyRecord.rows[0].id,
        rowCount: insertCaseStudyRecord.rowCount,
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

module.exports.updateCaseStudies = async (
  caseStudyId,
  updatedCaseStudies,
  userName,
  caseStudyFiles
) => {
  const {
    authorsFirstName,
    titleOfCaseStudy,
    edition,
    volumeNumber,
    publisherName,
    publicationYear,
    pageNumber,
    urlOfCaseStudy,
    numberOfNmimsAuthors,
    nmimsAuthors,
    nmimsCampusAuthors,
    nmimsSchoolAuthors,
    publisherCategory,
  } = updatedCaseStudies;

  const editionValue = edition !== '' ? edition : null;
const volumeNumberValue = volumeNumber !== '' ? volumeNumber : null;
  const DataFileString = caseStudyFiles ? caseStudyFiles : null;
  let baseSql = ` UPDATE case_studies SET 
                    author_first_name = $2, title_of_case_study = $3, edition = $4, volume_number = $5, publisher_name = $6, publication_year = $7, page_number = $8, url_of_case_study = $9,
                    number_of_nmims_authors = $10, nmims_authors = $11, nmims_campus_authors = $12, nmims_school_authors = $13, publisher_category = $14, updated_by = $15`;

  let supportingDocumentsUpdate = DataFileString
    ? `, supporting_documents = $16`
    : "";

  let queryText = baseSql + supportingDocumentsUpdate + ` WHERE id = $1`;

  let values = [
    caseStudyId,
    authorsFirstName,
    titleOfCaseStudy,
    editionValue,
    volumeNumberValue,
    publisherName,
    publicationYear,
    pageNumber,
    urlOfCaseStudy,
    numberOfNmimsAuthors,
    nmimsAuthors,
    nmimsCampusAuthors,
    nmimsSchoolAuthors,
    publisherCategory,
    userName,
    ...(DataFileString ? [DataFileString] : []),
  ];
  // return researchDbW.query(sql);

  let sql = {
    text: queryText,
    values: values,
  };
  const updatedCaseStudyRecord = await researchDbW.query(sql);
  const promises = [updatedCaseStudyRecord];
  return Promise.all(promises)
    .then(([updatedCaseStudyRecord]) => {
      return { status: "Done", message: "Record Updated Successfully" };
    })
    .catch((error) => {
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
};
