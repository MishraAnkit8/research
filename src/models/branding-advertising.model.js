const { autoriders_read_db, autoriders_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const autoDbR = dbPoolManager.get('autoDbR', autoriders_read_db);
const autoDbW = dbPoolManager.get('autoDbW', autoriders_write_db);

module.exports.fetchBrandingAndadvertising = async() => {
    let sql = {
        text : `SELECT * FROM branding_and_advertising ORDER BY id`
    }
    console.log('sql ==>>', sql);

    return autoDbR.query(sql);
}

module.exports.insertBrandingAndAdvertisingData = async(advertisingData, facultyRecognitionDocuments,
    facultyAwardDocuments, staffAwardDocuments, alumniAwardDocuments, studentAwardDocuments, internationalLinkageDocuments, conferenceParticipationDocuments, organisingConferenceDocuments,
    studentEventParticipationDocuments, newspaperArticleDocuments) => {
        const {facultyRecognition, facultyRecognitionLink, facultyAward, facultyAwardLink, staffAward, staffAwardLink, alumniAward, alumniAwardLink,
            studentAward, studentAwardLink, internationalLinkage, internationalLinkageLink, conferenceParticipation, conferenceParticipationLink, organisingConference,
            organisingConferenceLink, studentEventParticipation, studentEventParticipationLink, newspaperArticle, newspaperArticleLink} = advertisingData;
        let sql = {
            text : `INSERT INTO branding_and_advertising (
                 faculty_recognition, faculty_recognition_link, faculty_award, faculty_award_link, staff_award, staff_award_link, alumni_award, alumni_award_link,
                 student_award, student_award_link, international_linkage, international_linkage_link, conference_participation, conference_participation_link,
                 organising_conference, organising_conference_link, student_event_participation, student_event_participation_link, newspaper_article, newspaper_article_link, 
                 faculty_recognition_documents, faculty_award_documents, staff_award_documents, alumni_award_documents, student_award_documents, international_linkage_documents, 
                 conference_participation_documents, organising_conference_documents, student_event_participation_documents, newspaper_article_documents) 
                 VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27 , $28, $29, $30) RETURNING id`,
            values : [facultyRecognition, facultyRecognitionLink, facultyAward, facultyAwardLink, staffAward, staffAwardLink, alumniAward, alumniAwardLink,
                studentAward, studentAwardLink, internationalLinkage, internationalLinkageLink, conferenceParticipation, conferenceParticipationLink, organisingConference,
                organisingConferenceLink, studentEventParticipation, studentEventParticipationLink, newspaperArticle, newspaperArticleLink, facultyRecognitionDocuments,
                facultyAwardDocuments, staffAwardDocuments, alumniAwardDocuments, studentAwardDocuments, internationalLinkageDocuments, conferenceParticipationDocuments, organisingConferenceDocuments,
                studentEventParticipationDocuments, newspaperArticleDocuments]
        }
        console.log('sql ==>>', sql);
        return autoDbW.query(sql);

}

module.exports.updateBrandingAdvertising = async(advertisingId, updatedAdvertisingData, facultyRecognitionDocuments,
    facultyAwardDocuments, staffAwardDocuments, alumniAwardDocuments, studentAwardDocuments, internationalLinkageDocuments, conferenceParticipationDocuments, organisingConferenceDocuments,
    studentEventParticipationDocuments, newspaperArticleDocument) => {
        const {facultyRecognition, facultyRecognitionLink, facultyAward, facultyAwardLink, staffAward, staffAwardLink, alumniAward, alumniAwardLink,
            studentAward, studentAwardLink, internationalLinkage, internationalLinkageLink, conferenceParticipation, conferenceParticipationLink, organisingConference,
            organisingConferenceLink, studentEventParticipation, studentEventParticipationLink, newspaperArticle, newspaperArticleLink} = updatedAdvertisingData;
        
        let sql = {
            text : `UPDATE  branding_and_advertising SET 
                faculty_recognition = $2, faculty_recognition_link = $3, faculty_award = $4, faculty_award_link  = $5, staff_award = $6, staff_award_link = $7, alumni_award = $8, alumni_award_link = $9,
                student_award = $10, student_award_link = $11, international_linkage = $12, international_linkage_link = $13, conference_participation = $14, conference_participation_link = $15,
                organising_conference = $16, organising_conference_link = $17, student_event_participation = $18, student_event_participation_link = $19, newspaper_article = $20, newspaper_article_link = $21, 
                faculty_recognition_documents = $22, faculty_award_documents = $23, staff_award_documents = $24, alumni_award_documents = $25, student_award_documents = $26, international_linkage_documents = $27, 
                conference_participation_documents = $28, organising_conference_documents = $29, student_event_participation_documents = $30, newspaper_article_documents = $31 WHERE id = $1`,
            values : [advertisingId, facultyRecognition, facultyRecognitionLink, facultyAward, facultyAwardLink, staffAward, staffAwardLink, alumniAward, alumniAwardLink,
                studentAward, studentAwardLink, internationalLinkage, internationalLinkageLink, conferenceParticipation, conferenceParticipationLink, organisingConference,
                organisingConferenceLink, studentEventParticipation, studentEventParticipationLink, newspaperArticle, newspaperArticleLink, facultyRecognitionDocuments,
                facultyAwardDocuments, staffAwardDocuments, alumniAwardDocuments, studentAwardDocuments, internationalLinkageDocuments, conferenceParticipationDocuments, organisingConferenceDocuments,
                studentEventParticipationDocuments, newspaperArticleDocument]
        }
        console.log('sql ==>>', sql);
        return autoDbW.query(sql)

}

module.exports.brandingAndadvertisingview = async(advertisingId) => {
    let sql = {
        text : `SELECT * FROM branding_and_advertising WHERE id = $1`,
        values : [advertisingId]
    }
    console.log('sql ==>>', sql);
    return autoDbR.query(sql);
}

module.exports.brandingAndadvertisingDelete = async(advertisingId) => {
    let sql = {
        text : `DELETE  FROM branding_and_advertising WHERE id = $1`,
        values : [advertisingId]
    }
    
    return autoDbW.query(sql)
}