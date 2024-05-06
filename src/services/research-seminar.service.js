const researchSeminarModel = require('../models/research-seminar.model');
// service for fetch
module.exports.renderResearchSeminar = async (userName) => {
    console.log('username in my service ===>>>>>>', userName);

    const researchSeminar = await researchSeminarModel.fetchResearchSeminar(userName); 

    console.log('researchSeminar ===>', researchSeminar)
    return  researchSeminar.status === "Done" ? {
        status : researchSeminar.status,
        message : researchSeminar.message,
        rowCount : researchSeminar.rowCount,
        seminarData : researchSeminar.seminarData
    } : {
        status : researchSeminar.status,
        message : researchSeminar.message,
        errorCode : researchSeminar.errorCode
    }
};

// service for insert
module.exports.insertResearchSeminar = async (body, files, userName) => {
    const seminarDetails =  body;

    console.log('seminarDetails inservice ==>>', seminarDetails);
    const seminarFiles = files ?.map(file => file.filename).join(',');

    const newResearchSeminar = await researchSeminarModel.createResearchSeminar(seminarDetails, seminarFiles, userName);

    console.log('newResearchSeminar ====>>>>>>>', newResearchSeminar);
    
    return newResearchSeminar.status === "Done" ? {
        status : newResearchSeminar.status,
        message : newResearchSeminar.message,
        seminarDetails : seminarDetails,
        rowCount : newResearchSeminar.rowCount,
        seminarFiles : seminarFiles,
        
    } : {
        status : newResearchSeminar.status,
        message : newResearchSeminar.message,
        errorCode : newResearchSeminar.errorCode
    };
};

// service for delete
module.exports.deleteResearchSeminar = async (seminarId, userName) => {
    const result = await researchSeminarModel.deleteRsearchSeminar(seminarId, userName);

    console.log('result ===>>>>>>>', result);
    if(result.rowCount === 1){
        return {
            status : 'done' ,
            massage : 'row is deleted successfully',
            // seminarFiles : seminarFiles
        };
    }
    else{
        return {
            status : 'failed' ,
            massage : 'could not delete any thing'
        }
    }
};

// service for update
module.exports.updateResearchSeminar = async (seminarId, body, files,  userName) => {
    const updateSeminarDetails = body;
    // const seminarId = body.seminarId;
    console.log('seminarId ===>>>>>', seminarId)

    const updatedSeminarFiles = files ?.map(file => file.filename).join(',');

    const updatedResearchSeminarData = await researchSeminarModel.updateRsearchSeminar(seminarId, updateSeminarDetails, updatedSeminarFiles,  userName);

    console.log('updatedResearchSeminarData ===>>>>>>', updatedResearchSeminarData);

    return updatedResearchSeminarData.status === "Done" ? {
        status : updatedResearchSeminarData.status,
        message : updatedResearchSeminarData.message,
        updateSeminarDetails : updateSeminarDetails,
        updatedSeminarFiles : updatedSeminarFiles
    } : {
        status : updatedResearchSeminarData.status,
        message : updatedResearchSeminarData.message,
        errorCode : updatedResearchSeminarData.errorCode

    }
    // console.log('id for  updation in service', seminarId);
    // if( updatedResearchSeminarData.rowCount === 1){
    //     return {
    //         status : 'done' ,
    //         massage : 'data updated successfully'
    //     };
    // }
    // else{
    //     return {
    //         status : 'failed' ,
    //         massage : 'data is not updating'
    //     }
    // };
}

// service for view
module.exports.viewResearchSeminar = async ({seminarId}, userName) => {

    const viewRsearchSeminarData = await researchSeminarModel.viewRsearchSeminarData({seminarId}, userName);

    console.log('viewRsearchSeminarData ==>>', viewRsearchSeminarData);
    return viewRsearchSeminarData.status === "Done" ? {
        status : viewRsearchSeminarData.status,
        message : viewRsearchSeminarData.message,
        seminarData : viewRsearchSeminarData.seminarData
    } : {
        status : viewRsearchSeminarData.status,
        message : viewRsearchSeminarData.message,
        errorCode : viewRsearchSeminarData.errorCode
    }

    // if(viewRsearchSeminarData.rowCount === 1){
    //     return  viewRsearchSeminarData.rows;
    // } 
    // else{
    //     return {
    //         status : 'failed',
    //         masssage : 'error to fetching'
    //     }
    // }
}