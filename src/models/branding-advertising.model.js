const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

const insertDbModels = require('./insert-update-records.models');

module.exports.fetchBrandingAndadvertising = async (userName) => {
  let sql = {
    text: `SELECT * FROM branding_and_advertising  WHERE created_by = $1 and active=true ORDER BY id desc`,
    values: [userName],
  };
  console.log("sql ==>>", sql);

  return researchDbR.query(sql);
};

module.exports.insertBrandingAndAdvertisingData = async(advertisingData, brandingFilesContainer, userName) => {

      const {facultyRecognition, facultyRecognitionLink, facultyAward, facultyAwardLink, staffAward, staffAwardLink, alumniAward, alumniAwardLink,
            studentAward, studentAwardLink, internationalLinkage, internationalLinkageLink, conferenceParticipation, conferenceParticipationLink, organisingConference,
            organisingConferenceLink, studentEventParticipation, studentEventParticipationLink, newsPaperArticle, newsPaperArticleLink} = advertisingData;

      const brandingValues = [facultyRecognition, facultyRecognitionLink, facultyAward, facultyAwardLink, staffAward, staffAwardLink, alumniAward, alumniAwardLink,
        studentAward, studentAwardLink, internationalLinkage, internationalLinkageLink, conferenceParticipation, conferenceParticipationLink, organisingConference,
        organisingConferenceLink, studentEventParticipation, studentEventParticipationLink, newsPaperArticle, newsPaperArticleLink, brandingFilesContainer.facultyRecognitionDocuments,
        brandingFilesContainer.facultyAwardDocuments, brandingFilesContainer.staffAwardDocuments, brandingFilesContainer.alumniAwardDocuments, brandingFilesContainer.studentAwardDocuments, brandingFilesContainer.internationalLinkageDocuments, brandingFilesContainer.conferenceParticipationDocuments, brandingFilesContainer.organisingConferenceDocuments,
        brandingFilesContainer.studentEventParticipationDocuments, brandingFilesContainer.newspaperArticleDocuments, userName ]

      const brandingFields = ['faculty_recognition', 'faculty_recognition_link', 'faculty_award', 'faculty_award_link', 'staff_award', 'staff_award_link', 'alumni_award', 'alumni_award_link',
        'student_award', 'student_award_link', 'international_linkage', 'international_linkage_link', 'conference_participation', 'conference_participation_link',
        'organising_conference', 'organising_conference_link', 'student_event_participation', 'student_event_participation_link', 'newspaper_article', 'newspaper_article_link', 
        'faculty_recognition_documents', 'faculty_award_documents', 'staff_award_documents', 'alumni_award_documents', 'student_award_documents', 'international_linkage_documents', 
        'conference_participation_documents', 'organising_conference_documents', 'student_event_participation_documents', 'newspaper_article_documents', 'created_by'];

      const insertBrandingAndAdvertising = await insertDbModels.insertRecordIntoMainDb('branding_and_advertising', brandingFields, brandingValues, userName);

      console.log('insertBrandingAndAdvertising ====>>>>>>', insertBrandingAndAdvertising);
      return insertBrandingAndAdvertising.status === "Done" ? {
        status : insertBrandingAndAdvertising.status,
        message : insertBrandingAndAdvertising.message
        } : {
        status : insertBrandingAndAdvertising.status,
        message : insertBrandingAndAdvertising.message,
        errorCode : insertBrandingAndAdvertising.errorCode
        }

};

module.exports.updateBrandingAdvertising = async (advertisingId, updatedAdvertisingData, updatedFacultyRecognitionFilesArray,
    updatedFacultyAwardFilesArray, updatedStaffAwardFilesArray, updatedAlumniAwardFilesArray, updatedStudentAwardFilesArray,
    updatedInternationalLinkageFilesArray, updatedConferenceParticipationFilesArray, updatedOrganisingConferenceFilesArray,
    updatedStudentEventParticipationFilesArray, updatedNewspaperArticleFilesArray, userName) => {
    const {
      facultyRecognition, facultyRecognitionLink, facultyAward, facultyAwardLink, staffAward, staffAwardLink, alumniAward, alumniAwardLink,
      studentAward, studentAwardLink, internationalLinkage, internationalLinkageLink, conferenceParticipation, conferenceParticipationLink, organisingConference,
      organisingConferenceLink, studentEventParticipation, studentEventParticipationLink, newsPaperArticle, newsPaperArticleLink
    } = updatedAdvertisingData;

    const brandingValues = [facultyRecognition, facultyRecognitionLink, facultyAward, facultyAwardLink, staffAward, staffAwardLink, alumniAward, alumniAwardLink,
      studentAward, studentAwardLink, internationalLinkage, internationalLinkageLink, conferenceParticipation, conferenceParticipationLink, organisingConference,
      organisingConferenceLink, studentEventParticipation, studentEventParticipationLink, newsPaperArticle, newsPaperArticleLink, updatedFacultyRecognitionFilesArray,
      updatedFacultyAwardFilesArray, updatedStaffAwardFilesArray, updatedAlumniAwardFilesArray, updatedStudentAwardFilesArray,
      updatedInternationalLinkageFilesArray, updatedConferenceParticipationFilesArray, updatedOrganisingConferenceFilesArray,
      updatedStudentEventParticipationFilesArray, updatedNewspaperArticleFilesArray, userName, advertisingId]

    const brandingFields = ['faculty_recognition', 'faculty_recognition_link', 'faculty_award', 'faculty_award_link', 'staff_award', 'staff_award_link', 'alumni_award', 'alumni_award_link',
      'student_award', 'student_award_link', 'international_linkage', 'international_linkage_link', 'conference_participation', 'conference_participation_link',
      'organising_conference', 'organising_conference_link', 'student_event_participation', 'student_event_participation_link', 'newspaper_article', 'newspaper_article_link', 
      'faculty_recognition_documents', 'faculty_award_documents', 'staff_award_documents', 'alumni_award_documents', 'student_award_documents', 'international_linkage_documents', 
      'conference_participation_documents', 'organising_conference_documents', 'student_event_participation_documents', 'newspaper_article_documents', 'updated_by'];

    const updateBrandingAndAdvertising = await insertDbModels.updateFieldWithSomeFilesOrNotFiles('branding_and_advertising', brandingFields, brandingValues, userName);

    console.log('updateBrandingAndAdvertising ====>>>>>>', updateBrandingAndAdvertising);
    return updateBrandingAndAdvertising.status === "Done" ? {
      status : updateBrandingAndAdvertising.status,
      message : updateBrandingAndAdvertising.message
      } : {
      status : updateBrandingAndAdvertising.status,
      message : updateBrandingAndAdvertising.message,
      errorCode : updateBrandingAndAdvertising.errorCode
      }
   
};

module.exports.brandingAndadvertisingview = async (advertisingId, userName) => {
  let sql = {
    text: `SELECT * FROM branding_and_advertising WHERE id = $1 AND  created_by = $2 AND active=true`,
    values: [advertisingId, userName],
  };
  console.log("sql ==>>", sql);
  return researchDbR.query(sql);
};

module.exports.brandingAndadvertisingDelete = async (advertisingId) => {
  let sql = {
    // text : `DELETE FROM branding_and_advertising WHERE id = $1`,
    text: `UPDATE branding_and_advertising set active=false WHERE id = $1`,
    values: [advertisingId],
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
