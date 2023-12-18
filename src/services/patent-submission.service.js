const patentFormsModels = require('../models/patent-submission.models');

module.exports.fetchPatentForm = async() => {
    const patentSubmissionForm = await patentFormsModels.fetchPatentSubMissionForms();
    console.log('Data in Service' , patentSubmissionForm.rows);
    return patentSubmissionForm.rows;
}

module.exports.insertPatentFormData = async(body) => {
    const {patentData} = body;
    console.log('patentData', body);
    const insertPatentDta = await patentFormsModels.fetchPatentSubMissionForms({patentData});
    return insertPatentDta;
}