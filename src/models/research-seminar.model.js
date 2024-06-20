const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

const insertDbModels = require('./insert-update-records.models');

// for fetching journal paper data 
module.exports.fetchResearchSeminar = async(userName) => {
    let sql = {
        text : 'SELECT * FROM research_seminars WHERE created_by = $1 and active=true  ORDER BY id desc',
        values : [userName]

    };

    // return await researchDbR.query(sql);
    const researchSeminarData = await researchDbR.query(sql);
    const promises = [researchSeminarData]
    return Promise.all(promises).then(([researchSeminarData]) => {
        return {
            status : "Done",
            message : 'Fetched successfully',
            seminarData : researchSeminarData.rows,
            rowCount : researchSeminarData.rowCount
        }

    }).catch((error) => {
        return{status : "Failed" , message : error.message , errorCode : error.code}
    })
};

// for inserting journal paper  data
module.exports.createResearchSeminar = async (seminarDetails, seminarFiles, userName) => {
    const {year, school, campus, NmimsFaculty, titleOfPaper, journalName,  publisher, pages, issnNo, publisherCategory, dateOfPublishing, impactFactor, scsCiteScore, scsIndexed, wosIndexed, gsIndexed, abcdIndexed, ugcIndexed, webLink, uid } = seminarDetails ;

    const seminarValues = [year, school, campus, NmimsFaculty, titleOfPaper, journalName,  publisher, pages, issnNo, publisherCategory, dateOfPublishing, impactFactor, scsCiteScore, scsIndexed, wosIndexed, gsIndexed, abcdIndexed, ugcIndexed, webLink, uid, seminarFiles, userName];

    const seminarFields = ['year', 'school', 'campus', 'nmims_faculty', 'title_of_paper', 'journal_name', 'publisher', 'pages'
        ,'issn_no', 'publisher_category', 'date_of_publishing', 'impact_factor', 'scs_cite_score', 'scs_indexed', 'wos_indexed', 'gs_indexed',
        'abdc_indexed', 'ugc_indexed', 'web_link', 'uid', 'supporting_documents', 'created_by'];

    const insertResearchSeminar = await insertDbModels.insertRecordIntoMainDb('research_seminars', seminarFields, seminarValues, userName);
    console.log('insertResearchSeminar ===>>>>>>', insertResearchSeminar);
      
    return insertResearchSeminar.status === "Done" ? {
        status : insertResearchSeminar.status,
        message : insertResearchSeminar.message
        } : {
        status : insertResearchSeminar.status,
        message : insertResearchSeminar.message,
        errorCode : insertResearchSeminar.errorCode
        }
}
// for deleting journal paper  data 
module.exports.deleteRsearchSeminar =  async(seminarId, userName) => {
    let sql = {
      // text : `DELETE FROM research_seminars WHERE id = $1 AND  created_by = $2`,
      text: `update research_seminars set active=false WHERE id = $1 AND  created_by = $2`,
      values: [seminarId, userName],
    };
    console.log('sql ===>>>', sql)
    const deletedRecord = await researchDbW.query(sql);
    const promises = [deletedRecord];
    return Promise.all(promises).then(([deletedRecord]) => {
        return  { status : "Done" , message : "Record Deleted Successfully", rowCount : deletedRecord.rowCount}
    })
    .catch((error) => {
        return{status : "Failed" , message : error.message , errorCode : error.code}
    })

}
// for updating 
module.exports.updateRsearchSeminar = async (seminarId, updateSeminarDetails, updatedSeminarFiles,  userName) => {
    const {year, school, campus, NmimsFaculty, titleOfPaper, journalName,  publisher, pages, issnNo, publisherCategory, dateOfPublishing, impactFactor, scsCiteScore, scsIndexed, wosIndexed, gsIndexed, abcdIndexed, ugcIndexed, webLink, uid } = updateSeminarDetails ;
    
    let updateResearchSeminar;
    if(updatedSeminarFiles){
        const seminarValues = [year, school, campus, NmimsFaculty, titleOfPaper, journalName,  publisher, pages, issnNo, publisherCategory, dateOfPublishing, impactFactor, scsCiteScore, scsIndexed, wosIndexed, gsIndexed, abcdIndexed, ugcIndexed, webLink, uid, updatedSeminarFiles, userName, seminarId];

        const seminarFields = ['year', 'school', 'campus', 'nmims_faculty', 'title_of_paper', 'journal_name', 'publisher', 'pages'
            ,'issn_no', 'publisher_category', 'date_of_publishing', 'impact_factor', 'scs_cite_score', 'scs_indexed', 'wos_indexed', 'gs_indexed',
            'abdc_indexed', 'ugc_indexed', 'web_link', 'uid', 'supporting_documents', 'updated_by'];
    
        updateResearchSeminar = await insertDbModels.updateFieldWithFiles('research_seminars', seminarFields, seminarValues, userName);

    } 
    else{
        const seminarValues = [year, school, campus, NmimsFaculty, titleOfPaper, journalName,  publisher, pages, issnNo, publisherCategory, dateOfPublishing, impactFactor, scsCiteScore, scsIndexed, wosIndexed, gsIndexed, abcdIndexed, ugcIndexed, webLink, uid, userName, seminarId];

        const seminarFields = ['year', 'school', 'campus', 'nmims_faculty', 'title_of_paper', 'journal_name', 'publisher', 'pages'
            ,'issn_no', 'publisher_category', 'date_of_publishing', 'impact_factor', 'scs_cite_score', 'scs_indexed', 'wos_indexed', 'gs_indexed',
            'abdc_indexed', 'ugc_indexed', 'web_link', 'uid', 'updated_by'];
    
        updateResearchSeminar = await insertDbModels.updateFieldWithOutFiles('research_seminars', seminarFields, seminarValues, userName);
    }
   
    console.log('updateResearchSeminar ===.>>>>>', updateResearchSeminar);

    return updateResearchSeminar.status === "Done" ? {
        status : updateResearchSeminar.status,
        message : updateResearchSeminar.message
        } : {
        status : updateResearchSeminar.status,
        message : updateResearchSeminar.message,
        errorCode : updateResearchSeminar.errorCode
        }
 
};

// for viewing 

module.exports.viewRsearchSeminarData = async ({seminarId}, userName) => {
    const sql = {
        text : `SELECT  year, school, campus, nmims_faculty, publisher_category, title_of_paper, journal_name, publisher, 
        pages, issn_no, TO_CHAR(date_of_publishing, 'DD-MM-YYYY') as date_of_publishing, impact_factor, scs_cite_score, scs_indexed, wos_indexed, gs_indexed, abdc_indexed, ugc_indexed, web_link, uid, supporting_documents FROM research_seminars WHERE id = $1 AND created_by = $2 and active=true`,
        values : [seminarId, userName]
    }
    console.log('sql ==>>>', sql)
    // return researchDbR.query(sql);
    const researchSeminarData = await researchDbR.query(sql);
    const promises = [researchSeminarData]
    return Promise.all(promises).then(([researchSeminarData]) => {
        return {
            status : "Done",
            message : 'Fetched successfully',
            seminarData : researchSeminarData.rows,
            rowCount : researchSeminarData.rowCount
        }

    }).catch((error) => {
        return{status : "Failed" , message : error.message , errorCode : error.code}
    })
}
