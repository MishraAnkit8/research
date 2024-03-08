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
module.exports.validateJournalPaper = [
  check("journalDetails", "No data to be inserted.")
    .notEmpty()
    .withMessage("journalDetails should not be empty"),

  check("journalDetails.year")
    .notEmpty()
    .withMessage("year  required")
    .bail()
    .isInt()
    .withMessage("year shuold be integer"),

 check("journalDetails.school")
    .notEmpty()
    .withMessage("school name is required")
    .bail()
    .isString()
    .withMessage("school name should be string")
    .isLength({ min: 2 }), 

 check("journalDetails.campus")
    .notEmpty()
    .withMessage("campus is required")
    .bail()
    .isString()
    .withMessage(" journal paper campus  should be string")
    .isLength({ min: 2 }), 
     
 check("journalDetails.policyCadre")
    .notEmpty()
    .withMessage("policy cadre is required")
    .bail()
    .isString()
    .withMessage("policy cadre  should be string"),

 check("journalDetails.journalCategory")
    .notEmpty()
    .withMessage("journal Category is required")
    .bail()
    .isString()
    .withMessage("researchType should be string"),

 check("journalDetails.allAuthors")
    .notEmpty()
    .withMessage("all authors is required")
    .bail()
    .isString()
    .withMessage("all Authors name should be string")
    .isLength({ min: 2 }),

 check("journalDetails.totalAuthors")
    .notEmpty()
    .withMessage("total authors is required")
    .bail()
    .isInt()
    .withMessage("total authors should be integer"),
 
 check("journalDetails.nmimsAuthors")
    .notEmpty()
    .withMessage("nmims authors is required")
    .bail()
    .isString()
    .withMessage("nmims authors should be string")
    .isLength({ min: 2 }),

 check("journalDetails.nmimsAuthorsCount")
    .notEmpty()
    .withMessage("nmims authors count is required")
    .bail()
    .isInt()
    .withMessage("nmims authors count should be integer"),
    
 check("journalDetails.countOtherFaculty")
    .notEmpty()
    .withMessage("count other faculty  is required")
    .bail()
    .bail()
    .isInt()
    .withMessage("count other faculty should be integer"),
    
 check("journalDetails.titleOfPaper")
    .notEmpty()
    .withMessage("title of paper is required")
    .bail()
    .isString()
    .withMessage("title of paper  should be string")
    .isLength({ min: 2 }), 

 check("journalDetails.journalName")
    .notEmpty()
    .withMessage("journal name is required")
    .bail()
    .isString()
    .withMessage("journal name should be string")
    .isLength({ min: 2 }), 

 check("journalDetails.publisher")
    .notEmpty()
    .withMessage("publisher is required")
    .bail()
    .isString()
    .withMessage("publisher  should be string")
    .isLength({ min: 2 }), 

 check("journalDetails.pages")
    .notEmpty()
    .withMessage("pages is required")
    .bail()
    .isInt()
    .withMessage("pages  should be integer"),

 check("journalDetails.issnNo")
    .notEmpty()
    .withMessage("issn No is required")
    .bail()
    .isInt()
    .withMessage("issn  should be integer"),

 check("journalDetails.dateOfPublishing")
    .notEmpty()
    .withMessage(" date of publishing is required")
    .bail()
    .isDate()
    .withMessage("date of publishing sholud not be empty"), 

    check("journalDetails.impactFactor")
    .notEmpty()
    .withMessage("impact factor is required")
    .bail()
    .isString()
    .withMessage("impact factor  should be string")
    .isLength({ min: 2 }), 

    check("journalDetails.scsCiteScore")
    .notEmpty()
    .withMessage("scs cite score is required")
    .bail()
    .isInt()
    .withMessage("scs cite score should be integer"),
    
 check("journalDetails.scsIndexedCategory")
    .notEmpty()
    .withMessage("scs indexed category is required")
    .bail()
    .isString()
    .withMessage("scs indexed category should be string"),
    
 check("journalDetails.wosIndexedCategory")
    .notEmpty()
    .withMessage("wos indexed catgory is required")
    .bail()
    .isString()
    .withMessage("wos indexed catgory  should be String"),

 check("journalDetails.foreignAuthors")
    .notEmpty()
    .withMessage("foreign authors  is required")
    .bail()
    .isString()
    .withMessage("foreign authors should be String"),

 check("journalDetails.abdcIndexedCategory")
    .notEmpty()
    .withMessage("abcd indexed category  required")
    .bail()
    .isString()
    .withMessage("abcd indexed category should be String"), 

    check("journalDetails.ugcIndexedCategory")
    .notEmpty()
    .withMessage("ugc indexed category is required")
    .bail()
    .bail()
    .isString()
    .withMessage("ugc indexed category should be integer"),
    
 check("journalDetails.webLinkNumber")
    .notEmpty()
    .withMessage("webLinkNumber is required")
    .bail()
    .isInt()
    .withMessage("webLinkNumber  should be Number"),

 check("journalDetails.foreignAuthorsNumbers")
    .notEmpty()
    .withMessage("foreignAuthorsNumbers is required")
    .bail()
    .isInt()
    .withMessage("foreignAuthorsNumbers should be integer"),

check("journalDetails.nmimsStudentAuthors")
    .notEmpty()
    .withMessage("Names of NMIMS Student  Author is required")
    .bail()
    .isString()
    .withMessage("Names of NMIMS Student  Author  should be Number"),

 check("journalDetails.countStudentAuthors")
    .notEmpty()
    .withMessage("NO. OF NMIMS Student  Authors is required")
    .bail()
    .isInt()
    .withMessage("NO. OF NMIMS Student  Authors should be integer"),

  validationHandler, // Handler for validation errors
];
