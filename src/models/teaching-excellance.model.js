const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchTeachingExecellance = async(userName) => {
    let sql = {
        text : `SELECT * FROM teaching_execellance WHERE created_by = $1 ORDER BY id desc`,
        values : [userName]
    }
    return researchDbR.query(sql);
}

module.exports.insertTeachingExecellanceData = async(teachingExecellance, teachingFilesArrayData, userName) => {
    const {pedagogyInnovation, pedagogyLink, fdpProgram, fdpProgramLink, workShopDetails, workShopLink, invitingFaculty, 
        invitingFacultyLink, programOrientation, programOrientationLink, pedagogyInnovationDescription, FdpProgramDescription, workshopDetailsDescription, invitingFacultyDescription, programOrientationDescription} = teachingExecellance;
    let sql = {
        text : `INSERT INTO teaching_execellance (pedagogy_innovation, pedagogy_innovation_link, fdp_program, fdp_program_link,workshop_details,
             workshop_link, inviting_faculty, inviting_faculty_link, program_orientation, program_orientation_link,
            pedagogy_innovation_file, fdp_program_file, workshop_file, inviting_faculty_file, program_orientation_file, created_by, pedagogy_innovation_description, fdp_program_description, workshop_details_description, inviting_faculty_description, program_orientation_description) VALUES($1, $2 , $3 ,$4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING id`,
        values : [pedagogyInnovation, pedagogyLink, fdpProgram, fdpProgramLink, workShopDetails, workShopLink, invitingFaculty, 
            invitingFacultyLink, programOrientation, programOrientationLink, teachingFilesArrayData.pedagogyInnovationFileString, teachingFilesArrayData.fdpProgramFileString, teachingFilesArrayData.workShopFileString, teachingFilesArrayData.invitingFacultyFileString, teachingFilesArrayData.programOrientationFileString, userName,
            pedagogyInnovationDescription, FdpProgramDescription, workshopDetailsDescription, invitingFacultyDescription, programOrientationDescription]
    }
    console.log('data inserted successfully ==>>', sql);
    // console.log('researchDbW.query(sql) in models ===>>', researchDbW.query(sql));
    const InsertedTeachingExecellanceRecord = await researchDbW.query(sql);
    const promises = [InsertedTeachingExecellanceRecord];
    return Promise.all(promises).then(([InsertedTeachingExecellanceRecord]) => {
        return  { status : "Done" , message : "Record Inserted Successfully" ,  rowCount : InsertedTeachingExecellanceRecord.rowCount, teachingId : InsertedTeachingExecellanceRecord.rows[0].id}
    })
    .catch((error) => {
        return{status : "Failed" , message : error.message , errorCode : error.code}
    })
}


module.exports.updateTeachingExecellance = async(teachingId, updatedTeachingExecellance, teachingDocumentToBeUpdate, userName) => {
    const {pedagogyInnovation, pedagogyLink, fdpProgram, fdpProgramLink, workShopDetails, workShopLink, invitingFaculty, 
        invitingFacultyLink, programOrientation, programOrientationLink, pedagogyInnovationDescription, FdpProgramDescription, workshopDetailsDescription, invitingFacultyDescription, programOrientationDescription} = updatedTeachingExecellance;

    
        const pedagogyInnovationFile = teachingDocumentToBeUpdate.pedagogyInnovationFileString ? teachingDocumentToBeUpdate.pedagogyInnovationFileString : null;
        const fdpProgramFile = teachingDocumentToBeUpdate.fdpProgramFileString ? teachingDocumentToBeUpdate.fdpProgramFileString : null;
        const workShopFile = teachingDocumentToBeUpdate.workShopFileString ? teachingDocumentToBeUpdate.workShopFileString : null;
        const invitingFacultyFile = teachingDocumentToBeUpdate.invitingFacultyFileString ? teachingDocumentToBeUpdate.invitingFacultyFileString : null;
        const programOrientationFile = teachingDocumentToBeUpdate.programOrientationFileString ? teachingDocumentToBeUpdate.programOrientationFileString : null;

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
            { field: 'updated_by', value: userName },
            { field: 'pedagogy_innovation_description', value: pedagogyInnovation },
            { field: 'fdp_program_description', value: FdpProgramDescription },
            { field: 'workshop_details_description', value: workshopDetailsDescription },
            { field: 'inviting_faculty_description', value: workshopDetailsDescription },
            { field: 'program_orientation_description', value: programOrientationDescription }
        ]

        console.log('teachingFieldsToUpdate ===>>>', teachingFieldsToUpdate);

        const setStatements = teachingFieldsToUpdate
            .filter(fieldInfo => fieldInfo.value !== null)
            .map((fieldInfo, index) => {
                console.log('dataCondition ===>>>:::::', fieldInfo.value);
                console.log('index ==>>', index);
                console.log('condition == ==>>>::::', true);
                return { statement: `${fieldInfo.field} = $${index + 2}`, dataCondition: `${fieldInfo.value}` };
            });

        console.log('setStatements ==>>>', setStatements);

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
        const updatedTeachingExecellanceRecord = await researchDbW.query(sql);
        const promises = [updatedTeachingExecellanceRecord];
        return Promise.all(promises).then(([updatedTeachingExecellanceRecord]) => {
            return  { status : "Done" , message : "Record Updated Successfully" ,  rowCount : updatedTeachingExecellanceRecord.rowCount}
        })
        .catch((error) => {
            return{status : "Failed" , message : error.message , errorCode : error.code}
        })
}

module.exports.deleteTeachingExecellance = async(teachingId) =>{
    let sql = {
        text : `DELETE FROM  teaching_execellance WHERE id = $1`,
        values : [teachingId]
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

module.exports.teachingExecellanceView = async(teachingId, userName) => {
    let sql = {
        text : `SELECT * FROM teaching_execellance WHERE id = $1 AND created_by = $2`,
        values : [teachingId, userName]
    }

    return researchDbR.query(sql)
}