const facultyServices = require("../services/external-faculty-services");

module.exports.insertExternalFacultyDetails = async (req, res, next) => {
  console.log("data comming from frontend ===>>>>>", req.body);

  const insertFacultyDetails = await facultyServices.insertExternalDetails(
    req.body
  );

  console.log("insertFacultyDetails ====>>>>>>", insertFacultyDetails);
  const statusCode =
    insertFacultyDetails.status === "Done"
      ? 200
      : insertFacultyDetails.errorCode
      ? 400
      : 500;
  res.status(statusCode).send({
    status: insertFacultyDetails.status,
    message: insertFacultyDetails.message,
    facultyData: insertFacultyDetails.facultyData,
    externalFacultyId: insertFacultyDetails.externalFacultyId,
    rowCount: insertFacultyDetails.rowCount,
    errorCode: insertFacultyDetails.errorCode
      ? insertFacultyDetails.errorCode
      : null,
  });
};

module.exports.updateExternalFacultyDetails = async (req, res, next) => {
  console.log("data comming from ejs", req.body);

  const upsertFacultyDetails = await facultyServices.upsertFacultyDetails(
    req.body
  );
  const statusCode =
    upsertFacultyDetails.status === "Done"
      ? 200
      : upsertFacultyDetails.errorCode
      ? 400
      : 500;

  res.status(statusCode).send({
    status: upsertFacultyDetails.status,
    message: upsertFacultyDetails.message,
    facultyData: upsertFacultyDetails.facultyData,
    externalFacultyId: upsertFacultyDetails.externalFacultyId,
    researchGrantId: upsertFacultyDetails.researchGrantId,
    errorCode: upsertFacultyDetails.errorCode
      ? upsertFacultyDetails.errorCode
      : null,
  });
};

module.exports.updateFaculyDetails = async (req, res, next) => {
  console.log("body string ", JSON.stringify(req.body));
  const upsertFacultyDetails = await facultyServices.updateFaculyDetails(
    req.body
  );
  const statusCode =
    upsertFacultyDetails.status === "Done"
      ? 200
      : upsertFacultyDetails.errorCode
      ? 400
      : 500;

  res.status(statusCode).send({
    status: upsertFacultyDetails.status,
    message: upsertFacultyDetails.message,
    errorCode: upsertFacultyDetails.errorCode
      ? upsertFacultyDetails.errorCode
      : null,
  });
};
