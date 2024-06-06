const patentSubmissionservice = require("../services/patent-submission.service");
const { getRedisData } = require('../../utils/redis.utils');

module.exports.renderPatentSubMissionAndGrant = async (req, res, next) => {
  console.log("data in controller ");
  const userName = req.body.username;
  console.log("userName in controller  ===>>>>>>", userName);

  const patentSubmissionList = await patentSubmissionservice.fetchPatentForm(userName);

  console.log('patentSubmissionList =====>>>>>>>>', patentSubmissionList.patentSubmissionsData);
 
    res.render("patent-submission", {
    status: patentSubmissionList.status,
    message: patentSubmissionList.message,
    rowCount: patentSubmissionList.rowCount,
    patentStagData: patentSubmissionList.patentStagData,
    patentSubmissionsData: patentSubmissionList.patentSubmissionsData,
    internalFacultyData: patentSubmissionList.internalFacultyData,
    patentSdgGoalData: patentSubmissionList.patentSdgGoalData,
    patentInventionTypeData: patentSubmissionList.patentInventionTypeData,
    userName : userName,
    errorCode: patentSubmissionList.errorCode,
  });
};

module.exports.insertPatentsubmission = async (req, res, next) => {
  console.log("patentData in Controller", req.body);
  console.log("patentFilesData ===>>>>::::", req.files);
  const userName = req.body.username;
  console.log("userName in controller  ===>>>>>>", userName);

  const patentDataSubmission = await patentSubmissionservice.insertPatentFormData(req.body, req.files, userName);

  console.log("patentDataSubmission ===>>>>", patentDataSubmission);

  const statusCode = patentDataSubmission.status === "Done" ? 200 : patentDataSubmission.errorCode ? 400 : 500;

  res.status(statusCode).send({
    status: patentDataSubmission.status,
    message: patentDataSubmission.message,
    patentId : patentDataSubmission.patentId,
    patentFacultyIds : patentDataSubmission.patentFacultyIds,
    patentSdgGoalsIds : patentDataSubmission.patentSdgGoalsIds,
    patentInventionIds : patentDataSubmission.patentInventionIds,
    patentSatausIds : patentDataSubmission.patentSatausIds,
    rowCount : patentDataSubmission.rowCount,
    errorCode: patentDataSubmission.errorCode ? patentDataSubmission.errorCode : null,
  });
};

// for update patent submission
module.exports.updatePatentSubMissiom = async (req, res, next) => {
  console.log("data in controller", req.body);
  console.log("ID in controller ==>", req.body.patentId);
  const userName = req.body.username;
  console.log("userName in controller  ===>>>>>>", userName);

  const patentId = req.body.patentId;

  const updatedPatentSubmissionData = await patentSubmissionservice.updatPatentSubmission(req.body, patentId, req.files,
    userName);

  console.log("updatedPatentSubmissionData in controller ====>>>>>",updatedPatentSubmissionData);

  const statusCode = updatedPatentSubmissionData.status === "Done" ? 200 : updatedPatentSubmissionData.errorCode
      ? 400 : 500;
  res.status(statusCode).send({
    status: "Done",
    message: updatedPatentSubmissionData.message,
    // patentDataFiles: updatedPatentSubmissionData.patentDataFiles,
    // patentId: updatedPatentSubmissionData.patentId,
    // patentStageId: updatedPatentSubmissionData.patentStageId,
    // patentGrantIds: updatedPatentSubmissionData.patentGrantIds,
    // inventionTypeIds: updatedPatentSubmissionData.inventionTypeIds,
    // sdgGoalsIds: updatedPatentSubmissionData.sdgGoalsIds,
    // updatedPatentData: updatedPatentSubmissionData.updatedPatentData,
    errorCode: updatedPatentSubmissionData.errorCode ? updatedPatentSubmissionData.errorCode : null,
  });
};

module.exports.deletePatentData = async (req, res, next) => {
  const patentId = req.body;
  console.log("patentId ===>>>>>", patentId);

  const deletePatentsubMission =
    await patentSubmissionservice.deletePatentSubmission(patentId);

  console.log(
    "deletePatentsubMission in controller ===>>>",
    deletePatentsubMission
  );

  const statusCode =
    deletePatentsubMission.status === "Done"
      ? 200
      : deletePatentsubMission.errorCode
      ? 400
      : 500;
  res.status(statusCode).send({
    status: deletePatentsubMission.status,
    message: deletePatentsubMission.message,
    errorCode: deletePatentsubMission.errorCode
      ? deletePatentsubMission.errorCode
      : null,
  });
};

