const facultyModels = require("../models/faculty-models");

module.exports.insertExternalDetails = async (body) => {
  console.log("body ===>>>>>>", body);
  const exetrnalFacultyDetails = body.externalFacultyDetails;
  console.log(
    "exetrnalFacultyDetails in service ==>>>>",
    exetrnalFacultyDetails
  );

  const insertExternalData = await facultyModels.insertFacultyDetails(
    exetrnalFacultyDetails
  );

  console.log("insertExternalData ===>>>>>", insertExternalData);

  return insertExternalData.status === "Done"
    ? {
        status: insertExternalData.status,
        message: insertExternalData.message,
        externalFacultyId: insertExternalData.externalFacultyId,
        rowCount: insertExternalData.rowCount,
        facultyData: exetrnalFacultyDetails,
      }
    : {
        status: insertExternalData.status,
        message: insertExternalData.message,
        errorCode: insertExternalData.errorCode,
      };
};

module.exports.upsertFacultyDetails = async (body) => {
  const externalFacultyDetails = body.externalFacultyDetails;
  const consultantId = body.consultantId;

  const upsertExternalData = await facultyModels.upsertFacultyDetails(
    externalFacultyDetails,
    consultantId
  );

  console.log("upsertExternalData ======>>>>>", upsertExternalData);

  return upsertExternalData.status === "Done" &&
    upsertExternalData.status === "Done"
    ? {
        status: upsertExternalData.status,
        message: upsertExternalData.message,
        externalFacultyId: upsertExternalData.externalFacultyId,
        researchGrantId: upsertExternalData.researchGrantId,
        facultyData: externalFacultyDetails,
      }
    : {
        status: upsertExternalData.status,
        message: upsertExternalData.message,
        errorCode: upsertExternalData.errorCode,
      };
};

module.exports.updateFaculyDetails = async (body) => {
  let facultyName = body.facultyName;
  let facultyId = body.facultyId;
  let facultyDesignation = body.facultyDesignation;
  let facultyAddr = body.facultyAddr;
  let empId = body.empId;

  const externalFacultyDetails = {
    facultyName,
    facultyId,
    facultyDesignation,
    facultyAddr,
    empId,
  };

  const upsertExternalData = await facultyModels.updateFaculyDetails(
    externalFacultyDetails
  );

  console.log("upsertExternalData ======>>>>>", upsertExternalData);

  return upsertExternalData.status === "Done" &&
    upsertExternalData.status === "Done"
    ? {
        status: upsertExternalData.status,
        message: upsertExternalData.message,
      }
    : {
        status: upsertExternalData.status,
        message: upsertExternalData.message,
        errorCode: upsertExternalData.errorCode,
      };
};

module.exports.fetchFacultyDetails = async (req, res) => {
  const fetchFacultyData = await facultyModels.fetchFaculty();

  return fetchFacultyData.status === "Done"
    ? {
        status: fetchFacultyData.status,

        message: fetchFacultyData.message,
        facultyData: fetchFacultyData.facultyData,
        rowCount: fetchFacultyData.rowCount,
      }
    : {
        status: insertExternalData.status,
        message: insertExternalData.message,
        errorCode: insertExternalData.errorCode,
      };
};



module.exports.facultyDataForConference = async (req, res) => {
  const fetchFacultyData = await facultyModels.fetchFacultyConference();

  return fetchFacultyData.status === "Done"
    ? {
        status: fetchFacultyData.status,

        message: fetchFacultyData.message,
        facultyData: fetchFacultyData.facultyData,
        rowCount: fetchFacultyData.rowCount,
      }
    : {
        status: insertExternalData.status,
        message: insertExternalData.message,
        errorCode: insertExternalData.errorCode,
      };
};

module.exports.facultyDataForIPR = async (req, res) => {
  const fetchFacultyData = await facultyModels.facultyDataForIPR();

  return fetchFacultyData.status === "Done"
    ? {
        status: fetchFacultyData.status,

        message: fetchFacultyData.message,
        facultyData: fetchFacultyData.facultyData,
        rowCount: fetchFacultyData.rowCount,
      }
    : {
        status: insertExternalData.status,
        message: insertExternalData.message,
        errorCode: insertExternalData.errorCode,
      };
};

module.exports.facultyDataForPatent = async (req, res) => {
  const fetchFacultyData = await facultyModels.facultyDataForPatent();

  return fetchFacultyData.status === "Done"
    ? {
        status: fetchFacultyData.status,

        message: fetchFacultyData.message,
        facultyData: fetchFacultyData.facultyData,
        rowCount: fetchFacultyData.rowCount,
      }
    : {
        status: insertExternalData.status,
        message: insertExternalData.message,
        errorCode: insertExternalData.errorCode,
      };
};

module.exports.insertFacultyPatent = async (body) => {
  const externalFacultyDetails = body.externalFacultyDetails;
  const patentId = body.patentId;

  const upsertExternalData = await facultyModels.insertFacultyPatent(
    externalFacultyDetails,
    patentId
  );

  return upsertExternalData.status === "Done" &&
    upsertExternalData.status === "Done"
    ? {
        status: upsertExternalData.status,
        message: upsertExternalData.message,
        externalFacultyId: upsertExternalData.externalFacultyId,
        researchGrantId: upsertExternalData.researchGrantId,
        facultyData: externalFacultyDetails,
      }
    : {
        status: upsertExternalData.status,
        message: upsertExternalData.message,
        errorCode: upsertExternalData.errorCode,
      };
};

module.exports.insertFacultyConference = async (body) => {
  const externalFacultyDetails = body.externalFacultyDetails;
  const conferenceId = body.conferenceId;

  const upsertExternalData = await facultyModels.insertFacultyConference(
    externalFacultyDetails,
    conferenceId
  );

  return upsertExternalData.status === "Done" &&
    upsertExternalData.status === "Done"
    ? {
        status: upsertExternalData.status,
        message: upsertExternalData.message,
        externalFacultyId: upsertExternalData.externalFacultyId,
        researchGrantId: upsertExternalData.researchGrantId,
        facultyData: externalFacultyDetails,
      }
    : {
        status: upsertExternalData.status,
        message: upsertExternalData.message,
        errorCode: upsertExternalData.errorCode,
      };
};

module.exports.insertFacultyIpr = async (body) => {
  const externalFacultyDetails = body.externalFacultyDetails;
  const iprId = body.iprId;

  const upsertExternalData = await facultyModels.insertFacultyIpr(
    externalFacultyDetails,
    iprId
  );

  return upsertExternalData.status === "Done" &&
    upsertExternalData.status === "Done"
    ? {
        status: upsertExternalData.status,
        message: upsertExternalData.message,
        externalFacultyId: upsertExternalData.externalFacultyId,
        researchGrantId: upsertExternalData.researchGrantId,
        facultyData: externalFacultyDetails,
      }
    : {
        status: upsertExternalData.status,
        message: upsertExternalData.message,
        errorCode: upsertExternalData.errorCode,
      };
};
