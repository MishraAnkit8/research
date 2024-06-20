const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

const insertDbModels = require('./insert-update-records.models');

module.exports.fetchMeetingStackholdersData = async(userName) => {
    let sql = {
        text : `SELECT * FROM meeting_stackholders WHERE created_by = $1 and active=true ORDER BY id desc`,
        values : [userName]
    }
    console.log('sql ==>>', sql);
    return researchDbR.query(sql);
}

module.exports.insertMeetingStackholders = async(meetingStackholderData, meetingFilesData, userName) => {

    const {ranking, rankingLink, accreditation, accreditationLink, achievements, achievementsLink, convocation, convocationLink, 
        inauguralProgram, inauguralProgramLink, events, eventsLink } = meetingStackholderData;

    const meetingStackholderValues = [ranking, rankingLink, accreditation, accreditationLink, achievements, achievementsLink, convocation, convocationLink, 
        inauguralProgram, inauguralProgramLink, events, eventsLink, meetingFilesData.rankingDocuments, meetingFilesData.accreditationFile, meetingFilesData.achievementsFile,
         meetingFilesData.convocationFile, meetingFilesData.inauguralProgramFile, meetingFilesData.eventFile, userName];
    
    const meetingStackholderFields = [
        'ranking', 'ranking_link', 'accreditation', 'accreditation_link', 'school_campus_achievements', 
            'achievements_link', 'convocation', 'convocation_link', 'inaugural_program', 'inaugural_program_link', 'events', 'events_link', 
            'ranking_documents', 'accreditation_documents', 'achievements_documents', 'convocation_documents', 'inaugural_program_documents', 'events_documents', 'created_by'];

    const insertMeetingStackholders = await insertDbModels.insertRecordIntoMainDb('meeting_stackholders', meetingStackholderFields, meetingStackholderValues, userName);

    return insertMeetingStackholders.status === "Done" ? {
        status : insertMeetingStackholders.status,
        message : insertMeetingStackholders.message
        } : {
        status : insertMeetingStackholders.status,
        message : insertMeetingStackholders.message,
        errorCode : insertMeetingStackholders.errorCode
        }

}

module.exports.updateMeetingData = async(meetingId, updateMeetingData, updatedMeetingFilesData, userName) => {
    const {ranking, rankingLink, accreditation, accreditationLink, achievements, achievementsLink, convocation, convocationLink, 
        inauguralProgram, inauguralProgramLink, events, eventsLink } = updateMeetingData;

        const meetingStackholderValues = [ranking, rankingLink, accreditation, accreditationLink, achievements, achievementsLink, convocation, convocationLink, 
            inauguralProgram, inauguralProgramLink, events, eventsLink, updatedMeetingFilesData.rankingDocuments, updatedMeetingFilesData.accreditationFile, updatedMeetingFilesData.achievementsFile,
            updatedMeetingFilesData.convocationFile, updatedMeetingFilesData.inauguralProgramFile, updatedMeetingFilesData.eventFile, userName, meetingId];

        const meetingStackholderFields = [
                'ranking', 'ranking_link', 'accreditation', 'accreditation_link', 'school_campus_achievements', 
                'achievements_link', 'convocation', 'convocation_link', 'inaugural_program', 'inaugural_program_link', 'events', 'events_link', 
                'ranking_documents', 'accreditation_documents', 'achievements_documents', 'convocation_documents', 'inaugural_program_documents', 'events_documents', 'updated_by'];

        const updateMeetingStackholders = await insertDbModels.updateFieldWithSomeFilesOrNotFiles('meeting_stackholders', meetingStackholderFields, meetingStackholderValues, userName);

        console.log('updateMeetingStackholders =====>>>>>>>', updateMeetingStackholders);

        return updateMeetingStackholders.status === "Done" ? {
            status : updateMeetingStackholders.status,
            message : updateMeetingStackholders.message
            } : {
            status : updateMeetingStackholders.status,
            message : updateMeetingStackholders.message,
            errorCode : updateMeetingStackholders.errorCode
            }
}

module.exports.viewMeeting = async(meetingId, userName) => {
    console.log('meetingId in models  ===>', meetingId)
    let sql = {
        text : `SELECT * FROM meeting_stackholders WHERE id = $1 AND active=true and created_by = $2`,
        values : [meetingId, userName]
    }
    console.log('sql ==>>', sql);
    return researchDbR.query(sql)
}

module.exports.deleteMeetingStackholders = async(meetingId) => {
    let sql = {
      // text : `DELETE FROM  meeting_stackholders WHERE id = $1`,
      text: `update meeting_stackholders set active=false WHERE id = $1`,
      values: [meetingId],
    };
    console.log('sql ===>>>', sql)
    const deletedRecord = await researchDbW.query(sql);
    const promises = [deletedRecord];
    return Promise.all(promises).then(([deletedRecord]) => {
        return  { status : "Done" , message : "Record Deleted Successfully", rowCount : deletedRecord.rowCount}
    })
    .catch((error) => {
        return{status : "Failed" , message : error.message , errorCode : error.code}
    })
}