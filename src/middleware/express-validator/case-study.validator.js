const { check } = require("express-validator");
const { validationHandler } = require("./validation.handler");

//check if value is an integer
const isInt = (value) => {
  if (value && isNaN(value)) {
    return false;
  }
  return true;
};

// validate org insert
module.exports.validateCaseStudy = [
  check("caseStudyData", "No data to be inserted.")
    .notEmpty()
    .withMessage("caseStudyData should not be empty"),

  check("caseStudyData.authorsFirstName")
    .notEmpty()
    .withMessage("First name is required")
    .bail()
    .isString()
    .withMessage("First name should be string")
    .isLength({ min: 2 }), 

 check("caseStudyData.authorLastName")
    .notEmpty()
    .withMessage("last name is required")
    .bail()
    .isString()
    .withMessage("last name should be string")
    .isLength({ min: 2 }), 

 check("caseStudyData.titleOfCaseStudy")
    .notEmpty()
    .withMessage("case study title is required")
    .bail()
    .isString()
    .withMessage("title  should be string")
    .isLength({ min: 5 }), 
     
 check("caseStudyData.edition")
    .notEmpty()
    .withMessage("case study edition is required")
    .bail()
    .isAlphanumeric()
    .withMessage("edition  should be alphanumeric"),

 check("caseStudyData.volumeNumber")
    .notEmpty()
    .withMessage("case study volumeNumber is required")
    .bail()
    .isInt()
    .withMessage("pageNumber should be integer"),

 check("caseStudyData.publisherName")
    .notEmpty()
    .withMessage("case study publisherName is required")
    .bail()
    .isString()
    .withMessage("publisher name should be string")
    .isLength({ min: 2 }),

 check("caseStudyData.publicationYear")
    .notEmpty()
    .withMessage("case study publicationYear is required")
    .bail()
    .isInt()
    .withMessage("publication year should be integer"),
 
 check("caseStudyData.pageNumber")
    .notEmpty()
    .withMessage("case study pageNumber is required")
    .bail()
    .isInt()
    .withMessage("pageNumber should be integer"),

 check("caseStudyData.urlOfCaseStudy")
    .notEmpty()
    .withMessage("case study url of casestudy  is required")
    .bail()
    .isString()
    .withMessage("title  should be string")
    .isLength({ min: 5 }), 
    
 check("caseStudyData.numberOfNmimsAuthors")
    .notEmpty()
    .withMessage("case study number of nmims authors  is required")
    .bail()
    .bail()
    .isInt()
    .withMessage("number of nmims authors  should be integer"),
    
 check("caseStudyData.nmimsAuthors")
    .notEmpty()
    .withMessage("nmims authors is required")
    .bail()
    .isString()
    .withMessage("nmims authors  should be string")
    .isLength({ min: 2 }), 

 check("caseStudyData.nmimsCampusAuthors")
    .notEmpty()
    .withMessage("nmims campus  authors is required")
    .bail()
    .isString()
    .withMessage("nmims campus  should be string")
    .isLength({ min: 2 }), 

 check("caseStudyData.nmimsSchoolAuthors")
    .notEmpty()
    .withMessage("nmims school  authors is required")
    .bail()
    .isString()
    .withMessage("nmims school  should be string")
    .isLength({ min: 2 }), 
    
  validationHandler, // Handler for validation errors
];
