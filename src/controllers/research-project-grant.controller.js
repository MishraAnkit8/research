const researchConsultancyService = require('../services/research-project-grant.service');

module.exports.renderResearchProjectConsultancy = async(req, res, next) => {

    const researchcConsultancyData = await researchConsultancyService.fetchResearConsultacyData();

    // console.log('researchcConsultancyData in controller ===>>>>>', researchcConsultancyData);

    res.render('research-project-grant', {
            status : researchcConsultancyData.status,
            researchProjectData : researchcConsultancyData.researchData,
            researchPojectGrantFacultyData : researchcConsultancyData.researchPojectGrantFacultyData,
            reseachProjectIds : researchcConsultancyData.reseachProjectIds,
            message : researchcConsultancyData.message,
            rowCount : researchcConsultancyData.rowCount,
            InternalFaculty : researchcConsultancyData.InternalFaculty,
            errorCode : researchcConsultancyData.errorCode ? researchcConsultancyData.errorCode : null
        });

}

module.exports.insertResearchConsultancyData = async(req, res, next) => {
    const researchConsultantData =  req.body;
    console.log('researchConsultantData ==>>', researchConsultantData);
    console.log('files in controllerr ==>>>', req.files);

    const researchcConsultancyData = await researchConsultancyService.insertResearchConsultancyData(req.body, req.files);

    console.log('researchcConsultancyData ====>>>>>', researchcConsultancyData)
    const statusCode = researchcConsultancyData.status === "Done" ? 200 : (researchcConsultancyData.errorCode ? 400 : 500);
    researchcConsultancyData.status === "Done" ? res.status(statusCode).send({
        status : researchcConsultancyData.status,
        message : researchcConsultancyData.message,
        externalEmpIds : researchcConsultancyData.externalEmpIds,
        consultantId : researchcConsultancyData.consultantId,
        researchProjectGrantFacultyIds : researchcConsultancyData.researchProjectGrantFacultyIds,
        rowCount : researchcConsultancyData.rowCount,
        message : researchcConsultancyData.message,
        researchConsultantData : researchConsultantData,
        consultancyDataFiles : researchcConsultancyData.consultancyDataFiles,

    }) : res.status(statusCode).send({
        status : researchcConsultancyData.status,
        errorCode : researchcConsultancyData.errorCode,
        message : researchcConsultancyData.message
    })
 
}

module.exports.updatedConsultantData = async(req, res, next) => {
    console.log('data comming from templates ==>>', req.body);
    const consultantId = req.body.consultantId;
    const updatedConsultant = req.body;

    const updatedResearchGrant = await researchConsultancyService.updateResearchConstant(consultantId, req.body, req.files);

    console.log('updatedResearchGrant ===>>>>', updatedResearchGrant)

    const sttausCode = updatedResearchGrant.status === 'Done' ? 200 : (updatedResearchGrant.errorCode ? 400 : 500) 
    res.status(sttausCode).send({
        status : updatedResearchGrant.status === "Done" ? 'Done' : updatedResearchGrant.status,
        updatedConsultant : updatedConsultant,
        updatedConsultantFilesString : updatedResearchGrant.updatedConsultantFilesData ? updatedResearchGrant.updatedConsultantFilesData : null,
        consultantId : consultantId,
        facultyTableId : updatedResearchGrant.facultyTableId ? updatedResearchGrant.facultyTableId : null,
        externalEmpIds : updatedResearchGrant.externalEmpIds,
        researchProjectGrantFacultyIds : updatedResearchGrant.researchProjectGrantFacultyIds ? updatedResearchGrant.researchProjectGrantFacultyIds : null,
        message : updatedResearchGrant.message,
        errorCode : updatedResearchGrant.errorCode ? updatedResearchGrant.errorCode : null,
    })
  
   
}

module.exports.deleteResearchConsultant = async(req, res, next) => {
    console.log('body' , req.body);
    const consultantId = req.body;
    const deleteConstantData = await researchConsultancyService.deleteResearchConsultant(consultantId);
    if(deleteConstantData.status === 'Done'){
        res.status(200).send({
            status : 'Done',
            message : 'Deleted successfully'
        })
    }
    else{
        res.status(500).send({
            status : 'Failed',
            message : 'Internal Server Issue'
        })
    }
}

module.exports.viewResearchProjectConsultancy = async(req, res, next) => {
    console.log('body ===>>>', req.body.consultantId)
    const consultantId = req.body.consultantId;
    console.log('consultantId  in controller ==>>', consultantId);
    const viewResearchConsultantData = await researchConsultancyService.viewReseachProjectData(consultantId);
    console.log('viewResearchConsultantData in controller ===>>', viewResearchConsultantData)
    const submissionGrantDate = formatDate(viewResearchConsultantData.submission_date);


    if(viewResearchConsultantData){
        res.status(200).send({
            status : 'Done',
            message : 'successfull',
            consultantData : viewResearchConsultantData,
            submissionGrantDate : submissionGrantDate
        })
    }
}



function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
