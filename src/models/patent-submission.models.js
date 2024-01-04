const { autoriders_read_db, autoriders_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const autoDbR = dbPoolManager.get('autoDbR', autoriders_read_db);
const autoDbW = dbPoolManager.get('autoDbW', autoriders_write_db);

module.exports.fetchPatentSubMissionForms = async() => {
    let sql = {
        text :`SELECT * FROM patent_submissions ORDER BY id`
    }
    return autoDbR.query(sql)
}

module.exports.insertPatentData = async(patentData, file) => {
    const {typeOfInvention, titleOfInvention, patentStage, achiveSdg, applicationNum, date, isPresentor} = patentData;
   
    console.log('file ==>', file)
    console.log("patentData::::::", patentData)
    let sql = {
        text : `INSERT INTO  patent_submissions (type_of_invention, title_of_invention,  patent_stage, achive_sdg, application_no, date, is_presenter, patent_file) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        values : [typeOfInvention, titleOfInvention, patentStage, achiveSdg, applicationNum, date, isPresentor, file]
    }
    console.log('sql ==>>', sql)
    return autoDbW.query(sql);

}

module.exports.updatePatentsubmissionData = async({updatedPatentData, patentId, patentDocument}) => {
    console.log('filename in models ==>', patentDocument )
    const {typeOfInvention, titleOfInvention, patentStage, achiveSdg, applicationNum, date, isPresentor} = updatedPatentData 
    let sql = {
        text : `UPDATE patent_submissions  SET type_of_invention = $2,  title_of_invention = $3, patent_stage = $4, achive_sdg = $5, 
              application_no = $6, date = $7, is_presenter =$8 , patent_file = $9 WHERE id = $1`,
        values : [patentId , typeOfInvention, titleOfInvention, patentStage, achiveSdg, applicationNum, date, isPresentor, patentDocument]
    
    }
    console.log('Sql ==>>', sql);
    return autoDbW.query(sql)
}

module.exports.deletePatentSubmissionData = async(patentId) => {
    console.log('patent Id  in Model >>', patentId)
    let sql = {
        text : `DELETE FROM patent_submissions WHERE id = $1`,
        values : [patentId]
    }
    console.log('sql qury for delete ==>', sql)
    return autoDbW.query(sql)
}

module.exports.viewPatentSubmission = async(patentId) => {
    console.log('id' , patentId)
    let sql = {
        text : `SELECT * FROM patent_submissions WHERE id = $1`,
        values : [patentId]
    }
    console.log('sql qury for view', sql);
    return autoDbR.query(sql);
}