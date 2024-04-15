const facultyModels = require('../models/faculty-models');

module.exports.insertExternalDetails = async(body) => {
    console.log('body ===>>>>>>', body);
    const exetrnalFacultyDetails = body.externalFacultyDetails;
    console.log('exetrnalFacultyDetails in service ==>>>>', exetrnalFacultyDetails)

    const insertExternalData = await facultyModels.insertFacultyDetails(exetrnalFacultyDetails);

    console.log('insertExternalData ===>>>>>', insertExternalData)

    return insertExternalData.status === "Done" ? {
        status : insertExternalData.status,
        message : insertExternalData.message,
        externalFacultyId : insertExternalData.externalFacultyId,
        rowCount : insertExternalData.rowCount,
        facultyData : exetrnalFacultyDetails
    } : {
        status : insertExternalData.status,
        message : insertExternalData.message,
        errorCode : insertExternalData.errorCode
    }
}