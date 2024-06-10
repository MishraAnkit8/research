const conferencePublicationServices = require("../services/conference-publications.service");
const { getRedisData } = require('../../utils/redis.utils');
const { use } = require("../routes/book-publication-main.routes");

module.exports.renderConferencePage = async (req, res, next) => {
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in in dashboard controller  ===>>>>>>', userName);

  const conferenceData = await conferencePublicationServices.fetchConferencePublication(userName);

  console.log("conferenceData ====>>>>>", conferenceData);
  res.render("conference-publication", {
    status: "Done",
    conferenceData: conferenceData.conferenceDataList,
    rowCount: conferenceData.rowCount,
    internalEmpList: conferenceData.internalEmpList,
    userName : userName,
    internalFaculty: conferenceData.internalFaculty,
  });
};

module.exports.insertConferencePublicationSData = async (req, res, next) => {
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in in dashboard controller  ===>>>>>>', userName);
  console.log('data comming from template in controller =====>>>>>', req.body);


  console.log("files in controller ==>>>", req.files);
  const insertConferenceDataForm = await conferencePublicationServices.insertConferenceData(req.body, req.files,
      userName);

  console.log( "insertConferenceDataForm in controller ===>>>>",insertConferenceDataForm);

  const statusCode = insertConferenceDataForm.status === "Done" ? 200 : insertConferenceDataForm.errorCode ? 400 : 500;

  res.status(statusCode).send({
    status: insertConferenceDataForm.status,
    message: insertConferenceDataForm.message,
    conferenceId : insertConferenceDataForm.conferenceId,
    conferenceFacultiesIds : insertConferenceDataForm.conferenceFacultiesIds,
    conferenceDocument : insertConferenceDataForm.conferenceDocument,
    conferenceProofFile : insertConferenceDataForm.conferenceProofFile,
    rowCount : insertConferenceDataForm.rowCount,
    conferencePublications : insertConferenceDataForm.conferencePublications,
    errorCode : insertConferenceDataForm.errorCode ? insertConferenceDataForm.errorCode : null
  });
};

module.exports.deleteConferencePublication = async (req, res, next) => {
  const conferenceId = req.body;
  console.log("conferenceId in controller", conferenceId);
  const deleteConferenceRequest = await conferencePublicationServices.deleteConferencePublicationData(conferenceId);

  const statusCode = deleteConferenceRequest.status === "Done" ? 200 : deleteConferenceRequest.errorCode
      ? 400 : 500;

  res.status(statusCode).send({
    status: deleteConferenceRequest.status,
    message: deleteConferenceRequest.message,
    errorCode: deleteConferenceRequest.errorCode ? deleteConferenceRequest.errorCode : null,
  });
};

module.exports.updateConferencePublication = async (req, res, next) => {
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in in dashboard controller  ===>>>>>>', userName);

  const conferenceId = req.body.id;
  console.log("id for updation", conferenceId);
  console.log("files in side controller ==>>", req.files);
  console.log("data in controller for updation ==>>", req.body);
  const upadtedConferenceData = req.body;
  const updatedConference = await conferencePublicationServices.updatedConferencePublication(req.body, req.files, userName);
  
  console.log("updatedConference in controller ===>>>", updatedConference);

  const statusCode =  updatedConference.status === "Done" ? 200 : updatedConference.errorCode ? 400 : 500;
  res.status(statusCode).send({
    status: updatedConference.status,
    message: updatedConference.message,
    errorCode: updatedConference.errorCode ? updatedConference.errorCode : null
  });
};

module.exports.viewConferencePublication = async (req, res, next) => {
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in in dashboard controller  ===>>>>>>', userName);

  console.log("data Id in Controller", req.body);
  const { conferenceId } = req.body;

  const viewConferencePublicationData = await conferencePublicationServices.viewConferencePublication(conferenceId,
    userName
  );

  console.log("viewConferencePublicationData in controller ===>>>>", viewConferencePublicationData);
  const statusCode = viewConferencePublicationData.status === "Done" ? 200: viewConferencePublicationData.errorCode
      ? 400 : 500;

  res.status(statusCode).send({
    status: viewConferencePublicationData.status,
    message: viewConferencePublicationData.message,
    viewConferenceData: viewConferencePublicationData.viewConferenceData,
    facultyDetails: viewConferencePublicationData.facultyDetails,
    errorCode: viewConferencePublicationData.errorCode ? viewConferencePublicationData.errorCode : null,
  });
};


module.exports.deleteInternalId = async(req, res, next) => {
  console.log('data comming from frontend ======>>>>>', req.body);
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in controller  ===>>>>>>', userName);

  const deleteInternalFacultyDetails = await conferencePublicationServices.deleteInternalData(req.body, userName);
}



module.exports.retriveExternalDetails = async(req, res, next) => {
  console.log('data commimg from frontend ====>>>>>', req.body);
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in controller  ===>>>>>>', userName);

  const retriveFacultyData = await conferencePublicationServices.retriveExternalData(req.body, userName);

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

module.exports.deleteExternalFacultyDetails = async(req, res, next) => {
  console.log('data comming from frontend =====>>>>>>', req.body);

  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in controller  ===>>>>>>', userName);

  const deleteExternalFaculty = await conferencePublicationServices.deleteExternalFacultyDetails(req.body, userName);

  console.log('deleteExternalFaculty ====>>>>>>', deleteExternalFaculty);
  const statusCode = deleteExternalFaculty.status === "Done" ? 200 : (deleteExternalFaculty.errorCode ? 400 : 500);

  res.status(statusCode).send({
    status : deleteExternalFaculty.status,
    message : deleteExternalFaculty.message,
    rowCount : deleteExternalFaculty.rowCount,
    errorCode : deleteExternalFaculty.errorCode ?deleteExternalFaculty.errorCode : null
  })



}
