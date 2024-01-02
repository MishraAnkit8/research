const { autoriders_read_db, autoriders_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const autoDbR = dbPoolManager.get('autoDbR', autoriders_read_db);
const autoDbW = dbPoolManager.get('autoDbW', autoriders_write_db);

module.exports.fetchTeachingExecellance = async() => {
    let sql = {
        text : `SELECT * FROM teaching_execellance ORDER BY id`
    }
    return autoDbR.query(sql);
}

module.exports.insertTeachingExecellanceData = async(teachingExecellance, pedagogyInnovationFile, fdpProgramFile, workShopFile, invitingFacultyFile, programOrientationFile) => {
    const {pedagogyInnovation, pedagogyLink, fdpProgram, fdpProgramLink, workShopDetails, workShopLink, invitingFaculty, 
        invitingFacultyLink, programOrientation, programOrientationLink} = teachingExecellance;
    let sql = {
        text : `INSERT INTO teaching_execellance (pedagogy_innovation, pedagogy_innovation_link, fdp_program, fdp_program_link,workshop_details,
             workshop_link, inviting_faculty, inviting_faculty_link, program_orientation, program_orientation_link,
            pedagogy_innovation_file, fdp_program_file, workshop_file, inviting_faculty_file, program_orientation_file) VALUES($1, $2 , $3 ,$4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`,
        values : [pedagogyInnovation, pedagogyLink, fdpProgram, fdpProgramLink, workShopDetails, workShopLink, invitingFaculty, 
            invitingFacultyLink, programOrientation, programOrientationLink, pedagogyInnovationFile, fdpProgramFile, workShopFile, invitingFacultyFile, programOrientationFile]
    }
    
    return autoDbW.query(sql)
}

module.exports.updateTeachingExecellance = async(teachingId, updatedTeachingExecellance, pedagogyInnovationFile, fdpProgramFile, workShopFile, invitingFacultyFile, programOrientationFile) => {
    const {pedagogyInnovation, pedagogyLink, fdpProgram, fdpProgramLink, workShopDetails, workShopLink, invitingFaculty, 
        invitingFacultyLink, programOrientation, programOrientationLink} = updatedTeachingExecellance;
    let sql = {
        text : `UPDATE  teaching_execellance SET
            pedagogy_innovation = $2, pedagogy_innovation_link = $3, fdp_program = $4, fdp_program_link = $5,workshop_details = $6,
             workshop_link = $7, inviting_faculty = $8, inviting_faculty_link = $9, program_orientation = $10, program_orientation_link = $11,
            pedagogy_innovation_file = $12, fdp_program_file = $13, workshop_file = $14, inviting_faculty_file = $15, program_orientation_file = $16 
            WHERE id = $1`,
        values : [teachingId, pedagogyInnovation, pedagogyLink, fdpProgram, fdpProgramLink, workShopDetails, workShopLink, invitingFaculty, 
            invitingFacultyLink, programOrientation, programOrientationLink, pedagogyInnovationFile, fdpProgramFile, workShopFile, invitingFacultyFile, programOrientationFile]
    }

    return autoDbW.query(sql);
    
}

module.exports.deleteTeachingExecellance = async(teachingId) =>{
    let sql = {
        text : `DELETE FROM  teaching_execellance WHERE id = $1`,
        values : [teachingId]
    }

    return autoDbW.query(sql)
}

module.exports.teachingExecellanceView = async(teachingId) => {
    let sql = {
        text : `SELECT * FROM teaching_execellance WHERE id = $1`,
        values : [teachingId]
    }

    return autoDbR.query(sql)
}