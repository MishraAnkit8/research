const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchResearchConsultancy = async() => {
    let researchConSql = {
        text : `SELECT * FROM research_project_consultancy ORDER BY id`,
    }
    let internalEmpSql = {
        text: `SELECT * FROM employee_table ORDER BY id`
    };
    
    let externalEmpSql = {
        text: `SELECT * FROM external_emp ORDER BY id`
    }
    console.log('externalEmpSql ===<>>>>', externalEmpSql);
    console.log('researchConSql ===>>>', researchConSql);
    console.log('internalEmpSql ===>>>', internalEmpSql)
    const researchconPromise = researchDbR.query(researchConSql);
    const internalEmpPromise = researchDbR.query(internalEmpSql);
    const externalEmpPromise = researchDbR.query(externalEmpSql)

    const [researchConsultancyList, internalEmpList, externalEmpList] = await Promise.all([researchconPromise, internalEmpPromise, externalEmpPromise]);

    return {
        researchConsultancyList: researchConsultancyList,
        internalEmpList: internalEmpList,
        externalEmpList : externalEmpList
    };
}

module.exports.insertResearhcProjectConstancyData = async(researchCunsultancyData, consultancyDataFiles) => {
    console.log('researchCunsultancyData inside models ===>>>', researchCunsultancyData)
    const externalEmpName = researchCunsultancyData.externalAuthors;
    console.log('externalEmpName ====>>>>>', externalEmpName);
    const internalAuthors = researchCunsultancyData.internalAuthors;
    console.log('internalAuthors ====>>>', internalAuthors);
    const authorName = externalEmpName ?? internalAuthors;
    console.log('authorName === >>>.', authorName)
    const {titleOfProject, grantProposalCategory, typeOfGrant, thurstAreaOfResearch, fundingAgency, fundingAmount, statusOfResearchProject,
        submissionGrantDate} = researchCunsultancyData
    let researchSql = {
        text : `INSERT INTO research_project_consultancy(title_of_project, grant_proposal_category, type_of_grant,  thrust_area_of_research, name_of_funding_agency,
               funding_amount, status_of_research_project, submission_grant_date, faculty_type, supporting_documents) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        values : [titleOfProject, grantProposalCategory, typeOfGrant, thurstAreaOfResearch, fundingAgency, fundingAmount, statusOfResearchProject,
            submissionGrantDate, authorName, consultancyDataFiles]
    }

    // if external author is there then also insert into external_emp table
    if (externalEmpName) {
        let externalEmpSql = {
          text: `INSERT INTO external_emp(external_emp_name) VALUES ($1) RETURNING id`,
          values: [externalEmpName],
        };
      console.log("externalEmpSql ===>>>", externalEmpSql);
      console.log("researchSql ==>>", researchSql);
      const externalEmpTable = researchDbW.query(externalEmpSql);
      const researchConsultancyTable = researchDbW.query(researchSql);
      const [researchConTable, externalEmp] = await Promise.all([researchConsultancyTable, externalEmpTable]);
      return {
          externalEmp: externalEmp,
          researchConTable: researchConTable,
        };
      } 
    else {
        console.log("researchSql ==>>", researchSql);
        const researchConsultancyTable = await researchDbW.query(researchSql);
        return {
            researchConTable: researchConsultancyTable,
        };
      }


    return researchDbW.query(researchSql)
}

module.exports.updateResearchConsultantData = async(consultantId, updatedConsultant, updatedConsultantFilesData) => {
    const internalAuthors = updatedConsultant.internalAuthors;
    const externalAuthors = updatedConsultant.externalAuthors;
    const authorName = !internalAuthors && !externalAuthors ? updatedConsultant.authorName : internalAuthors ?? externalAuthors;
    if(updatedConsultantFilesData){
        const {titleOfProject, grantProposalCategory, typeOfGrant, thurstAreaOfResearch, fundingAgency, fundingAmount, statusOfResearchProject,
            submissionGrantDate} = updatedConsultant;
        let sql = {
            text : `UPDATE research_project_consultancy SET title_of_project = $2, grant_proposal_category = $3, type_of_grant = $4,  thrust_area_of_research = $5, name_of_funding_agency = $6,
            funding_amount = $7, status_of_research_project = $8, submission_grant_date = $9, faculty_type = $10, supporting_documents = $11 WHERE id = $1 `,
            values : [consultantId, titleOfProject, grantProposalCategory, typeOfGrant, thurstAreaOfResearch, fundingAgency, fundingAmount, statusOfResearchProject,
                submissionGrantDate, authorName, updatedConsultantFilesData]
        }
        console.log('sql ====>>>>', sql);
        return researchDbW.query(sql)

    }
    else{
        const {titleOfProject, grantProposalCategory, typeOfGrant, thurstAreaOfResearch, fundingAgency, fundingAmount, statusOfResearchProject,
            submissionGrantDate} = updatedConsultant;
        let sql = {
            text : `UPDATE research_project_consultancy SET title_of_project = $2, grant_proposal_category = $3, type_of_grant = $4,  thrust_area_of_research = $5, name_of_funding_agency = $6,
            funding_amount = $7, status_of_research_project = $8, submission_grant_date = $9, faculty_type = $10 WHERE id = $1 `,
            values : [consultantId, titleOfProject, grantProposalCategory, typeOfGrant, thurstAreaOfResearch, fundingAgency, fundingAmount, statusOfResearchProject,
                submissionGrantDate, authorName]
        }

        console.log('sql ====>>>>', sql);
        return researchDbW.query(sql)
    }
   
}

module.exports.deleteResearchConsultantData = async(consultantId) => {
    console.log('id in model ==>>', consultantId);
    let sql = {
        text : `DELETE FROM research_project_consultancy WHERE id = $1`,
        values : [consultantId]
    }
    return researchDbW.query(sql)
}

module.exports.viewResearchConsultancy = async(consultantId) => {
    console.log('consultantId in models ==>>', consultantId);
    let sql = {
        text : `SELECT * FROM research_project_consultancy WHERE id = $1`,
        values : [consultantId]
    }
    console.log('sql ==>>', sql);
    return researchDbR.query(sql)
}