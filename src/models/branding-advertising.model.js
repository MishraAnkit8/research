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

module.exports.insertBrandingAndAdvertisingData = async(advertisingData, brandingFilesContainer) => {
        const {facultyRecognition, facultyRecognitionLink, facultyAward, facultyAwardLink, staffAward, staffAwardLink, alumniAward, alumniAwardLink,
            studentAward, studentAwardLink, internationalLinkage, internationalLinkageLink, conferenceParticipation, conferenceParticipationLink, organisingConference,
            organisingConferenceLink, studentEventParticipation, studentEventParticipationLink, newsPaperArticle, newsPaperArticleLink } = advertisingData;
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
                organisingConferenceLink, studentEventParticipation, studentEventParticipationLink, newsPaperArticle, newsPaperArticleLink, brandingFilesContainer.facultyRecognitionDocuments,
                brandingFilesContainer.facultyAwardDocuments, brandingFilesContainer.staffAwardDocuments, brandingFilesContainer.alumniAwardDocuments, brandingFilesContainer.studentAwardDocuments, brandingFilesContainer.internationalLinkageDocuments, brandingFilesContainer.conferenceParticipationDocuments, brandingFilesContainer.organisingConferenceDocuments,
                brandingFilesContainer.studentEventParticipationDocuments, brandingFilesContainer.newspaperArticleDocuments]
        }
        console.log('sql ==>>', sql);
        return autoDbW.query(sql);

}

