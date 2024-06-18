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
  


// validate org insert
module.exports.validateBookChapter = [
check('authorName')
    .notEmpty()
    .withMessage('All authors names is required')
    .bail()
    .isString()
    .withMessage('All authors names should be a string')
    .isLength({ min: 2 }),

check('nmimsSchoolAuthors')
    .notEmpty()
    .withMessage('NMIMS School - Author  is required')
    .bail()
    .isString()
    .withMessage('NMIMS School - Author should be a string')
    .isLength({ min: 2 }),

check('nmimsCampusAuthors')
    .notEmpty()
    .withMessage('NMIMS Campus - Author  is required')
    .bail()
    .isString()
    .withMessage('NMIMS Campus - Author  should be a string')
    .isLength({ min: 2 }),

check('chapterTitle')
    .notEmpty()
    .withMessage('Title Of Chapter  is required')
    .bail()
    .isString()
    .withMessage('Title Of Chapter should be a string')
    .isLength({ min: 2 }),

check('bookTitle')
    .notEmpty()
    .withMessage('Title Of The Book   is required')
    .bail()
    .isString()
    .withMessage('Title Of The Book  should be a string')
    .isLength({ min: 2 }),

 check('edition')
    .notEmpty()
    .withMessage('Edition is required')
    .bail()
    .isAlphanumeric()
    .withMessage('Edition should be combination of alphanumeric '),

check('publisherName')
    .notEmpty()
    .withMessage('Publisher Name is required')
    .bail()
    .isString()
    .withMessage('Publisher Name should be a string'),

check('publisherCategory')
    .notEmpty()
    .withMessage('Publisher Category required')
    .bail()
    .isString()
    .withMessage('Publisher Category should be a string'),

check('publicationYear')
    .notEmpty()
    .withMessage('Publication Year is required')
    .bail()
    .isInt({ min: 1900, max: 3000 })
    .withMessage('Publication Year should be an integer between 1900 to 3000'),

check('isbnNo')
    .notEmpty()
    .withMessage('ISBN Number is required')
    .bail()
    .isString()
    .withMessage('ISBN Number should be astring'),

check('volumeNumber')
    .notEmpty()
    .withMessage('Volume Number  is required')
    .bail()
    .isString()
    .withMessage('Volume Number  should be astring'),

check('doiBookId')
    .notEmpty()
    .withMessage('Weblink Of the Book is required')
    .bail()
    .isString()
    .withMessage('Weblink Of the Book should be a string'),


check('bookEditor')
    .notEmpty()
    .withMessage('Editor(s) Of The Book required')
    .bail()
    .isString()
    .withMessage('Editor(s) Of The Book should be a string'),

check('bookUrl')
    .notEmpty()
    .withMessage('Weblink Of the Book required')
    .bail()
    .isString()
    .withMessage('Weblink Of the Book should be a string'),


check('numberOfNmimsAuthors')
    .notEmpty()
    .withMessage('No. Of NMIMS Authors is required')
    .bail()
    .isInt()
    .withMessage('No. Of NMIMS Authors should be an integer'), 

check('pageNumber')
    .notEmpty()
    .withMessage('Page numbers Of The Chapter is required')
    .bail()
    .isString()
    .withMessage('Page numbers Of The Chapter should be string')
    .isLength({ min : 2}),


check('nmimsAuthors')
    .notEmpty()
    .withMessage('Name of NMIMS Authors is required')
    .bail()
    .isString()
    .withMessage('Name of NMIMS Authors should be a string')
    .isLength({ min: 2 }),

  validationHandler, // Handler for validation errors
];
