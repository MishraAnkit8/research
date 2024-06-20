const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

const insertDbModels = require('./insert-update-records.models');

module.exports.fetchTeachingExecellance = async (userName) => {
  let sql = {
    text: `SELECT * FROM teaching_execellance WHERE created_by = $1 and active=true ORDER BY id desc`,
    values: [userName],
  };
  return researchDbR.query(sql);
};

module.exports.insertTeachingExecellanceData = async (teachingExecellance, teachingFilesArrayData, userName) => {
  const {pedagogyInnovation, pedagogyLink, fdpProgram, fdpProgramLink, workShopDetails, workShopLink, invitingFaculty,
        invitingFacultyLink, programOrientation, programOrientationLink} = teachingExecellance;

  const teachingValues = [pedagogyInnovation, pedagogyLink, fdpProgram, fdpProgramLink, workShopDetails, workShopLink, invitingFaculty,
    invitingFacultyLink, programOrientation, programOrientationLink, teachingFilesArrayData.pedagogyInnovationFileString,
    teachingFilesArrayData.fdpProgramFileString, teachingFilesArrayData.workShopFileString, teachingFilesArrayData.invitingFacultyFileString,
    teachingFilesArrayData.programOrientationFileString,userName];

  const teachingFields = ['pedagogy_innovation', 'pedagogy_innovation_link', 'fdp_program', 'fdp_program_link', 'workshop_details',
    'workshop_link', 'inviting_faculty', 'inviting_faculty_link', 'program_orientation', 'program_orientation_link',
   'pedagogy_innovation_file', 'fdp_program_file', 'workshop_file', 'inviting_faculty_file', 'program_orientation_file', 'created_by'];

  const insertTeachingExecellance = await insertDbModels.insertRecordIntoMainDb('teaching_execellance', teachingFields, teachingValues, userName);

  console.log('insertTeachingExecellance ===>>>>>', insertTeachingExecellance);

  return insertTeachingExecellance.status === "Done" ? {
    status : insertTeachingExecellance.status,
    message : insertTeachingExecellance.message
    } : {
    status : insertTeachingExecellance.status,
    message : insertTeachingExecellance.message,
    errorCode : insertTeachingExecellance.errorCode
    }
};

module.exports.updateTeachingExecellance = async (teachingId, updatedTeachingExecellance, teachingDocumentToBeUpdate,
  userName) => {

  console.log('teachingDocumentToBeUpdate in models ==>>>>>', teachingDocumentToBeUpdate)
  const {pedagogyInnovation, pedagogyLink, fdpProgram, fdpProgramLink, workShopDetails, workShopLink, invitingFaculty,
    invitingFacultyLink, programOrientation, programOrientationLink} = updatedTeachingExecellance;

const teachingValues = [pedagogyInnovation, pedagogyLink, fdpProgram, fdpProgramLink, workShopDetails, workShopLink, invitingFaculty,
invitingFacultyLink, programOrientation, programOrientationLink, teachingDocumentToBeUpdate.pedagogyInnovationFileString,
teachingDocumentToBeUpdate.fdpProgramFileString, teachingDocumentToBeUpdate.workShopFileString, teachingDocumentToBeUpdate.invitingFacultyFileString,
teachingDocumentToBeUpdate.programOrientationFileString, userName, teachingId];

const teachingFields = ['pedagogy_innovation', 'pedagogy_innovation_link', 'fdp_program', 'fdp_program_link', 'workshop_details',
'workshop_link', 'inviting_faculty', 'inviting_faculty_link', 'program_orientation', 'program_orientation_link',
'pedagogy_innovation_file', 'fdp_program_file', 'workshop_file', 'inviting_faculty_file', 'program_orientation_file', 'updated_by'];

const updateTeachingExecellance = await insertDbModels.updateFieldWithSomeFilesOrNotFiles('teaching_execellance', teachingFields, teachingValues, userName);

console.log('updateTeachingExecellance ===>>>>>', updateTeachingExecellance);

return updateTeachingExecellance.status === "Done" ? {
status : updateTeachingExecellance.status,
message : updateTeachingExecellance.message
} : {
status : updateTeachingExecellance.status,
message : updateTeachingExecellance.message,
errorCode : updateTeachingExecellance.errorCode
}
  
};

module.exports.deleteTeachingExecellance = async (teachingId) => {
  let sql = {
    // text: `DELETE FROM  teaching_execellance WHERE id = $1`,
    text: `update teaching_execellance set active=false WHERE id = $1`,
    values: [teachingId],
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

module.exports.teachingExecellanceView = async (teachingId) => {
  let sql = {
    text: `SELECT * FROM teaching_execellance WHERE id = $1 and active=true`,
    values: [teachingId],
  };

  return researchDbR.query(sql);
};