module.exports.updateBrandingAdvertising = async (advertisingId, updatedAdvertisingData, updatedBrandingFilesData) => {
    console.log('updatedBrandingFilesData in models ==>>', updatedBrandingFilesData);
    const {
        facultyRecognition, facultyRecognitionLink, facultyAward, facultyAwardLink,
        staffAward, staffAwardLink, alumniAward, alumniAwardLink,
        studentAward, studentAwardLink, internationalLinkage, internationalLinkageLink,
        conferenceParticipation, conferenceParticipationLink, organisingConference,
        organisingConferenceLink, studentEventParticipation, studentEventParticipationLink,
        newsPaperArticle, newsPaperArticleLink
    } = updatedAdvertisingData;

    console.log('updatedBrandingFilesData.facultyRecognitionDocuments  ==>>>', updatedBrandingFilesData.facultyRecognitionDocuments);

    const facultyRecognitionDocuments = updatedBrandingFilesData.facultyRecognitionDocuments ? updatedBrandingFilesData.facultyRecognitionDocuments : null;
    const facultyAwardDocuments = updatedBrandingFilesData.facultyAwardDocuments ? updatedBrandingFilesData.facultyAwardDocuments : null;
    const staffAwardDocuments = updatedBrandingFilesData.staffAwardDocuments ? updatedBrandingFilesData.staffAwardDocuments : null;
    const alumniAwardDocuments = updatedBrandingFilesData.alumniAwardDocuments ? updatedBrandingFilesData.alumniAwardDocuments : null;
    const studentAwardDocuments = updatedBrandingFilesData.studentAwardDocuments ? updatedBrandingFilesData.studentAwardDocuments : null;
    const internationalLinkageDocuments = updatedBrandingFilesData.internationalLinkageDocuments ? updatedBrandingFilesData.internationalLinkageDocuments : null;
    const conferenceParticipationDocuments = updatedBrandingFilesData.conferenceParticipationDocuments ? updatedBrandingFilesData.conferenceParticipationDocuments : null;
    const organisingConferenceDocuments = updatedBrandingFilesData.organisingConferenceDocuments ? updatedBrandingFilesData.organisingConferenceDocuments : null;
    const studentEventParticipationDocuments = updatedBrandingFilesData.studentEventParticipationDocuments ? updatedBrandingFilesData.studentEventParticipationDocuments : null;
    const newspaperArticleDocuments = updatedBrandingFilesData.newspaperArticleDocuments ? updatedBrandingFilesData.newspaperArticleDocuments : null;
    console.log('newspaperArticleDocuments ==>>', newspaperArticleDocuments)
    const filesArray = [
        facultyRecognitionDocuments,
        facultyAwardDocuments,
        staffAwardDocuments,
        alumniAwardDocuments,
        studentAwardDocuments,
        internationalLinkageDocuments,
        conferenceParticipationDocuments,
        organisingConferenceDocuments,
        studentEventParticipationDocuments,
        newspaperArticleDocuments
    ];

    console.log('newspaperArticleDocuments ==>>', filesArray)

    const fieldsToUpdate = [
        { field: 'faculty_recognition', value: facultyRecognition },
        { field: 'faculty_recognition_documents', value: facultyRecognitionDocuments },
        { field: 'faculty_recognition_link', value: facultyRecognitionLink },
        { field: 'faculty_award', value: facultyAward },
        { field: 'faculty_award_link', value: facultyAwardLink },
        { field: 'faculty_award_documents', value: facultyAwardDocuments },
        { field: 'staff_award', value: staffAward },
        { field: 'staff_award_documents', value: staffAwardDocuments },
        { field: 'staff_award_link', value: staffAwardLink },
        { field: 'alumni_award', value: alumniAward },
        { field: 'alumni_award_documents', value: alumniAwardDocuments },
        { field: 'alumni_award_link', value: alumniAwardLink },
        { field: 'student_award', value: studentAward },
        { field: 'student_award_link', value: studentAwardLink },
        { field: 'student_award_documents', value: studentAwardDocuments },
        { field: 'international_linkage', value: internationalLinkage },
        { field: 'international_linkage_link', value: internationalLinkageLink },
        { field: 'international_linkage_documents', value: internationalLinkageDocuments },
        { field: 'conference_participation', value: conferenceParticipation },
        { field: 'conference_participation_documents', value: conferenceParticipationDocuments },
        { field: 'conference_participation_link', value: conferenceParticipationLink },
        { field: 'organising_conference', value: organisingConference },
        { field: 'organising_conference_documents', value: organisingConferenceDocuments },
        { field: 'organising_conference_link', value: organisingConferenceLink },
        { field: 'student_event_participation', value: studentEventParticipation },
        { field: 'student_event_participation_documents', value: studentEventParticipationDocuments },
        { field: 'student_event_participation_link', value: studentEventParticipationLink },
        { field: 'newspaper_article', value: newsPaperArticle },
        { field: 'newspaper_article_documents', value: newspaperArticleDocuments },
        { field: 'newspaper_article_link', value: newsPaperArticleLink },
    ];

    console.log('fieldsToUpdate ===>>', fieldsToUpdate);

    const setStatements = fieldsToUpdate
        .filter(fieldInfo => fieldInfo.value !== null) // Filter where value is null
        .map((fieldInfo, index) => {
            console.log('dataCondition ===>>>:::::', fieldInfo.value);
            console.log('index ==>>', index);
            console.log('condition == ==>>>::::', true); //  filter ensures value is not null
            return { statement: `${fieldInfo.field} = $${index + 2}`, dataCondition: `${fieldInfo.value}` };
        });

    console.log('setStatements ==>>>', setStatements);
    
    //checking if any field emty then it should then make them null     
    const updateDocument = fieldsToUpdate.map(fieldInfo => {
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
    

    const updatedAdvertisingValues = [
        advertisingId,
        ...updateDocument,
    ];

    console.log('updatedAdvertisingValues ==>>>', updatedAdvertisingValues);

    // const setStatementString = setStatements.map(item => item.statement).join(',');
    // console.log('setStatementString ==>>>', setStatementString)
    const setStatementString = setStatements.map((item, index) => {
        if (item.dataCondition !== 'null') {
          return `${item.statement}`;
        } else {
          return '';
        }
      }).filter(Boolean).join(', ');
      
      console.log('setStatementString ==>>>', setStatementString);


    const placeholders = Array.from({ length: updateDocument.length }, (_, i) => `$${i + 2}`).join(',');
    
    const sql = {
        text: `UPDATE branding_and_advertising SET ${setStatementString} WHERE id = $1`,
        values: updatedAdvertisingValues,
    };

    console.log('sql ==>>', sql);
    return autoDbW.query(sql);
};




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
        text : `DELETE FROM branding_and_advertising WHERE id = $1`,
        values : [advertisingId]
    }
    console.log('sql ==>>', sql)
    return autoDbW.query(sql);
}