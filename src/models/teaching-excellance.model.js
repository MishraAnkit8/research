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


module.exports.updateTeachingExecellance = async(teachingId, updatedTeachingExecellance, teachingDocumentToBeUpdate) => {
    const {pedagogyInnovation, pedagogyLink, fdpProgram, fdpProgramLink, workShopDetails, workShopLink, invitingFaculty, 
        invitingFacultyLink, programOrientation, programOrientationLink} = updatedTeachingExecellance;

    
        const pedagogyInnovationFile = teachingDocumentToBeUpdate.pedagogyInnovationFile ? teachingDocumentToBeUpdate.pedagogyInnovationFile[0].filename : null;
        const fdpProgramFile = teachingDocumentToBeUpdate.fdpProgramFile ? teachingDocumentToBeUpdate.fdpProgramFile[0].filename : null;
        const workShopFile = teachingDocumentToBeUpdate.workShopFile ? teachingDocumentToBeUpdate.workShopFile[0].filename : null;
        const invitingFacultyFile = teachingDocumentToBeUpdate.invitingFacultyFile ? teachingDocumentToBeUpdate.invitingFacultyFile[0].filename : null;
        const programOrientationFile = teachingDocumentToBeUpdate.programOrientationFile ? teachingDocumentToBeUpdate.programOrientationFile[0].filename : null;

        const filesArray = [
            pedagogyInnovationFile,
            fdpProgramFile,
            workShopFile,
            invitingFacultyFile,
            programOrientationFile
        ]
        console.log('filesArray in teaching models ==>>>', filesArray);

        const teachingFieldsToUpdate = [
            { field: 'pedagogy_innovation', value: pedagogyInnovation },
            { field: 'pedagogy_innovation_file', value: pedagogyInnovationFile },
            { field: 'pedagogy_innovation_link', value: pedagogyLink },
            { field: 'fdp_program', value: fdpProgram },
            { field: 'fdp_program_file', value: fdpProgramFile },
            { field: 'fdp_program_link', value: fdpProgramLink },
            { field: 'workshop_details', value: workShopDetails },
            { field: 'workshop_file', value: workShopFile },
            { field: 'workshop_link', value: workShopLink },
            { field: 'inviting_faculty', value: invitingFaculty },
            { field: 'inviting_faculty_file', value: invitingFacultyFile },
            { field: 'inviting_faculty_link', value: invitingFacultyLink },
            { field: 'program_orientation', value: programOrientation },
            { field: 'program_orientation_file', value: programOrientationFile },
            { field: 'program_orientation_link', value: programOrientationLink },
        ]

        console.log('teachingFieldsToUpdate ===>>>', teachingFieldsToUpdate);

        const setStatements = teachingFieldsToUpdate
            .filter(fieldInfo => fieldInfo.value !== null) // Filter where value is null
            .map((fieldInfo, index) => {
                console.log('dataCondition ===>>>:::::', fieldInfo.value);
                console.log('index ==>>', index);
                console.log('condition == ==>>>::::', true); //  filter ensures value is not null
                return { statement: `${fieldInfo.field} = $${index + 2}`, dataCondition: `${fieldInfo.value}` };
            });

        console.log('setStatements ==>>>', setStatements);
    //checking if any field emty then it should then make them null     
        const updateDocument = teachingFieldsToUpdate.map(fieldInfo => {
            const condition = fieldInfo.value;
            if(condition){
                console.log('condition ==>>::::', condition)
                console.log(`Condition for ${fieldInfo.field}: ${condition}`);
            }
            else{
                return null
            }
            
            const value =  fieldInfo.value ;
            if(value){
                console.log(`Value for ${fieldInfo.field}: ${value}`);
                return value;
            }
        }).filter(value => value !== null);

        console.log('updateDocument ====::::>>>', updateDocument)
        

        const updateTeachingExecellanceData = [
            teachingId,
            ...updateDocument,
        ];

        console.log('updateTeachingExecellanceData ==>>>', updateTeachingExecellanceData);

        // const setStatementString = setStatements.map(item => item.statement).join(',');
        // console.log('setStatementString ==>>>', setStatementString)
        const setStatementString = setStatements.map((item, index) => {
            if (item.dataCondition !== 'null') {
            return `${item.statement}`;
            } else {
            return '';
            }
        }).filter(Boolean).join(', ');
        
        console.log('setStatementString ==>>>', setStatementString);


        const placeholders = Array.from({ length: updateDocument.length }, (_, i) => `$${i + 2}`).join(',');
        
        const sql = {
            text: `UPDATE teaching_execellance SET ${setStatementString} WHERE id = $1`,
            values: updateTeachingExecellanceData,
        };

        console.log('sql ==>>', sql);
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