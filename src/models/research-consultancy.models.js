const { autoriders_read_db, autoriders_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const autoDbR = dbPoolManager.get('autoDbR', autoriders_read_db);
const autoDbW = dbPoolManager.get('autoDbW', autoriders_write_db);

module.exports.fetchResearchConsultancy = async() => {
    let sql = {
        text : `SELECT * FROM research_project_consultancy ORDER BY id`,
    }
    return autoDbR.query(sql);
}

module.exports.insertResearhcProjectConstancyData = async(researchCunsultancyData, consultancyDataFiles) => {
    const {titleOfProject, grantProposalCategory, typeOfGrant, thurstAreaOfResearch, fundingAgency, fundingAmount, statusOfResearchProject,
        submissionGrantDate, facultyType} = researchCunsultancyData
    let sql = {
        text : `INSERT INTO research_project_consultancy(title_of_project, grant_proposal_category, type_of_grant,  thrust_area_of_research, name_of_funding_agency,
               funding_amount, status_of_research_project, submission_grant_date, faculty_type, supporting_documents) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        values : [titleOfProject, grantProposalCategory, typeOfGrant, thurstAreaOfResearch, fundingAgency, fundingAmount, statusOfResearchProject,
            submissionGrantDate, facultyType, consultancyDataFiles]
    }

    return autoDbW.query(sql)
}

module.exports.updateResearchConsultantData = async(consultantId, updatedConsultant, updatedConsultantFilesData) => {
    if(updatedConsultantFilesData){
        const {titleOfProject, grantProposalCategory, typeOfGrant, thurstAreaOfResearch, fundingAgency, fundingAmount, statusOfResearchProject,
            submissionGrantDate, facultyType} = updatedConsultant;
        let sql = {
            text : `UPDATE research_project_consultancy SET title_of_project = $2, grant_proposal_category = $3, type_of_grant = $4,  thrust_area_of_research = $5, name_of_funding_agency = $6,
            funding_amount = $7, status_of_research_project = $8, submission_grant_date = $9, faculty_type = $10, supporting_documents = $11 WHERE id = $1 `,
            values : [consultantId, titleOfProject, grantProposalCategory, typeOfGrant, thurstAreaOfResearch, fundingAgency, fundingAmount, statusOfResearchProject,
                submissionGrantDate, facultyType, updatedConsultantFilesData]
        }
        return autoDbW.query(sql)

    }
    else{
        const {titleOfProject, grantProposalCategory, typeOfGrant, thurstAreaOfResearch, fundingAgency, fundingAmount, statusOfResearchProject,
            submissionGrantDate, facultyType} = updatedConsultant;
        let sql = {
            text : `UPDATE research_project_consultancy SET title_of_project = $2, grant_proposal_category = $3, type_of_grant = $4,  thrust_area_of_research = $5, name_of_funding_agency = $6,
            funding_amount = $7, status_of_research_project = $8, submission_grant_date = $9, faculty_type = $10 WHERE id = $1 `,
            values : [consultantId, titleOfProject, grantProposalCategory, typeOfGrant, thurstAreaOfResearch, fundingAgency, fundingAmount, statusOfResearchProject,
                submissionGrantDate, facultyType]
        }
        return autoDbW.query(sql)
    }
   
}

module.exports.deleteResearchConsultantData = async(consultantId) => {
    console.log('id in model ==>>', consultantId);
    let sql = {
        text : `DELETE FROM research_project_consultancy WHERE id = $1`,
        values : [consultantId]
    }
    return autoDbW.query(sql)
}

module.exports.viewResearchConsultancy = async(consultantId) => {
    console.log('consultantId in models ==>>', consultantId);
    let sql = {
        text : `SELECT * FROM research_project_consultancy WHERE id = $1`,
        values : [consultantId]
    }
    console.log('sql ==>>', sql);
    return autoDbR.query(sql)
}