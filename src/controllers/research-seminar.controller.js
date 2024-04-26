
const researchSeminarServices = require('../services/research-seminar.service');


module.exports.renderResearchSeminar = async (req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const seminarList = await researchSeminarServices.renderResearchSeminar(userName);
    res.render('research-seminar', {
        seminarList : seminarList.rows,
        rowCount : seminarList.rowCount
    });
};


module.exports.createResearchSeminar = async (req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    console.log('data in controller', req.body);
    const researchSeminarData = await researchSeminarServices.insertResearchSeminar(req.body, userName) ;
    console.log(" researchSeminarData ===>" , researchSeminarData);
    if(researchSeminarData && researchSeminarData.rows[0].id) {
        res.status(200).send({
            status : 'done',
            seminarId: researchSeminarData.rows[0].id
        });
    }
    else {
        res.status(500).send({
            status : 'failed',
            'massage' : 'failed to insert new row'
        });
    };
};


module.exports.delResearchSeminar = async (req, res, next) => {
    const seminarId= req.body.seminarId;
    console.log('controller seminarId', seminarId) 
    const delSeminarData = await researchSeminarServices.deleteResearchSeminar(seminarId);
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
    console.log('seminarIdfor updation in controller', seminarId)
    console.log('updateResearchSeminar ==>>', updateResearchSeminar);
    const updatedSeminar = await researchSeminarServices.updateResearchSeminar({seminarId, updateResearchSeminar}, userName);
   
    if(updatedSeminar.status === 'done'){
        res.status(200).send({
            status : 'done',
            massage : updatedSeminar.massage
        });
    }
    else{
        res.status(500).send({
            status  : 'failed',
            massage : updatedSeminar.massage
        });
    };
};

module.exports.viewResearchSeminar = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const seminarId= req.body.seminarId;
    console.log('seminar Id for View ', seminarId);
    console.log('viewDataDetails ==>', req.body);
    const viewSeminarDetails = await researchSeminarServices.viewResearchSeminar({seminarId}, userName);
    console.log(' view data=>>', viewSeminarDetails)
    if(viewSeminarDetails){
        res.status(200).send(viewSeminarDetails)
    }
    else{
        res.status(500).send({
            status : 'failed',
            massage : viewSeminarDetails.masssage   
        })
    }   
}