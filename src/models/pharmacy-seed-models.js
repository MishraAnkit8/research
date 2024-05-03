const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.renderPharmacyData = async() => {

}

module.exports.insertInvestigatorEducationDetails = async(educationalDetails) => {
    console.log('data in service ====>>>>>', educationalDetails);

    const {education, university, passoutYear} = educationalDetails;

    let sql = {
        text : `INSERT INTO investigator_education (course_name, university_name, passout_year) values ($1, $2, $3) returning id`,
        values : [education, university, passoutYear]
    }
    console.log('sql ===>>>>', sql);

    const invetigatorEducationalDetails = await researchDbW.query(sql);
    const response = invetigatorEducationalDetails.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Inserted Successfully",
            investorEduId: invetigatorEducationalDetails.rows[0].id,
            rowCount: invetigatorEducationalDetails.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record insertion.",
            errorCode: error?.code
        };
    
    return response;

}