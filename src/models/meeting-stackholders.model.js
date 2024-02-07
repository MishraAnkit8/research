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

module.exports.insertMeetingStackholders = async(meetingStackholderData, meetingFilesData) => {
    const {ranking, rankingLink, accreditation, accreditationLink, achievements, achievementsLink, convocation, convocationLink, 
        inauguralProgram, inauguralProgramLink, events, eventsLink } = meetingStackholderData;
    let sql = {
        text : `INSERT INTO  meeting_stackholders (ranking, ranking_link, accreditation, accreditation_link, school_campus_achievements, 
            achievements_link, convocation, convocation_link, inaugural_program, inaugural_program_link, events, events_link, 
            ranking_documents, accreditation_documents, achievements_documents, convocation_documents, inaugural_program_documents, events_documents) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING id`,
        values : [ranking, rankingLink, accreditation, accreditationLink, achievements, achievementsLink, convocation, convocationLink, 
            inauguralProgram, inauguralProgramLink, events, eventsLink, meetingFilesData.rankingDocuments, meetingFilesData.accreditationFile, meetingFilesData.achievementsFile, meetingFilesData.convocationFile, meetingFilesData.inauguralProgramFile, meetingFilesData.eventFile]
    }
    console.log('sql ==>>', sql)
    return autoDbW.query(sql)
}

module.exports.updateMeetingData = async(meetingId, updateMeetingData, updatedMeetingFilesData) => {
    const {ranking, rankingLink, accreditation, accreditationLink, achievements, achievementsLink, convocation, convocationLink, 
        inauguralProgram, inauguralProgramLink, events, eventsLink} = updateMeetingData;
    
        const rankingDocuments = updatedMeetingFilesData.rankingDocuments ? updatedMeetingFilesData.rankingDocuments : null;
        const accreditationFile = updatedMeetingFilesData.accreditationFile ? updatedMeetingFilesData.accreditationFile : null;
        const achievementsFile = updatedMeetingFilesData.achievementsFile ? updatedMeetingFilesData.achievementsFile : null;
        const convocationFile = updatedMeetingFilesData.convocationFile ? updatedMeetingFilesData.convocationFile : null;
        const inauguralProgramFile = updatedMeetingFilesData.inauguralProgramFile ? updatedMeetingFilesData.inauguralProgramFile : null;
        const eventFile = updatedMeetingFilesData.eventFile ? updatedMeetingFilesData.eventFile : null;

        const filesArray = [
            rankingDocuments,
            accreditationFile,
            achievementsFile,
            convocationFile,
            inauguralProgramFile,
            eventFile
        ]
        console.log('filesArray ===>>>', filesArray);
        const meetingFieldToBeUpdated = [
            { field: 'ranking', value: ranking },
            { field: 'ranking_documents', value: rankingDocuments },
            { field: 'ranking_link', value: rankingLink },
            { field: 'accreditation', value: accreditation },
            { field: 'accreditation_documents', value: accreditationFile },
            { field: 'accreditation_link', value: accreditationLink },
            { field: 'school_campus_achievements', value: achievements },
            { field: 'achievements_documents', value: achievementsFile },
            { field: 'achievements_link', value: achievementsLink },
            { field: 'convocation', value: convocation },
            { field: 'convocation_documents', value: convocationFile },
            { field: 'convocation_link', value: convocationLink },
            { field: 'inaugural_program', value: inauguralProgram },
            { field: 'inaugural_program_documents', value: inauguralProgramFile },
            { field: 'inaugural_program_link', value: inauguralProgramLink },
            { field: 'events', value: events },
            { field: 'events_documents', value: eventFile },
            { field: 'events_link', value: eventsLink },
        ]

        console.log('meetingFieldToBeUpdated ===>>> :::', meetingFieldToBeUpdated);
        const setStatements = meetingFieldToBeUpdated
            .filter(fieldInfo => fieldInfo.value !== null)
            .map((fieldInfo, index) => {
                console.log('dataCondition ===>>>:::::', fieldInfo.value);
                console.log('index ==>>', index);
                console.log('condition == ==>>>::::', true);
                return { statement: `${fieldInfo.field} = $${index + 2}`, dataCondition: `${fieldInfo.value}` };
            });

        console.log('setStatements ==>>>', setStatements);

        const updateDocument = meetingFieldToBeUpdated.map(fieldInfo => {
            const condition = fieldInfo.value;
            if(condition){
                console.log('condition ==>>::::', condition)
                console.log(`Condition for ${fieldInfo.field}: ${condition}`);
            }
            else{
                return null
            }
            
            const value =  fieldInfo.value ;
            if(value){
                console.log(`Value for ${fieldInfo.field}: ${value}`);
                return value;
            }
        }).filter(value => value !== null);

        console.log('updateDocument ====::::>>>', updateDocument)
        

        const updateMeetingStackholdersData = [
            meetingId,
            ...updateDocument,
        ];

        console.log('updateMeetingStackholdersData ==>>>', updateMeetingStackholdersData);

        const setStatementString = setStatements.map((item, index) => {
            if (item.dataCondition !== 'null') {
            return `${item.statement}`;
            } else {
            return '';
            }
        }).filter(Boolean).join(', ');
        
        console.log('setStatementString ==>>>', setStatementString);
        
        const sql = {
            text: `UPDATE meeting_stackholders SET ${setStatementString} WHERE id = $1`,
            values: updateMeetingStackholdersData,
        };

        console.log('sql ==>>', sql);
        return autoDbW.query(sql);

}

module.exports.viewMeeting = async(meetingId) => {
    console.log('meetingId in models  ===>', meetingId)
    let sql = {
        text : `SELECT * FROM meeting_stackholders WHERE id = $1`,
        values : [meetingId]
    }
    console.log('sql ==>>', sql);
    return autoDbR.query(sql)
}

module.exports.deleteMeetingStackholders = async(meetingId) => {
    let sql = {
        text : `DELETE FROM  meeting_stackholders WHERE id = $1`,
        values : [meetingId]
    }
    console.log('sql ==>>', sql)
    return autoDbW.query(sql)
}