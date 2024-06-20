const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

const insertDbModels = require('./insert-update-records.models');

module.exports.fetchResearchAward = async(userName) => {
    let sql = {
        text : `SELECT * FROM research_award WHERE created_by = $1 and active=true ORDER BY id desc`,
        values : [userName]
    }
    console.log('sql ===>>>>>', sql);

    return researchDbR.query(sql);
}


module.exports.insertResearchAwardRow = async(awardFiles, researchAwardData, userName) => {

    const {campus, school, facultyName, awardName, awardDetails, organisationName, awardDate, awardPlace, awardCategory} = researchAwardData;

    const awardAvlues = [campus, school, facultyName, awardName, awardDetails, organisationName, awardDate, awardPlace, awardCategory, awardFiles, userName];
    const awardField = ['nmims_campus', 'nmims_school', 'faculty_name', 'award_name', 'award_details', 'organisation_name_coferring_award', 'date',
        'place', 'award_category', 'supporting_documents', 'created_by']

    const insertResearchAward = await insertDbModels.insertRecordIntoMainDb('research_award', awardField, awardAvlues, userName);
    console.log('insertResearchAward ===>>>>>>', insertResearchAward);

    return insertResearchAward.status === "Done" ? {
        status : insertResearchAward.status,
        message : insertResearchAward.message
    } : {
        status : insertResearchAward.status,
        message : insertResearchAward.message,
        errorCode : insertResearchAward.errorCode
    }

}

module.exports.updatedResearchRowData = async(awardId, updatedReseachAwardDocuments, updatedAwardData, userName) => {{
    const {campus, school, facultyName, awardName, awardDetails, organisationName, awardDate, awardPlace, awardCategory} = updatedAwardData;
    let updateResearchAward;

    if(updatedReseachAwardDocuments){
        const awardAvlues = [campus, school, facultyName, awardName, awardDetails, organisationName, awardDate, awardPlace, awardCategory, updatedReseachAwardDocuments, userName, awardId];
        const awardField = ['nmims_campus', 'nmims_school', 'faculty_name', 'award_name', 'award_details', 'organisation_name_coferring_award', 'date',
            'place', 'award_category', 'supporting_documents', 'updated_by']
    
        updateResearchAward = await insertDbModels.updateFieldWithFiles('research_award', awardField, awardAvlues, userName);
       
    } 
    else{
        const awardAvlues = [campus, school, facultyName, awardName, awardDetails, organisationName, awardDate, awardPlace, awardCategory, userName, awardId];
        const awardField = ['nmims_campus', 'nmims_school', 'faculty_name', 'award_name', 'award_details', 'organisation_name_coferring_award', 'date',
            'place', 'award_category', 'updated_by']
    
        updateResearchAward = await insertDbModels.updateFieldWithOutFiles('research_award', awardField, awardAvlues, userName);
        
    }

    console.log('updateResearchAward ===>>>>>>', updateResearchAward);
   

    return updateResearchAward.status === "Done" ? {
        status : updateResearchAward.status,
        message : updateResearchAward.message
    } : {
        status : updateResearchAward.status,
        message : updateResearchAward.message,
        errorCode : updateResearchAward.errorCode
    }

}}


module.exports.deleteResearchawardRow = async(awardId) => {
    let sql = {
      // text : `DELETE FROM research_award WHERE id = $1`,
      text: `update research_award set active=false WHERE id = $1`,
      values: [awardId],
    };

    console.log('sql ===>>>>', sql);
    const researchAward = await researchDbW.query(sql);
    const response = researchAward.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Deleted Successfully",
            rowCount: researchAward.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record updation.",
            errorCode: error?.code
        };
    
    return response;
}

module.exports.veiwResearchAwardRow = async (awardId, userName) => {
    let sql = {
        text : `SELECT  nmims_campus, nmims_school, faculty_name, award_name, award_details, organisation_name_coferring_award, TO_CHAR(date, 'DD-MM-YYYY') as date,
        place, award_category, supporting_documents FROM research_award WHERE id = $1 AND created_by = $2 and active=true `,
        values : [awardId, userName]
    }
    console.log('sql ===>>>', awardId)
    const researchAward = await researchDbW.query(sql);
    const response = researchAward.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Fetched Successfully",
            rowCount: researchAward.rowCount,
            veiwResearchAwardRow : researchAward.rows
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record fetching.",
            errorCode: error?.code
        };
    
    return response;
}