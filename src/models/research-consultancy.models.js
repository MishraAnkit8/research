const { autoriders_read_db, autoriders_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const autoDbR = dbPoolManager.get('autoDbR', autoriders_read_db);
const autoDbW = dbPoolManager.get('autoDbW', autoriders_write_db);

module.exports.fetchResearchConsultancy = async() => {
    let sql = {
        text : `SELECT * FROM research_project_consultancy`,
    }
    return autoDbR.query(sql);
}

module.exports.insertResearhcProjectConstancyData = async(researchCunsultancyData, filename) => {
    const {titleOfProject, grantProposalCategory, typeOfGrant, thurstAreaOfResearch, fundingAgency, fundingAmount, statusOfResearchProject,
          submission_grant_date, facultyType} = researchCunsultancyData
    let sql = {
        text : `INSERT INTO research_project_consultancy( title_of_project, grant_proposal_category, type_of_grant,  thrust_area_of_research, name_of_funding_agency,
               funding_amount, status_of_research_project, submission_grant_date, faculty_type, supporting_documents) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        values : [titleOfProject, grantProposalCategory, typeOfGrant, thurstAreaOfResearch, fundingAgency, fundingAmount, statusOfResearchProject,
                 submission_grant_date, facultyType, filename]
    }

    return autoDbW.query(sql)
}