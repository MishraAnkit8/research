const { check , body} = require("express-validator");
const { validationHandler } = require("./validation.handler");

//check if value is an integer
const isInt = (value) => {
  if (value && isNaN(value)) {
    return false;
  }
  return true;
};

// Custom validator to check if the stringified array contains valid IDs
const isStringifiedArray = (value) => {
    try {
      const parsed = JSON.parse(value);
      if (parsed && Object.values(parsed).length === 1) {
        const ids = Object.values(parsed)[0];
        return Array.isArray(ids) && ids.every(id => typeof id === 'string' || typeof id === 'number');
      }
      return false;
    } catch (e) {
      return false;
    }
  };

//   cunstom validation for file 
const isValidFile = (files) => {
    if (!files || files.length === 0) {
      return false; 
    }
  
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel.sheet.macroenabled.12", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  
    for (const file of files) {
      if (!allowedTypes.includes(file.mimetype)) {
        return false; 
      }
  
      if (file.size > maxSizeInBytes) {
        return false; 
      }
    }
  
    return true;
  };
  

//   const nmimsFields = [
//     'nmimsSchoolIds',
//     'nmimsCampusIds',
//     'nmimsFacultiesIds',
//     'allAuthorsIds',
//     'policyCadreIds'
//   ];

  const isEitherFacultyOrExternalFacultyProvided = (value, { req }) => {
    const facultyContainer = JSON.parse(req.body.facultyContainer || '[]');
    const externalFacultyDetails = JSON.parse(req.body.externalFacultyDetails || '[]');

    if (facultyContainer.length === 0 && externalFacultyDetails.length === 0) {
        throw new Error('Either facultyContainer or externalFacultyDetails must be provided.');
    }
    return true;
};



// validate org insert
module.exports.validateFaculty = [


    body()
    .custom(isEitherFacultyOrExternalFacultyProvided)
    .withMessage('Either facultyContainer or externalFacultyDetails must be provided'),


    

  validationHandler, // Handler for validation errors
];
