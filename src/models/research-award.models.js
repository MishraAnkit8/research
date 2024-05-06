const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchResearchAward = async(userName) => {
    let sql = {
        text : `SELECT * FROM research_award WHERE created_by = $1 and active=true ORDER BY id desc`,
        values : [userName]
    }
    console.log('sql ===>>>>>', sql);

    return researchDbW.query(sql);
}


module.exports.insertResearchAwardRow = async(awardFiles, researchAwardData, userName) => {

    const {campus, school, facultyName, awardName, awardDetails, organisationName, awardDate, awardPlace, awardCategory} = researchAwardData;

    let sql = {
        text : `INSERT INTO research_award(nmims_campus, nmims_school, faculty_name, award_name, award_details, organisation_name_coferring_award, date,
            place, award_category, supporting_documents, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8 , $9, $10, $11) RETURNING id`,
        values : [campus, school, facultyName, awardName, awardDetails, organisationName, awardDate, awardPlace, awardCategory, awardFiles, userName]
    }

    console.log('sql ===>>>>', sql);

    const researchAward = await researchDbW.query(sql);
    const response = researchAward.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Inserted Successfully",
            awardId: researchAward.rows[0].id,
            rowCount: researchAward.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record insertion.",
            errorCode: error?.code
        };
    
    return response;

}

module.exports.updatedResearchRowData = async(awardId, updatedReseachAwardDocuments, updatedAwardData, userName) => {{

    const {campus, school, facultyName, awardName, awardDetails, organisationName, awardDate, awardPlace, awardCategory} = updatedAwardData;
    let baseQuery = `UPDATE research_award  SET nmims_campus = $2, nmims_school = $3, faculty_name = $4, award_name = $5, award_details = $6, organisation_name_coferring_award = $7, date = $8,
    place = $9, award_category = $10, updated_by = $11`;

    let supportingDocQuery = updatedReseachAwardDocuments ?  `, supporting_documents = $12` : '';
    let values = [awardId, campus, school, facultyName, awardName, awardDetails, organisationName, awardDate, awardPlace, awardCategory, userName, ...(updatedReseachAwardDocuments ? [updatedReseachAwardDocuments] : [])];

    let textQuery = baseQuery + supportingDocQuery + ` WHERE id = $1`;

    let sql = {
        text : textQuery,
        values : values  
    }

    console.log('sql ===>>>>', sql);
    const researchAward = await researchDbW.query(sql);
    const response = researchAward.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Updated Successfully",
            rowCount: researchAward.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record updation.",
            errorCode: error?.code
        };
    
    return response;

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