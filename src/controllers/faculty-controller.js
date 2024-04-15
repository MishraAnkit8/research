
const facultyServices = require('../services/external-faculty-services');

module.exports.insertExternalFacultyDetails = async(req, res, next) => {
    console.log('data comming from frontend ===>>>>>', req.body)

    const insertFacultyDetails = await facultyServices.insertExternalDetails(req.body);

    console.log('insertFacultyDetails ====>>>>>>', insertFacultyDetails);
    const statusCode = insertFacultyDetails.status === "Done" ? 200 : (insertFacultyDetails.errorCode ? 400 : 500)
    res.status(statusCode).send({
        status : insertFacultyDetails.status,
        message : insertFacultyDetails.message,
        facultyData : insertFacultyDetails.facultyData,
        externalFacultyId : insertFacultyDetails.externalFacultyId,
        rowCount : insertFacultyDetails.rowCount,
        errorCode : insertFacultyDetails.errorCode ? insertFacultyDetails.errorCode : null
    })
}