const researchConsultancyService = require('../services/research-consultancy.service');
const clientScript = require('../../public/js/client');
const path = require('path');

module.exports.renderResearchProjectConsultancy = async(req, res, next) => {

    const researchcConsultancyData = await researchConsultancyService.fetchResearConsultacyData();
    // Destructuring for easier access
    const { researchConsultancyList, internalEmpList, externalEmpList } = researchcConsultancyData;

    // Logging for debugging
    console.log('researchcConsultancyData ===>>>', researchConsultancyList.rows);
    console.log('employee List ====>>>', internalEmpList.rows);
    console.log('external emp list ====>>>>>>>', externalEmpList.rows);

    // Extract author names from patentList
    const authorNameArray = researchConsultancyList.rows.map(research => research.faculty_type);

    // Consolidate internal and external employee lists with additional info
    const resultArray = [
        ...internalEmpList.rows.map(emp => ({ authorName: emp.employee_name, table: 'internalEmpList' })),
        ...externalEmpList.rows.map(emp => ({ authorName: emp.external_emp_name, table: 'externalEmpList' }))
    ];


    // Deduplicate resultArray while preserving object structure
    const uniqueResults = Array.from(new Set(resultArray.map(JSON.stringify))).map(JSON.parse);

    // Match unique results with patents and modify faculty_type with matched info
    const matchedPatentsWithKey = uniqueResults.filter(uniqueResult => {
        const authorExists = researchConsultancyList.rows.some(patent => patent.faculty_type === uniqueResult.authorName);
        if (authorExists) {
            const index = researchConsultancyList.rows.findIndex(patent => patent.faculty_type === uniqueResult.authorName);
            if (index !== -1) {
                researchConsultancyList.rows[index].faculty_type = { authorName: uniqueResult.authorName, table: uniqueResult.table };
            }
            return true;
        }
        return false;
    });

    // Final logging
    console.log('researchConsultancyList =====>>>>>>', researchConsultancyList.rows);
    // console.log('matchedPatentsWithKey ====>>>>>>>>', matchedPatentsWithKey);
    // console.log('rowCount ===>>>>', researchConsultancyList.rowCount)
    // console.log('internalEmpList.rows ===>>>', internalEmpList.rows);
  

    // Render view with structured data
    if (researchcConsultancyData) {
        res.render('research-project-consultancy', {
            reseachConsultancyDataList: researchConsultancyList.rows,
            rowCount: researchConsultancyList.rowCount,
            internalEmpList: internalEmpList.rows,
            externalEmpList: externalEmpList.rows,
            rowCount : researchConsultancyList.rowCount
        });
    }
}

module.exports.insertResearchConsultancyData = async(req, res, next) => {
    const researchConsultantData =  req.body;
    console.log('researchConsultantData ==>>', researchConsultantData);
    // const {filename} = req.file;
    // console.log('file name ', filename);
    console.log('files in controllerr ==>>>', req.files);
    const researchConsultancyData = await researchConsultancyService.insertResearchConsultancyData(req.body, req.files);
    console.log('consultantId in controller ===>>>>.',researchConsultancyData.consultantId);
    const authorName = researchConsultancyData.authorName;
    const consultancyFileName = researchConsultancyData.consultancyDataFiles;

    if(researchConsultancyData && researchConsultancyData.consultantId && authorName && consultancyFileName){
        res.status(200).send({
            status : 'Done',
            massage : 'Data Inserted Successfully',
            consultancyFileName,
            consultantId : researchConsultancyData.consultantId,
            researchConsultantData : researchConsultantData,
            authorName
        })
    }
    else{
        res.status(500).send({
            status : 'Failed',
            massage : 'Internal Server Error',
        })

    }

}

module.exports.updatedConsultantData = async(req, res, next) => {
    console.log('data comming from templates ==>>', req.body);
    const updatedConsultantData = req.body;
    const authorName = !updatedConsultantData.internalAuthors && !updatedConsultantData.externalAuthors ? updatedConsultantData.authorName : updatedConsultantData.internalAuthors ?? updatedConsultantData.externalAuthors;

    if(req.files){
        console.log(' updated file name ==>', req.files);
        const consultantId = req.body.consultantId
        const updatedConsultant = req.body;
        const updateResearchConstantData = await researchConsultancyService.updateResearchConstant(consultantId, updatedConsultant, req.files);
        const updatedConsultantFilesString = updateResearchConstantData.updatedConsultantFilesData;
        console.log('updated files string in controller ====>>>>>', updatedConsultantFilesString)
        if(updateResearchConstantData){
            res.status(200).send({
                status : 'done',
                massage : 'updated successfully',
                updatedConsultant,
                updatedConsultantFilesString,
                authorName
            })
        }
    }

    else{
        const consultantId = req.body.consultantId
        const updatedConsultant = req.body;
        const updateResearchConstantData = await researchConsultancyService.updateResearchConstant(consultantId, updatedConsultant);
        if(updateResearchConstantData){
            res.status(200).send({
                status : 'done',
                massage : 'updated successfully',
                updatedConsultant
            })
        }
    }
   
}

module.exports.deleteResearchConsultant = async(req, res, next) => {
    console.log('body' , req.body);
    const consultantId = req.body;
    const deleteConstantData = await researchConsultancyService.deleteResearchConsultant(consultantId);
    if(deleteConstantData.status === 'done'){
        res.status(200).send({
            status : 'done',
            massage : 'deleted successfully'
        })
    }
    else{
        res.status(500).send({
            status : 'failed',
            massage : 'internal server issue'
        })
    }
}

module.exports.viewResearchProjectConsultancy = async(req, res, next) => {
    const {consultantId} = req.body;
    console.log('consultantId  in controller ==>>', consultantId);
    const viewResearchConsultantData = await researchConsultancyService.viewReseachProjectData(consultantId);
    console.log('viewResearchConsultantData in controller ===>>', viewResearchConsultantData)
    if(viewResearchConsultantData){
        res.status(200).send({
            status : 'done',
            massage : 'successfull',
            consultantData : viewResearchConsultantData
        })
    }
}