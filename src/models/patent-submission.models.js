const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchPatentSubMissionForms = async() => {
    let sql = {
        text :`SELECT * FROM patent_submissions ORDER BY id`
    }
    return researchDbR.query(sql)
}

module.exports.insertPatentData = async(patentData, patentDataBaseFiles) => {
    const {typeOfInvention, titleOfInvention, patentStage, achiveSdg, applicationNum, subMissionDate, isPresentor} = patentData;
   
    console.log('file ==>', patentDataBaseFiles)
    console.log("patentData::::::", patentData)
    let sql = {
        text : `INSERT INTO  patent_submissions (type_of_invention, title_of_invention,  patent_stage, achieve_sdg, application_no, date, is_presenter, patent_file) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        values : [typeOfInvention, titleOfInvention, patentStage, achiveSdg, applicationNum, subMissionDate, isPresentor, patentDataBaseFiles]
    }
    console.log('sql ==>>', sql)
    return researchDbW.query(sql);

}

module.exports.updatePatentsubmissionData = async(updatedPatentData, patentId, patentDataFiles) => {
    if(patentDataFiles) {
        console.log('filename in models ==>', patentDataFiles )
        const {typeOfInvention, titleOfInvention, patentStage, achiveSdg, applicationNum, subMissionDate, isPresentor} = updatedPatentData 
        let sql = {
            text : `UPDATE patent_submissions  SET type_of_invention = $2,  title_of_invention = $3, patent_stage = $4, achieve_sdg = $5, 
                  application_no = $6, date = $7, is_presenter =$8 , patent_file = $9 WHERE id = $1`,
            values : [patentId , typeOfInvention, titleOfInvention, patentStage, achiveSdg, applicationNum, subMissionDate, isPresentor, patentDataFiles]
        
        }
        console.log('Sql ==>>', sql);
        return researchDbW.query(sql)
    }
    else{
        const {typeOfInvention, titleOfInvention, patentStage, achiveSdg, applicationNum, subMissionDate, isPresentor} = updatedPatentData 
        let sql = {
            text : `UPDATE patent_submissions  SET type_of_invention = $2,  title_of_invention = $3, patent_stage = $4, achieve_sdg = $5, 
                  application_no = $6, date = $7, is_presenter =$8 WHERE id = $1`,
            values : [patentId , typeOfInvention, titleOfInvention, patentStage, achiveSdg, applicationNum, subMissionDate, isPresentor]
        
        }
        console.log('Sql ==>>', sql);
        return researchDbW.query(sql)
    }
}

module.exports.deletePatentSubmissionData = async(patentId) => {
    console.log('patent Id  in Model >>', patentId)
    let sql = {
        text : `DELETE FROM patent_submissions WHERE id = $1`,
        values : [patentId]
    }
    console.log('sql qury for delete ==>', sql)
    return researchDbW.query(sql)
}

module.exports.viewPatentSubmission = async(patentId) => {
    console.log('id' , patentId)
    let sql = {
        text : `SELECT type_of_invention, title_of_invention,  patent_stage, achieve_sdg, application_no, TO_CHAR(date, 'DD-MM-YYYY') as date, is_presenter, patent_file FROM patent_submissions WHERE id = $1`,
        values : [patentId]
    }
    console.log('sql qury for view', sql);
    return researchDbR.query(sql);
}