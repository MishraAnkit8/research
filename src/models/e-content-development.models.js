const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

const insertDbModels = require('./insert-update-records.models');

module.exports.fetchEContentDevelopmentData = async (userName) => {
  let sql = {
    text: `SELECT * FROM e_content_development WHERE created_by = $1 and active=true ORDER BY id desc`,
    values: [userName],
  };
  console.log("sql ==>>", sql);
  return researchDbR.query(sql);
};

module.exports.insertEContentRecord = async (EcontentFormData, userName) => {
  console.log("EcontentData in models ===>>>>", EcontentFormData);

  const {facultyName, moduleName, platformName, launchingDate, documentLink, eContentList, MediaCenterLink
  } = EcontentFormData;

  const eContentAvlues = [facultyName, moduleName, platformName, launchingDate, documentLink, eContentList, MediaCenterLink, userName];
  const eContentField = ['faculty_name', 'module_name', 'platform', 'launch_date', 'document_links', 'content_development_facilities', 'media_centre_video_link', 'created_by']

  const insertEContent = await insertDbModels.insertRecordIntoMainDb('e_content_development', eContentField, eContentAvlues, userName);
  console.log('insertEContent ===>>>>>>', insertEContent);

  return insertEContent.status === "Done" ? {
      status : insertEContent.status,
      message : insertEContent.message
  } : {
      status : insertEContent.status,
      message : insertEContent.message,
      errorCode : insertEContent.errorCode
  }

};

module.exports.updateEcontentRow = async (updatedEContentData, eContentId, userName
) => {
  const {facultyName, moduleName, platformName, launchingDate, documentLink, eContentList, MediaCenterLink
  } = updatedEContentData;

  const eContentAvlues = [facultyName, moduleName, platformName, launchingDate, documentLink, eContentList, MediaCenterLink, userName, eContentId];
  const eContentField = ['faculty_name', 'module_name', 'platform', 'launch_date', 'document_links', 'content_development_facilities', 'media_centre_video_link', 'created_by']

  const updateEContent = await insertDbModels.updateFieldWithOutFiles('e_content_development', eContentField, eContentAvlues, userName);
  console.log('updateEContent ===>>>>>>', updateEContent);

  return updateEContent.status === "Done" ? {
      status : updateEContent.status,
      message : updateEContent.message
  } : {
      status : updateEContent.status,
      message : updateEContent.message,
      errorCode : updateEContent.errorCode
  }

};

module.exports.deleteEContentRowData = async (eContentId) => {
  let sql = {
    // text : `DELETE FROM e_content_development WHERE id = $1`,
    text: `update e_content_development set active = false WHERE id = $1`,
    values: [eContentId],
  };

  console.log("sql ===>>>>>", sql);
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

module.exports.viewEContentDevelopmentData = async (eContentId, userName) => {
  console.log("eContentId ===>>>>", eContentId);

  let sql = {
    text: `SELECT faculty_name, module_name, platform, launch_date, document_links, content_development_facilities, media_centre_video_link FROM 
            e_content_development WHERE id = $1 AND active=true and created_by = $2`,
    values: [eContentId, userName],
  };
  console.log("sql ===>>>>>", sql);
  const viewRecord = await researchDbR.query(sql);
  const promises = [viewRecord];
  return Promise.all(promises)
    .then(([viewRecord]) => {
      return {
        status: "Done",
        message: "Record Fetched Successfully",
        viewEcontentData: viewRecord.rows,
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
