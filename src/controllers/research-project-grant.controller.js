const researchConsultancyService = require('../services/research-project-grant.service');

module.exports.renderResearchProjectConsultancy = async(req, res, next) => {

    const researchcConsultancyData = await researchConsultancyService.fetchResearConsultacyData();
    console.log('researchcConsultancyData in controller ===>>>>>', researchcConsultancyData);
    console.log(' researchcConsultancyData ::::::::::::====>>>>>>', researchcConsultancyData.InternalFaculty)

    // const researchProject = researchcConsultancyData.reseachProjectGrantList;
    // // console.log('researchProject ====>>>>', researchProject)
    // for(let i = 0; i <= researchProject.length -1; i++){
    //     // console.log('first index value ===>>>>', researchProject[i].faculty_type.table)
    // }
    // console.log('researchcConsultancyData.externalEmpList ===>>> in controller ', researchcConsultancyData.externalEmpList)
    // // Render view with structured data
    // if (researchcConsultancyData) {
    res.render('research-project-grant', {
            status : researchcConsultancyData.status,
            researchProjectData : researchcConsultancyData.researchData,
            message : researchcConsultancyData.message,
            rowCount : researchcConsultancyData.rowCount,
            InternalFaculty : researchcConsultancyData.InternalFaculty,
            errorCode : researchcConsultancyData.errorCode ? researchcConsultancyData.errorCode : null
        });

}

module.exports.insertresearchcConsultancyData = async(req, res, next) => {
    const researchConsultantData =  req.body;
    console.log('researchConsultantData ==>>', researchConsultantData);
    console.log('files in controllerr ==>>>', req.files);
    const researchcConsultancyData = await researchConsultancyService.insertResearchConsultancyData(req.body, req.files);
    console.log('researchcConsultancyData ====>>>>>', researchcConsultancyData)
    const statusCode = researchcConsultancyData.status === "Done" ? 200 : (researchcConsultancyData.errorCode ? 400 : 500);
    researchcConsultancyData.status === "Done" ? res.status(statusCode).send({
        status : researchcConsultancyData.status,
        message : researchcConsultancyData.message,
        externalEmpId : researchcConsultancyData.externalEmpId,
        consultantId : researchcConsultancyData.consultantId,
        rowCount : researchcConsultancyData.rowCount,
        message : researchcConsultancyData.message,
        researchConsultantData : researchConsultantData,
        authorNameString : researchcConsultancyData.authorNameString,
        externalNamesString : researchcConsultancyData.externalNamesString,
        internalNamesString : researchcConsultancyData.internalNamesString,
        consultancyDataFiles : researchcConsultancyData.consultancyDataFiles,

    }) : res.status(statusCode).send({
        status : researchcConsultancyData.status,
        errorCode : researchcConsultancyData.errorCode,
        message : researchcConsultancyData.message
    })
    // // console.log('consultantId in controller ===>>>>.',researchcConsultancyData.consultantId);
    // const authorName = researchcConsultancyData.authorName;
    // console.log('researchcConsultancyData.rowCount  ===>>>>', researchcConsultancyData.rowCount )
    // const consultancyFileName = researchcConsultancyData.consultancyDataFiles;
    // if(researchcConsultancyData && researchcConsultancyData.consultantId && authorName && consultancyFileName){
    //     res.status(200).send({
    //         status : 'Done',
    //         message : 'Data Inserted Successfully',
    //         consultancyFileName,
    //         consultantId : researchcConsultancyData.consultantId,
    //         researchConsultantData : researchConsultantData,
    //         authorName,
    //         tableName : researchcConsultancyData.tableName,
    //         rowCount : researchcConsultancyData.rowCount 
    //     })
    // }
    // else{
    //     res.status(500).send({
    //         status : 'Failed',
    //         message : 'Internal Server Error',
    //     })

    // }

}

module.exports.updatedConsultantData = async(req, res, next) => {
    console.log('data comming from templates ==>>', req.body);
    const consultantId = req.body.consultantId;
    const updatedConsultant = req.body;
    const authorName = !updatedConsultant.internalAuthors && !updatedConsultant.externalAuthors ? updatedConsultant.authorName : updatedConsultant.internalAuthors ?? updatedConsultant.externalAuthors;
    const updatedResearchGrant = await researchConsultancyService.updateResearchConstant(consultantId, req.body, req.files);
    console.log('updatedResearchGrant ===>>>>', updatedResearchGrant)
    console.log('mesaage ===>> in controller', updatedResearchGrant.message)
    const errMsg = updatedResearchGrant.message.error;
    console.log('errorCode ====>>>', updatedResearchGrant.errorCode)
    // const message = updatedResearchGrant.status === 'Done' ? updatedResearchGrant.message : (updatedResearchGrant.message.code === '22001' ? 'value too long for type character varying(255)' : updatedResearchGrant.message)
    const sttausCode = updatedResearchGrant.status === 'Done' ? 200 : (updatedResearchGrant.errorCode ? 400 : 500) 
    res.status(sttausCode).send({
        status : updatedResearchGrant.status === "Done" ? 'Done' : updatedResearchGrant.status,
        updatedConsultant : updatedConsultant,
        authorNameString : updatedResearchGrant.status === "Done" ? updatedResearchGrant.authorNameString : null,
        updatedConsultantFilesString : updatedResearchGrant.updatedConsultantFilesData ? updatedResearchGrant.updatedConsultantFilesData : null,
        externalTableName : updatedResearchGrant.status === "Done"? (updatedConsultant.externalNamesString ? 'externalEmpList' : null) : null,
        intenalTableName : updatedResearchGrant.status === "Done"? (updatedConsultant.internalNamesString ? 'internalEmpList' : null) : null,
        consultantId : consultantId,
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