module.exports.viewPatentSubmissionData = async (req, res, next) => {
  const userName = req.body.username;
  console.log("userName in controller  ===>>>>>>", userName);

  const { patentId } = req.body;
  console.log("patentId in controller  ===>>>>", patentId);

  const viewPatentsubmissionData =
    await patentSubmissionservice.viewPatentsubmission(patentId, userName);

  console.log("viewPatentsubmissionData ====>>>>>>", viewPatentsubmissionData);

  const statusCode =
    viewPatentsubmissionData.status === "Done"
      ? 200
      : viewPatentsubmissionData.errorCode
      ? 400
      : 500;
  res.status(statusCode).send({
    status: viewPatentsubmissionData.status,
    message: viewPatentsubmissionData.message,
    facultyData: viewPatentsubmissionData.facultyData,
    sdgGoalsData: viewPatentsubmissionData.sdgGoalsData,
    inventionTypeData: viewPatentsubmissionData.inventionTypeData,
    patentSubmissionsData: viewPatentsubmissionData.patentSubmissionsData,
    errorCode: viewPatentsubmissionData.errorCode
      ? viewPatentsubmissionData.errorCode
      : null,
  });
};


module.exports.retriveExternalDetails = async(req, res, next) => {
  console.log('data commimg from frontend ====>>>>>', req.body);
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in controller  ===>>>>>>', userName);

  const retriveFacultyData = await patentSubmissionservice.retriveExternalData(req.body, userName);

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


module.exports.deletePatentInvetionType = async(req, res, next) => {
  console.log('data comming from frontend ======>>>>>', req.body);
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in controller  ===>>>>>>', userName);

  const deleteInvetion = await patentSubmissionservice.deletePatentInvention(req.body, userName);
  const statusCode = deleteInvetion.status === "Done" ? 200 : deleteInvetion.errorCode ? 400 : 500;
res.status(statusCode).send({
  status: deleteInvetion.status,
  message: deleteInvetion.message,
  errorCode: deleteInvetion.errorCode ? deleteInvetion.errorCode : null,
});
}


module.exports.detelePatentStatus = async(req, res, next) => {
  console.log('data comming from frontend ======>>>>>', req.body);
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in controller  ===>>>>>>', userName);

  const deletePatentStage = await patentSubmissionservice.deletePatentStage(req.body, userName);
  const statusCode = deletePatentStage.status === "Done" ? 200 : deletePatentStage.errorCode ? 400 : 500;
  res.status(statusCode).send({
    status: deletePatentStage.status,
    message: deletePatentStage.message,
    errorCode: deletePatentStage.errorCode ? deletePatentStage.errorCode : null,
  });
}


module.exports.deletePatentSdgGoals = async(req, res, next) => {
  console.log('data comming from frontend ======>>>>>', req.body);
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in controller  ===>>>>>>', userName);

  const deletePatentSdgGoals = await patentSubmissionservice.deletePatenGoals(req.body, userName);
  const statusCode = deletePatentSdgGoals.status === "Done" ? 200 : deletePatentSdgGoals.errorCode ? 400 : 500;
  res.status(statusCode).send({
    status: deletePatentSdgGoals.status,
    message: deletePatentSdgGoals.message,
    errorCode: deletePatentSdgGoals.errorCode ? deletePatentSdgGoals.errorCode : null,
  });
}

module.exports.deletePatentInternalFaculty = async(req, res, next) => {
  console.log('data comming from frontend ======>>>>>', req.body);
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in controller  ===>>>>>>', userName);

  const deleteInternalFacultyDetails = await patentSubmissionservice.deletePatentInternalFacultyData(req.body, userName);
  const statusCode = deleteInternalFacultyDetails.status === "Done" ? 200 : deleteInternalFacultyDetails.errorCode ? 400 : 500;
  res.status(statusCode).send({
    status: deleteInternalFacultyDetails.status,
    message: deleteInternalFacultyDetails.message,
    errorCode: deleteInternalFacultyDetails.errorCode ? deleteInternalFacultyDetails.errorCode : null,
  });
}

module.exports.deletePatentExternalFaculty = async(req, res, next) => {
  console.log('data comming from frontend =====>>>>>>', req.body);

  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in controller  ===>>>>>>', userName);

  const deleteExternalFaculty = await patentSubmissionservice.deleteExternalFacultyDetails(req.body, userName);

  console.log('deleteExternalFaculty ====>>>>>>', deleteExternalFaculty);
  const statusCode = deleteExternalFaculty.status === "Done" ? 200 : (deleteExternalFaculty.errorCode ? 400 : 500);

  res.status(statusCode).send({
    status : deleteExternalFaculty.status,
    message : deleteExternalFaculty.message,
    rowCount : deleteExternalFaculty.rowCount,
    errorCode : deleteExternalFaculty.errorCode ?deleteExternalFaculty.errorCode : null
  })



}


