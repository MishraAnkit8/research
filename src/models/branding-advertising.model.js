const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchBrandingAndadvertising = async() => {
    let sql = {
        text : `SELECT * FROM branding_and_advertising ORDER BY id`
    }
    console.log('sql ==>>', sql);

    return researchDbR.query(sql);
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

        //handle promise and throw error in case of Insert
        return researchDbW.query(sql)
        .then(result => {
            console.log('sql ===>>>', sql);
            return {
                status: 'Done',
                message: "Record Inserted Successfully",
                rowCount: result.rowCount,
                advertisingId : result.rows[0].id
            };
        })
        .catch(error => {
            console.log('error.code ====>>>', error.code);
            console.log('error.constraint ====>>>>>', error.constraint);
            console.log('error.message ====>>>', error.message);
            return {
                status: 'Failed',
                message: error.message,
                errorCode: error.code
            };
        });
}

module.exports.updateBrandingAdvertising = async (advertisingId, updatedAdvertisingData, updatedFacultyRecognitionFilesArray,
    updatedFacultyAwardFilesArray, updatedStaffAwardFilesArray, updatedAlumniAwardFilesArray, updatedStudentAwardFilesArray,
    updatedInternationalLinkageFilesArray, updatedConferenceParticipationFilesArray, updatedOrganisingConferenceFilesArray,
    updatedStudentEventParticipationFilesArray, updatedNewspaperArticleFilesArray) => {
    const {
        facultyRecognition, facultyRecognitionLink, facultyAward, facultyAwardLink,
        staffAward, staffAwardLink, alumniAward, alumniAwardLink,
        studentAward, studentAwardLink, internationalLinkage, internationalLinkageLink,
        conferenceParticipation, conferenceParticipationLink, organisingConference,
        organisingConferenceLink, studentEventParticipation, studentEventParticipationLink,
        newsPaperArticle, newsPaperArticleLink
    } = updatedAdvertisingData;
   
    const filesArray = [
      updatedFacultyRecognitionFilesArray,
      updatedFacultyAwardFilesArray, updatedStaffAwardFilesArray, updatedAlumniAwardFilesArray, updatedStudentAwardFilesArray,
      updatedInternationalLinkageFilesArray, updatedConferenceParticipationFilesArray, updatedOrganisingConferenceFilesArray,
      updatedStudentEventParticipationFilesArray, updatedNewspaperArticleFilesArray
    ];

    console.log('filesArray ==>>', filesArray)

    const fieldsToUpdate = [
        { field: 'faculty_recognition', value: facultyRecognition },
        { field: 'faculty_recognition_documents', value: updatedFacultyRecognitionFilesArray },
        { field: 'faculty_recognition_link', value: facultyRecognitionLink },
        { field: 'faculty_award', value: facultyAward },
        { field: 'faculty_award_link', value: facultyAwardLink },
        { field: 'faculty_award_documents', value: updatedFacultyAwardFilesArray },
        { field: 'staff_award', value: staffAward },
        { field: 'staff_award_documents', value: updatedStaffAwardFilesArray },
        { field: 'staff_award_link', value: staffAwardLink },
        { field: 'alumni_award', value: alumniAward },
        { field: 'alumni_award_documents', value: updatedAlumniAwardFilesArray },
        { field: 'alumni_award_link', value: alumniAwardLink },
        { field: 'student_award', value: studentAward },
        { field: 'student_award_link', value: studentAwardLink },
        { field: 'student_award_documents', value: updatedStudentAwardFilesArray },
        { field: 'international_linkage', value: internationalLinkage },
        { field: 'international_linkage_link', value: internationalLinkageLink },
        { field: 'international_linkage_documents', value: updatedInternationalLinkageFilesArray },
        { field: 'conference_participation', value: conferenceParticipation },
        { field: 'conference_participation_documents', value: updatedConferenceParticipationFilesArray },
        { field: 'conference_participation_link', value: conferenceParticipationLink },
        { field: 'organising_conference', value: organisingConference },
        { field: 'organising_conference_documents', value: updatedOrganisingConferenceFilesArray },
        { field: 'organising_conference_link', value: organisingConferenceLink },
        { field: 'student_event_participation', value: studentEventParticipation },
        { field: 'student_event_participation_documents', value: updatedStudentAwardFilesArray },
        { field: 'student_event_participation_link', value: studentEventParticipationLink },
        { field: 'newspaper_article', value: newsPaperArticle },
        { field: 'newspaper_article_documents', value: updatedNewspaperArticleFilesArray },
        { field: 'newspaper_article_link', value: newsPaperArticleLink },
    ];

    console.log('fieldsToUpdate ===>>', fieldsToUpdate);

    const setStatements = fieldsToUpdate
        .filter(fieldInfo => fieldInfo.value !== null && fieldInfo.value !== undefined) // Filter where value is null
        .map((fieldInfo, index) => {
            console.log('dataCondition ===>>>:::::', fieldInfo.value);
            console.log('index ==>>', index);
            console.log('fieldInfo.field ===>>>', fieldInfo.field)
            console.log('condition == ==>>>::::', true); //  filter ensures value is not null
            return { statement: `${fieldInfo.field} = $${index + 2}`, dataCondition: `${fieldInfo.value}` };
        });

    console.log('setStatements ==>>>', setStatements);
    
    //checking if any field emty then it should then make them null     
    // const advertisingDataToBeUpdate = fieldsToUpdate.map(fieldInfo => {
    //     const condition = fieldInfo.value;
    //     if(condition){
    //         console.log('condition ==>>::::', condition)
    //         console.log(`Condition for ${fieldInfo.field}: ${condition}`);
    //     }
    //     else{
    //         return null
    //     }
        
    //     const value =  fieldInfo.value ;
    //     if(value){
    //         console.log(`Value for ${fieldInfo.field}: ${value}`);
    //         return value;
    //     }
    // }).filter(value => value !== null);
    const advertisingDataToBeUpdate = fieldsToUpdate.map(fieldInfo => {
        const value =  fieldInfo.value;
        console.log('condition value ===>>>', value);
         return  value && value !== undefined ? value  : null
    // })
    }).filter(value => value !== null);

    console.log('advertisingDataToBeUpdate ====::::>>>', advertisingDataToBeUpdate);

    //destructuring array
    const advertisingValuesToBeUpdate = [
        advertisingId,
        ...advertisingDataToBeUpdate,
    ];

    console.log('advertisingValuesToBeUpdate ==>>>', advertisingValuesToBeUpdate);
    const setStatementString = setStatements.map((item , index) => {
        console.log('item.dataCondition ===>>>', item.dataCondition);
       return item.dataCondition !== 'null' ?  `${item.statement}` :  ''
    }).filter(Boolean).join(', ')

    console.log('setStatementString ==>>>', setStatementString);

    // const placeholders = Array.from({ length: advertisingDataToBeUpdate.length }, (_, i) => `$${i + 2}`).join(',');
    // console.log('placeholders ===>>>>', placeholders)

    const sql = {
        text: `UPDATE branding_and_advertising SET ${setStatementString} WHERE id = $1`,
        values: advertisingValuesToBeUpdate,
    };
    
    //handle promise and throw error in case of Update 
    return researchDbW.query(sql)
    .then(result => {
        console.log('sql ===>>>', sql);
        return {
            status: 'Done',
            message: "Record Updated Successfully",
            rowCount: result.rowCount
        };
    })
    .catch(error => {
        console.log('error.code ====>>>', error.code);
        console.log('error.constraint ====>>>>>', error.constraint);
        console.log('error.message ====>>>', error.message);
        const message = error.code === '23505' ? 'Doi Id Of Book should Uniq' : error.message;
        console.log('message =====>>>>>>', message);
        return {
            status: 'Failed',
            message: message,
            errorCode: error.code
        };
    });
};




module.exports.brandingAndadvertisingview = async(advertisingId) => {
    let sql = {
        text : `SELECT * FROM branding_and_advertising WHERE id = $1`,
        values : [advertisingId]
    }
    console.log('sql ==>>', sql);
    return researchDbR.query(sql);
}

module.exports.brandingAndadvertisingDelete = async(advertisingId) => {
    let sql = {
        text : `DELETE FROM branding_and_advertising WHERE id = $1`,
        values : [advertisingId]
    }
    console.log('sql ==>>', sql);
    return new Promise((resolve, reject) => {
        researchDbW.query(sql)
          .then(result => {
            resolve({ status : "Done", message : "Record Insertd Successfully", rowCount : result.rowCount, id : result.rows[0] });
          })
          .catch(error => {
            console.error('Error on update:', error.code, error.message);
            console.log('error.message ====>>>>>', error.message);
            const message = error.code === '23505' ? "DOI ID Of Book Chapter Should Be Unique" : error.message;
            reject({ status: 'Failed', message : message, errorCode : error.code});
          });
      });
}