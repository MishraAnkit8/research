const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);



module.exports.insertFacultyDetails = async(exetrnalFacultyDetails) => {

    console.log('exetrnalFacultyDetails ====>>>>>', exetrnalFacultyDetails);
    const {facultyEmpId, facultyName, facultyDsg, facultyAddr} = exetrnalFacultyDetails

    let sql = {
        text : `INSERT INTO faculties (faculty_type_id, employee_id, faculty_name, designation, address) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        values : [2, facultyEmpId, facultyName, facultyDsg, facultyAddr]
    }


    console.log('sql ====>>>>>', sql);
    const insertFacultyDetails = await researchDbW.query(sql);
    const promises = [insertFacultyDetails];
    return Promise.all(promises).then(([insertFacultyDetails]) => {
        return  { status : "Done" , message : "Faculty Record  Inserted Successfully" ,  rowCount : insertFacultyDetails.rowCount , externalFacultyId : insertFacultyDetails.rows[0].id}
    })
    .catch((error) => {
        return{status : "Failed" , message : error.message , errorCode : error.code}
    })
}