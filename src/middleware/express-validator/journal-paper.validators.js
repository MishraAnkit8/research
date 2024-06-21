const { check } = require("express-validator");
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
      return false; // No files uploaded
    }
  
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel.sheet.macroenabled.12", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  
    for (const file of files) {
      if (!allowedTypes.includes(file.mimetype)) {
        return false; // File type not allowed
      }
  
      if (file.size > maxSizeInBytes) {
        return false; // File size exceeds the maximum allowed size
      }
    }
  
    return true; // All files are valid
  };
  

  const nmimsFields = [
    'nmimsSchoolIds',
    'nmimsCampusIds',
    'nmimsFacultiesIds',
    'allAuthorsIds',
    'policyCadreIds'
  ];

// validate org insert
module.exports.validateJournalPaper = [


...nmimsFields.map(field => (
        check(field)
          .notEmpty()
          .withMessage(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`)
          .bail()
          .custom(isStringifiedArray)
          .withMessage(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} should be a stringified array of IDs`)
      )),

check('year')
    .notEmpty()
    .withMessage('Year is required')
    .bail()
    .isInt({ min: 1900, max: 3000 })
    .withMessage('Year should be an integer between 1900 to 3000'),

 check('totalAuthors')
    .notEmpty()
    .withMessage('Total No. of Authors is required')
    .bail()
    .isInt()
    .withMessage('Total No. of Authors should be an integer'),

check('nmimsAuthorsCount')
    .notEmpty()
    .withMessage('No. of NMIMS Authors is required')
    .bail()
    .isInt()
    .withMessage('No. of NMIMS Authors should be an integer'),

check('uid')
    .notEmpty()
    .withMessage('UID is required')
    .bail()
    .isInt()
    .withMessage('UID should be an integer'),

check('journalName')
    .notEmpty()
    .withMessage('Journal Name is required')
    .bail()
    .isString()
    .withMessage('Journal Name should be a string')
    .isLength({ min: 2 }),

check('publisher')
    .notEmpty()
    .withMessage('Publisher is required')
    .bail()
    .isString()
    .withMessage('Publisher should be a string')
    .isLength({ min: 2 }),

check('titleOfPaper')
    .notEmpty()
    .withMessage('Title of paper is required')
    .bail()
    .isString()
    .withMessage('Title of paper should be a string')
    .isLength({ min: 2 }),


check('otherAuthorsNames')
        .optional({ checkFalsy: true })
        .isString()
        .withMessage('Names-Others Authors should be a string')
        .isLength({ min: 2 })
        .withMessage('Names-Others Authors should be at least 2 characters long'),

check('pages')
  .optional({ checkFalsy: true })
  .isString()
  .withMessage('Vol,Issue,Page No. should be a string')
  .isLength({ min: 2 }),

check('impactFactor')
    .notEmpty()
    .withMessage('Impact factor is required')
    .bail()
    .isDecimal()
    .withMessage('Impact factor Decimal'),

check('webLinkNumber')
    .notEmpty()
    .withMessage('WEB Link DOI is required')
    .bail()
    .isString()
    .withMessage('WEB Link DOI should be a string')
    .isLength({ min: 2 }),

check('dateOfPublishing')
    .notEmpty()
    .withMessage('Date of Publishing is required')
    .bail()
    .isDate()
    .withMessage('Date of Publishing should be a Date'),


check('pages')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Pages should be an string'),

check('gsIndex')
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage('GS Indexed be an integer'),


check('noNmimsStudentAuthor')
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage('No. of NMIMS student authors should be an integer'), 



  validationHandler,
];
