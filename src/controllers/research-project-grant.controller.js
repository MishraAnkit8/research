const researchConsultancyService = require("../services/research-project-grant.service");
const { getRedisData } = require('../../utils/redis.utils');

module.exports.renderResearchProjectConsultancy = async (req, res, next) => {
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in controller  ===>>>>>>', userName);

  const researchcConsultancyData = await researchConsultancyService.fetchResearConsultacyData(userName);


  console.log('researchcConsultancyData ===>>>>>', researchcConsultancyData);

  res.render("research-project-grant", {
    status: researchcConsultancyData.status,
    researchData: researchcConsultancyData.researchData,
    InternalFaculty : researchcConsultancyData.InternalFaculty,
    rowCount: researchcConsultancyData.rowCount,
    errorCode: researchcConsultancyData.errorCode
      ? researchcConsultancyData.errorCode
      : null,
  });
};

module.exports.insertResearchConsultancyData = async (req, res, next) => {
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in controller  ===>>>>>>', userName);

  console.log("files in controllerr ==>>>", req.files);
  console.log('data comming from frontend =====>>>>>>::::', req.body);

  const researchcConsultancyData = await researchConsultancyService.insertResearchConsultancyData(
      req.body, req.files, userName);

  console.log("researchcConsultancyData ====>>>>>", researchcConsultancyData);

  const statusCode = researchcConsultancyData.status === "Done" ? 200 : researchcConsultancyData.errorCode
      ? 400 : 500;

  res.status(statusCode).send({
        status: researchcConsultancyData.status,
        message: researchcConsultancyData.message,
        externalIds: researchcConsultancyData.externalIds,
        consultantId: researchcConsultancyData.consultantId,
        consultantFacultyIds : researchcConsultancyData.consultantFacultyIds,
        rowCount: researchcConsultancyData.rowCount,
        errorCode : researchcConsultancyData.errorCode ? researchcConsultancyData.errorCode : null
      })
};

module.exports.updatedConsultantData = async (req, res, next) => {
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in controller  ===>>>>>>', userName);

  const consultantId = req.body.consultantId;
  const updatedConsultant = req.body;

  const updatedResearchGrant = await researchConsultancyService.updateResearchConstant(consultantId, req.body,
      req.files, userName);

  console.log("updatedResearchGrant ===>>>>", updatedResearchGrant);

  const sttausCode = updatedResearchGrant.status === "Done" ? 200 : updatedResearchGrant.errorCode
      ? 400 : 500;

  res.status(sttausCode).send(
    {
      status: updatedResearchGrant.status,
      message: updatedResearchGrant.message,
      consultancyRowCount : updatedResearchGrant.consultancyRowCount,
      updatedFacultyRowCount : updatedResearchGrant.updatedFacultyRowCount,
      consultantFacultyId : updatedResearchGrant.consultantFacultyId,
      externalIds : updatedResearchGrant.externalIds,
      errorCode: updatedResearchGrant.errorCode ? updatedResearchGrant.errorCode : null
  });
};

module.exports.deleteResearchConsultant = async (req, res, next) => {
  console.log("body", req.body);
  const consultantId = req.body;
  const deleteConstantData =
    await researchConsultancyService.deleteResearchConsultant(consultantId);

  const statusCode =
    deleteConstantData.status === "Done"
      ? 200
      : deleteConstantData.errorCode
      ? 400
      : 500;
  res.status(statusCode).send({
    status: deleteConstantData.status,
    message: deleteConstantData.message,
    rowCount: deleteConstantData.rowCount,
    grantFacultyRowCount: deleteConstantData.grantFacultyRowCount,
    errorCode: deleteConstantData.errorCode
      ? deleteConstantData.errorCode
      : null,
  });
};

module.exports.viewResearchProjectConsultancy = async (req, res, next) => {
  const userName = req.body.username;
  console.log("userName in controller  ===>>>>>>", userName);

  console.log("body ===>>>", req.body.consultantId);
  const consultantId = req.body.consultantId;
  console.log("consultantId  in controller ==>>", consultantId);
  const viewResearchConsultantData =
    await researchConsultancyService.viewReseachProjectData(
      consultantId,
      userName
    );

  console.log(
    "viewResearchConsultantData in controller ===>>",
    JSON.stringify(viewResearchConsultantData.rows)
  );
  const submissionGrantDate = formatDate(
    viewResearchConsultantData.researchData.submission_date
  );
  console.log("submissionGrantDate ===>>>>>", submissionGrantDate);

  const statusCode =
    viewResearchConsultantData.status === "Done"
      ? 200
      : viewResearchConsultantData.errorCode
      ? 400
      : 500;

  res.status(statusCode).send({
    status: viewResearchConsultantData.status,
    message: viewResearchConsultantData.message,
    researchData: viewResearchConsultantData.researchData,
    rowCount: viewResearchConsultantData.rowCount,
    facultyInfoArray: viewResearchConsultantData.facultyInfoArray,
    submissionGrantDate: submissionGrantDate,
    errorCode: viewResearchConsultantData.errorCode
      ? viewResearchConsultantData.errorCode
      : null,
  });
};



module.exports.retriveExternalDetails = async(req, res, next) => {
  console.log('data commimg from frontend ====>>>>>', req.body);
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in controller  ===>>>>>>', userName);

  const retriveFacultyData = await researchConsultancyService.retriveExternalData(req.body, userName);

  console.log('retriveFacultyData ====>>>>>>', retriveFacultyData);
  const statusCode = retriveFacultyData.status === "Done" ? 200 : (retriveFacultyData.errorCode ? 400 : 500);

  res.status(statusCode).send({
    status : retriveFacultyData.status,
    message : retriveFacultyData.message,
    exetrnalData : retriveFacultyData.exetrnalData,
    rowCount : retriveFacultyData.rowCount,
    errorCode : retriveFacultyData.errorCode ?retriveFacultyData.errorCode : null
  })



}

module.exports.deleteExternalFacultyData = async(req, res, next) => {
  console.log('data comming from frontend =====>>>>>>', req.body);

  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in controller  ===>>>>>>', userName);

  const deleteExternalFaculty = await researchConsultancyService.deleteExternalFacultyDetails(req.body, userName);

  console.log('deleteExternalFaculty ====>>>>>>', deleteExternalFaculty);
  const statusCode = deleteExternalFaculty.status === "Done" ? 200 : (deleteExternalFaculty.errorCode ? 400 : 500);

  res.status(statusCode).send({
    status : deleteExternalFaculty.status,
    message : deleteExternalFaculty.message,
    rowCount : deleteExternalFaculty.rowCount,
    errorCode : deleteExternalFaculty.errorCode ?deleteExternalFaculty.errorCode : null
  })



}


module.exports.deleteInternalFaculty = async(req, res, next) => {
  const  userName = req.body.username;
  console.log('Data Comming from Template' , req.body);
  console.log('userName ====>>>>>>', userName);

  const deleteSchoolStatus = await researchConsultancyService.deleteConsultantInternalFaculty(req.body, userName);

  console.log('deleteSchoolStatus ===>>>>>>', deleteSchoolStatus);
  const statusCode = deleteSchoolStatus.status === "Done" ? 200 : (deleteSchoolStatus.errorCode ? 400 : 500);
  res.status(statusCode).send({
      status : deleteSchoolStatus.status,
      message : deleteSchoolStatus.message,
      errorCode : deleteSchoolStatus.errorCode ? deleteSchoolStatus.errorCode : null
  })


}


function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
