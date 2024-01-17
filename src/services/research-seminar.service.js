const researchSeminarModel = require('../models/research-seminar.model');
// service for fetch
module.exports.renderResearchSeminar = async () => {
    let result = await researchSeminarModel.fetchResearchSeminar(); 
    console.log('result ===>', result)
    return result.rows  
};

// service for insert
module.exports.insertResearchSeminar = async (body) => {
    const seminarDetails =  body;
    const newResearchSeminar = await researchSeminarModel.createResearchSeminar(seminarDetails);
    return newResearchSeminar ;
};

// service for delete
module.exports.deleteResearchSeminar = async (seminarId) => {
    const result = await researchSeminarModel.deleteRsearchSeminar({ seminarId });
    if(result.rowCount === 1){
        return {
            status : 'done' ,
            massage : 'row is deleted successfully'
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
module.exports.updateResearchSeminar = async ({seminarId, updateResearchSeminar}) => {
    const updatedResearchSeminarData = await researchSeminarModel.updateRsearchSeminar({seminarId, updateResearchSeminar});
    console.log('id for  updation in service', seminarId);
    if( updatedResearchSeminarData.rowCount === 1){
        return {
            status : 'done' ,
            massage : 'data updated successfully'
        };
    }
    else{
        return {
            status : 'failed' ,
            massage : 'data is not updating'
        }
    };
}

// service for view
module.exports.viewResearchSeminar = async ({seminarId}) => {
    const viewRsearchSeminarData = await researchSeminarModel.viewRsearchSeminarData({seminarId});
    console.log('viewRsearchSeminarData ==>>', viewRsearchSeminarData.rows)
    if(viewRsearchSeminarData.rowCount === 1){
        return  viewRsearchSeminarData.rows;
    } 
    else{
        return {
            status : 'failed',
            masssage : 'error to fetching'
        }
    }
}