const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

// for fetching journal paper data
module.exports.fetchResearchSeminar = async (userName) => {
  let sql = {
    text: "SELECT * FROM research_seminars WHERE created_by = $1 and active=true  ORDER BY id desc",
    values: [userName],
  };

  // return await researchDbR.query(sql);
  const researchSeminarData = await researchDbR.query(sql);
  const promises = [researchSeminarData];
  return Promise.all(promises)
    .then(([researchSeminarData]) => {
      return {
        status: "Done",
        message: "Fetched successfully",
        seminarData: researchSeminarData.rows,
        rowCount: researchSeminarData.rowCount,
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

// for inserting journal paper  data
module.exports.createResearchSeminar = async (
  seminarDetails,
  seminarFiles,
  userName
) => {
  const {
    year,
    school,
    campus,
    NmimsFaculty,
    titleOfPaper,
    journalName,
    publisher,
    pages,
    issnNo,
    publisherCategory,
    dateOfPublishing,
    impactFactor,
    scsCiteScore,
    scsIndexed,
    wosIndexed,
    gsIndexed,
    abcdIndexed,
    ugcIndexed,
    webLink,
    uid,
    topic,
    resourcePerson,
  } = seminarDetails;

  let sql = {
    text: `INSERT INTO research_seminars (year, school, campus, nmims_faculty, title_of_paper, journal_name, publisher, pages
        , issn_no, publisher_category, date_of_publishing, impact_factor, scs_cite_score, scs_indexed, wos_indexed, gs_indexed,
        abdc_indexed, ugc_indexed, web_link, uid, supporting_documents, created_by , topic , resource_person)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22 , $23, $24) RETURNING id `,

    values: [
      year,
      school,
      campus,
      NmimsFaculty,
      titleOfPaper,
      journalName,
      publisher,
      pages,
      issnNo,
      publisherCategory,
      dateOfPublishing,
      impactFactor,
      scsCiteScore,
      scsIndexed,
      wosIndexed,
      gsIndexed,
      abcdIndexed,
      ugcIndexed,
      webLink,
      uid,
      seminarFiles,
      userName,
      topic,
      resourcePerson,
    ],
  };

  console.log("sql ===>>>", sql);
  const insertResearchSeminarRecord = await researchDbW.query(sql);
  const promises = [insertResearchSeminarRecord];
  return Promise.all(promises)
    .then(([insertResearchSeminarRecord]) => {
      return {
        status: "Done",
        message: "Record Inserted Successfully",
        rowCount: insertResearchSeminarRecord.rowCount,
        seminarId: insertResearchSeminarRecord.rows[0].id,
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
module.exports.deleteRsearchSeminar = async (seminarId, userName) => {
  let sql = {
    // text : `DELETE FROM research_seminars WHERE id = $1 AND  created_by = $2`,
    text: `update research_seminars set active=false WHERE id = $1 AND  created_by = $2`,
    values: [seminarId, userName],
  };
  console.log("sql ===>>>", sql);
  const deletedRecord = await researchDbW.query(sql);
  const promises = [deletedRecord];
  return Promise.all(promises)
    .then(([deletedRecord]) => {
      return {
        status: "Done",
        message: "Record Deleted Successfully",
        rowCount: deletedRecord.rowCount,
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
// for updating
module.exports.updateRsearchSeminar = async (
  seminarId,
  updateSeminarDetails,
  updatedSeminarFiles,
  userName
) => {
  const {
    year,
    school,
    campus,
    NmimsFaculty,
    titleOfPaper,
    journalName,
    publisher,
    pages,
    issnNo,
    publisherCategory,
    dateOfPublishing,
    impactFactor,
    scsCiteScore,
    scsIndexed,
    wosIndexed,
    gsIndexed,
    abcdIndexed,
    ugcIndexed,
    webLink,
    uid,
    topic,
    resourcePerson,
  } = updateSeminarDetails;

  const supportingDocuments = updatedSeminarFiles || null;

  let baseSql = ` UPDATE research_seminars SET  year = $2, school = $3, campus = $4, nmims_faculty = $5, title_of_paper = $6, journal_name = $7, publisher = $8, pages = $9
        , issn_no = $10, publisher_category = $11, date_of_publishing = $12, impact_factor = $13, scs_cite_score = $14, scs_indexed = $15, wos_indexed = $16, gs_indexed = $17,
        abdc_indexed = $18, ugc_indexed = $19, web_link = $20, uid = $21, created_by = $22, topic=$23 ,resource_person = $24`;

  let supportingDocumentsUpdate = updatedSeminarFiles
    ? `, supporting_documents = $25`
    : "";

  let queryText = baseSql + supportingDocumentsUpdate + ` WHERE id = $1`;

  let values = [
    seminarId,
    year,
    school,
    campus,
    NmimsFaculty,
    titleOfPaper,
    journalName,
    publisher,
    pages,
    issnNo,
    publisherCategory,
    dateOfPublishing,
    impactFactor,
    scsCiteScore,
    scsIndexed,
    wosIndexed,
    gsIndexed,
    abcdIndexed,
    ugcIndexed,
    webLink,
    uid,
    userName,
    topic,
    resourcePerson,
    ...(updatedSeminarFiles ? [updatedSeminarFiles] : []),
  ];
  let sql = {
    text: queryText,
    values: values,
  };
  console.log("sql ===>>>>", sql);
  const updateResearchSeminarRecord = await researchDbW.query(sql);
  const promises = [updateResearchSeminarRecord];
  return Promise.all(promises)
    .then(([updateResearchSeminarRecord]) => {
      return {
        status: "Done",
        message: "Record Updated Successfully",
        rowCount: updateResearchSeminarRecord.rowCount,
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

// for viewing

module.exports.viewRsearchSeminarData = async ({ seminarId }, userName) => {
  const sql = {
    text: `SELECT  TO_CHAR(year, 'DD-MM-YYYY') AS year, school, campus, nmims_faculty, publisher_category, title_of_paper, journal_name, publisher, 
        pages, issn_no, TO_CHAR(date_of_publishing, 'DD-MM-YYYY') as date_of_publishing, impact_factor, scs_cite_score, scs_indexed, wos_indexed, gs_indexed, abdc_indexed, ugc_indexed, web_link, uid, supporting_documents,topic,resource_person FROM research_seminars WHERE id = $1 AND created_by = $2 and active=true`,
    values: [seminarId, userName],
  };
  console.log("sql ==>>>", sql);
  // return researchDbR.query(sql);
  const researchSeminarData = await researchDbR.query(sql);
  const promises = [researchSeminarData];
  return Promise.all(promises)
    .then(([researchSeminarData]) => {
      return {
        status: "Done",
        message: "Fetched successfully",
        seminarData: researchSeminarData.rows,
        rowCount: researchSeminarData.rowCount,
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
