
const researchSeminarServices = require('../services/research-seminar.service');


module.exports.renderResearchSeminar = async (req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const seminarList = await researchSeminarServices.renderResearchSeminar(userName);

    const statusCode = seminarList.status === "Done" ? 200 : (seminarList.errorCode ? 400 : 500);

    res.render('research-seminar', {
        status : seminarList.status,
        statusCode : statusCode,
        message : seminarList.message,
        rowCount : seminarList.rowCount,
        seminarData : seminarList.seminarData,
        errorCode : seminarList.errorCode
    });
};


module.exports.createResearchSeminar = async (req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    console.log('data in controller', req.body);
    
    const researchSeminarData = await researchSeminarServices.insertResearchSeminar(req.body, req.files, userName) ;
    console.log(" researchSeminarData ===>" , researchSeminarData);
    const statusCode = researchSeminarData.status === "Done" ? 200 : (researchSeminarData.errorCode ? 400 : 500);

    res.status(statusCode).send({
        status : researchSeminarData.status,
        message : researchSeminarData.message,
        seminarDetails : researchSeminarData.seminarDetails,
        rowCount : researchSeminarData.rowCount,
        seminarFiles : researchSeminarData.seminarFiles,
        errorCode : researchSeminarData.errorCode ? researchSeminarData.errorCode : null

    })

};


module.exports.delResearchSeminar = async (req, res, next) => {
    const seminarId= req.body.seminarId;
    console.log('controller seminarId', seminarId) 
    const  userName = req.body.username;
    
    const delSeminarData = await researchSeminarServices.deleteResearchSeminar(seminarId, userName);

    console.log('delSeminarData ====>>>>>>>>', delSeminarData);
    if( delSeminarData.status ===  'done'){
        res.status(200).send({
            status : 'done' ,
            massage : delSeminarData.massage
        });
    }
    else{
        res.status(500).send({
            status : 'failed' ,
            massage : delSeminarData.massage
        })

    };
};
 

module.exports.updateResearchSeminar = async (req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);
    const updateResearchSeminar = req.body;
    const seminarId= req.body.seminarId;
    console.log('req.bopdy in con troller ====>>>>>>>', req.body)

    const updatedSeminar = await researchSeminarServices.updateResearchSeminar(seminarId, req.body, req.files, userName);
    
    console.log('updatedSeminar ====>>>>>>>>', updatedSeminar);
    const statusCode = updatedSeminar.status === "Done" ? 200 : (updatedSeminar.errorCode ? 400 : 500);

    res.status(statusCode).send({
        status : updatedSeminar.status,
        message : updatedSeminar.message,
        updateSeminarDetails : updatedSeminar.updateSeminarDetails,
        updatedSeminarFiles : updatedSeminar.updatedSeminarFiles,
        errorCode : updatedSeminar.errorCode ? updatedSeminar.errorCode : null
    })
};

module.exports.viewResearchSeminar = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const seminarId= req.body.seminarId;
    console.log('seminar Id for View ', seminarId);
    console.log('viewDataDetails ==>', req.body);
    const viewSeminarDetails = await researchSeminarServices.viewResearchSeminar({seminarId}, userName);
    console.log(' view data in controller =>>', viewSeminarDetails);

    const statusCode = viewSeminarDetails.status === "Done" ? 200 : (viewSeminarDetails.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : viewSeminarDetails.status,
        message : viewSeminarDetails.viewSeminarDetails,
        seminarData : viewSeminarDetails.seminarData,
        errorCode : viewSeminarDetails.errorCode ? viewSeminarDetails.errorCode : null
    })
    // if(viewSeminarDetails){
    //     res.status(200).send(viewSeminarDetails)
    // }
    // else{
    //     res.status(500).send({
    //         status : 'failed',
    //         massage : viewSeminarDetails.masssage   
    //     })
    // }   
}