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
module.exports.validateResearchSeminar = [
  check("seminarDetails", "No data to be inserted.")
    .notEmpty()
    .withMessage("seminarDetails should not be empty"),

  check("seminarDetails.year")
    .notEmpty()
    .withMessage("year  required")
    .bail()
    .isInt()
    .withMessage("year shuold be integer"),

 check("seminarDetails.school")
    .notEmpty()
    .withMessage("school name is required")
    .bail()
    .isString()
    .withMessage("school name should be string")
    .isLength({ min: 2 }), 

 check("seminarDetails.campus")
    .notEmpty()
    .withMessage("campus is required")
    .bail()
    .isString()
    .withMessage(" journal paper campus  should be string")
    .isLength({ min: 5 }), 
     
 check("seminarDetails.policyCadre")
    .notEmpty()
    .withMessage("policy cadre is required")
    .bail()
    .isString()
    .withMessage("policy cadre  should be string"),

 check("seminarDetails.researchType")
    .notEmpty()
    .withMessage("research type is required")
    .bail()
    .isString()
    .withMessage("researchType should be string"),

 check("seminarDetails.allAuthors")
    .notEmpty()
    .withMessage("all authors is required")
    .bail()
    .isString()
    .withMessage("all Authors name should be string")
    .isLength({ min: 2 }),

 check("seminarDetails.totalAuthors")
    .notEmpty()
    .withMessage("total authors is required")
    .bail()
    .isInt()
    .withMessage("total authors should be integer"),
 
 check("seminarDetails.nmimsAuthors")
    .notEmpty()
    .withMessage("nmims authors is required")
    .bail()
    .isString()
    .withMessage("nmims authors should be string")
    .isLength({ min: 2 }),

 check("seminarDetails.nmimsAuthorsCount")
    .notEmpty()
    .withMessage("nmims authors count is required")
    .bail()
    .isInt()
    .withMessage("nmims authors count should be integer"),
    
 check("seminarDetails.countOtherFaculty")
    .notEmpty()
    .withMessage("count other faculty  is required")
    .bail()
    .bail()
    .isInt()
    .withMessage("count other faculty should be integer"),
    
 check("seminarDetails.titleOfPaper")
    .notEmpty()
    .withMessage("title of paper is required")
    .bail()
    .isString()
    .withMessage("title of paper  should be string")
    .isLength({ min: 2 }), 

 check("seminarDetails.journalName")
    .notEmpty()
    .withMessage("journal name is required")
    .bail()
    .isString()
    .withMessage("journal name should be string")
    .isLength({ min: 2 }), 

 check("seminarDetails.publisher")
    .notEmpty()
    .withMessage("publisher is required")
    .bail()
    .isString()
    .withMessage("publisher  should be string")
    .isLength({ min: 2 }), 

    check("seminarDetails.volume")
    .notEmpty()
    .withMessage("volume is required")
    .bail()
    .isInt()
    .withMessage("volume should be integer"),
    
 check("seminarDetails.iss")
    .notEmpty()
    .withMessage("iss is required")
    .bail()
    .bail()
    .isInt()
    .withMessage("iss should be integer"),
    
 check("seminarDetails.pages")
    .notEmpty()
    .withMessage("pages is required")
    .bail()
    .isInt()
    .withMessage("pages  should be integer"),

 check("seminarDetails.issnNo")
    .notEmpty()
    .withMessage("issn No is required")
    .bail()
    .isInt()
    .withMessage("issn  should be integer"),

 check("seminarDetails.dateOfPublishing")
    .notEmpty()
    .withMessage(" date of publishing is required")
    .bail()
    .isInt()
    .withMessage("date of publishing should be integer"), 

    check("seminarDetails.impactFactor")
    .notEmpty()
    .withMessage("impact factor is required")
    .bail()
    .isString()
    .withMessage("impact factor  should be string")
    .isLength({ min: 2 }), 

    check("seminarDetails.scsCiteScore")
    .notEmpty()
    .withMessage("scs cite score is required")
    .bail()
    .isInt()
    .withMessage("scs cite score should be integer"),
    
 check("seminarDetails.scsIndexed")
    .notEmpty()
    .withMessage("scs indexed is required")
    .bail()
    .isInt()
    .withMessage("scs indexed should be integer"),
    
 check("seminarDetails.wosIndexed")
    .notEmpty()
    .withMessage("wos indexed is required")
    .bail()
    .isInt()
    .withMessage("wos indexed  should be integer"),

 check("seminarDetails.gsIndexed")
    .notEmpty()
    .withMessage("gs indexed is required")
    .bail()
    .isInt()
    .withMessage("gs indexed  should be integer"),

 check("seminarDetails.abcdIndexed")
    .notEmpty()
    .withMessage("abcd indexedis required")
    .bail()
    .isInt()
    .withMessage("abcd indexed should be integer"), 

    check("seminarDetails.ugcIndexed")
    .notEmpty()
    .withMessage("ugc indexed is required")
    .bail()
    .bail()
    .isInt()
    .withMessage("ugc indexed should be integer"),
    
 check("seminarDetails.webLink")
    .notEmpty()
    .withMessage("webLink is required")
    .bail()
    .isString()
    .withMessage("webLink  should be string"),

 check("seminarDetails.uid")
    .notEmpty()
    .withMessage("uid is required")
    .bail()
    .isInt()
    .withMessage("uid should be integer"),

  validationHandler, // Handler for validation errors
];
