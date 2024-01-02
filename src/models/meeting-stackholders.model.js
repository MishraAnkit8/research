const { autoriders_read_db, autoriders_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const autoDbR = dbPoolManager.get('autoDbR', autoriders_read_db);
const autoDbW = dbPoolManager.get('autoDbW', autoriders_write_db);

module.exports.fetchMeetingStackholdersData = async() => {
    let sql = {
        text : `SELECT * FROM meeting_stackholders ORDER BY id`
    }
    console.log('sql ==>>', sql);
    return autoDbR.query(sql);
}

module.exports.insertMeetingStackholders = async(meetingStackholderData, rankingDocuments, accreditationFile, achievementsFile, convocationFile, inauguralProgramFile, eventFile) => {
    const {ranking, rankingLink, accreditation, accreditationLink, achievements, achievementsLink, convocation, convocationLink, 
        inauguralProgram, inauguralProgramLink, events, eventsLink } = meetingStackholderData;
    let sql = {
        text : `INSERT INTO  meeting_stackholders (ranking, ranking_link, accreditation, accreditation_link, school_campus_achievements, 
            achievements_link, convocation, convocation_link, inaugural_program, inaugural_program_link, events, events_link, 
            ranking_documents, accreditation_documents, achievements_documents, convocation_documents, inaugural_program_documents, events_documents) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING id`,
        values : [ranking, rankingLink, accreditation, accreditationLink, achievements, achievementsLink, convocation, convocationLink, 
            inauguralProgram, inauguralProgramLink, events, eventsLink, rankingDocuments, accreditationFile, achievementsFile, convocationFile, inauguralProgramFile, eventFile]
    }
    console.log('sql ==>>', sql)
    return autoDbW.query(sql)
}

module.exports.updateMeetingData = async(meetingId, updateMeetingData, rankingDocuments, accreditationFile, achievementsFile, convocationFile, inauguralProgramFile, eventFile) => {
    const {ranking, rankingLink, accreditation, accreditationLink, achievements, achievementsLink, convocation, convocationLink, 
        inauguralProgram, inauguralProgramLink, events, eventsLink} = updateMeetingData;
    let sql = {
        text : `UPDATE  meeting_stackholders SET 
            ranking = $2, ranking_link = $3, accreditation = $4, accreditation_link = $5, school_campus_achievements = $6, 
            achievements_link = $7, convocation = $8, convocation_link =$9, inaugural_program = $10, inaugural_program_link = $11, events = $12, events_link = $13, 
            ranking_documents = $14, accreditation_documents = $15, achievements_documents = $16, convocation_documents = $17, inaugural_program_documents = $18, events_documents = $19
            WHERE id = $1`,
        values : [meetingId, ranking, rankingLink, accreditation, accreditationLink, achievements, achievementsLink, convocation, convocationLink, 
            inauguralProgram, inauguralProgramLink, events, eventsLink, rankingDocuments, accreditationFile, achievementsFile, convocationFile, inauguralProgramFile, eventFile]
    }
    console.log('sql ==>>', sql);
    return autoDbW.query(sql);
}