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
    .isLength({ min: 5 }), 
     
 check("journalDetails.policyCadre")
    .notEmpty()
    .withMessage("policy cadre is required")
    .bail()
    .isString()
    .withMessage("policy cadre  should be string"),

 check("journalDetails.researchType")
    .notEmpty()
    .withMessage("research type is required")
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

    check("journalDetails.volume")
    .notEmpty()
    .withMessage("volume is required")
    .bail()
    .isInt()
    .withMessage("volume should be integer"),
    
 check("journalDetails.iss")
    .notEmpty()
    .withMessage("iss is required")
    .bail()
    .bail()
    .isInt()
    .withMessage("iss should be integer"),
    
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
    .isInt()
    .withMessage("date of publishing should be integer"), 

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
    
 check("journalDetails.scsIndexed")
    .notEmpty()
    .withMessage("scs indexed is required")
    .bail()
    .isInt()
    .withMessage("scs indexed should be integer"),
    
 check("journalDetails.wosIndexed")
    .notEmpty()
    .withMessage("wos indexed is required")
    .bail()
    .isInt()
    .withMessage("wos indexed  should be integer"),

 check("journalDetails.gsIndexed")
    .notEmpty()
    .withMessage("gs indexed is required")
    .bail()
    .isInt()
    .withMessage("gs indexed  should be integer"),

 check("journalDetails.abcdIndexed")
    .notEmpty()
    .withMessage("abcd indexedis required")
    .bail()
    .isInt()
    .withMessage("abcd indexed should be integer"), 

    check("journalDetails.ugcIndexed")
    .notEmpty()
    .withMessage("ugc indexed is required")
    .bail()
    .bail()
    .isInt()
    .withMessage("ugc indexed should be integer"),
    
 check("journalDetails.webLink")
    .notEmpty()
    .withMessage("webLink is required")
    .bail()
    .isString()
    .withMessage("webLink  should be string"),

 check("journalDetails.uid")
    .notEmpty()
    .withMessage("uid is required")
    .bail()
    .isInt()
    .withMessage("uid should be integer"),



  validationHandler, // Handler for validation errors
];
