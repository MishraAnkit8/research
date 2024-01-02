
const researchSeminarServices = require('../services/research-seminar.service');

// controller for fetching
module.exports.renderResearchSeminar = async (req, res, next) => {
    const seminarList = await researchSeminarServices.renderResearchSeminar();
    res.render('research-seminar', {
        seminarList : seminarList
    });
};

// controller for inserting
module.exports.createResearchSeminar = async (req, res, next) => {
    console.log('data in controller', req.body);
    const researchSeminarData = await researchSeminarServices.insertResearchSeminar(req.body) ;
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

// controller for deleting
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
 
// controller for updating 
module.exports.updateResearchSeminar = async (req, res, next) => {
    const updateResearchSeminar = req.body;
    const seminarId= req.body.seminarId;
    console.log('seminarIdfor updation in controller', seminarId)
    console.log('updateResearchSeminar ==>>', updateResearchSeminar);
    const updatedSeminar = await researchSeminarServices.updateResearchSeminar({seminarId, updateResearchSeminar});
   
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
    const seminarId= req.body.seminarId;
    console.log('seminar Id for View ', seminarId);
    console.log('viewDataDetails ==>', req.body);
    const viewSeminarDetails = await researchSeminarServices.viewResearchSeminar({seminarId});
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