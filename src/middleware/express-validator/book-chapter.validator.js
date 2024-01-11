// const { check } = require("express-validator");
// const { validationHandler } = require("./validation.handler");

// //check if value is an integer
// const isInt = (value) => {
//   if (value && isNaN(value)) {
//     return false;
//   }
//   return true;
// };

// // validate org insert
// module.exports.validateBookChapter = [
//   check("bookChapter", "No data to be inserted.")
//     .notEmpty()
//     .withMessage("bookChapter should not be empty"),

//   check("bookChapter.authorFirstName")
//     .notEmpty()
//     .withMessage("author first name  required")
//     .bail()
//     .isString()
//     .withMessage("author first name should be string")
//     .isLength({ min: 2 }),

//  check("bookChapter.authorLastName")
//     .notEmpty()
//     .withMessage("author last name is required")
//     .bail()
//     .isString()
//     .withMessage("author last name should be string")
//     .isLength({ min: 2 }), 

//  check("bookChapter.bookTitle")
//     .notEmpty()
//     .withMessage("book title is required")
//     .bail()
//     .isString()
//     .withMessage(" book title  should be string")
//     .isLength({ min: 5 }), 
     
//  check("bookChapter.edition")
//     .notEmpty()
//     .withMessage("edition is required")
//     .bail()
//     .isAlphanumeric()
//     .withMessage("edition  should be alphaNumeric"),

//  check("bookChapter.isbnNo")
//     .notEmpty()
//     .withMessage("isbn no is required")
//     .bail()
//     .isInt()
//     .withMessage("isbn no should be integer"),

//  check("bookChapter.editorName")
//     .notEmpty()
//     .withMessage("editor name is required")
//     .bail()
//     .isString()
//     .withMessage("editor name should be string")
//     .isLength({ min: 2 }),

//  check("bookChapter.chapterTitle")
//     .notEmpty()
//     .withMessage("chapter title is required")
//     .bail()
//     .isString()
//     .withMessage("chapter title should be string")
//     .isLength({ min : 5 }),
 
//  check("bookChapter.volumeNumber")
//     .notEmpty()
//     .withMessage("volume number count is required")
//     .bail()
//     .isInt()
//     .withMessage("volume number should be integer"),
    
//  check("bookChapter.publisherCategory")
//     .notEmpty()
//     .withMessage("publisher category  is required"),
    
//  check("bookChapter.pageNumber")
//     .notEmpty()
//     .withMessage("page number is required")
//     .bail()
//     .isInt()
//     .withMessage("page numberr  should be integer"),

//  check("bookChapter.publisherName")
//     .notEmpty()
//     .withMessage("publisher name is required")
//     .bail()
//     .isString()
//     .withMessage("publisher name should be string")
//     .isLength({ min: 2 }), 

//  check("bookChapter.publicationYear")
//     .notEmpty()
//     .withMessage("publication year is required")
//     .bail()
//     .isInt()
//     .withMessage("publication year should be integer"),

//  check("bookChapter.bookUrl")
//     .notEmpty()
//     .withMessage("book url is required")
//     .bail()
//     .isString()
//     .withMessage("book url should be string")
//     .isLength({ min : 5 }),
    
//  check("bookChapter.doiBookId")
//     .notEmpty()
//     .withMessage("doi book id is required")
//     .bail()
//     .bail()
//     .isInt()
//     .withMessage("doi book id should be integer"),
    
//  check("bookChapter.numberOfNmimsAuthors")
//     .notEmpty()
//     .withMessage("number of nmims authors is required")
//     .bail()
//     .isInt()
//     .withMessage("number of nmims authors  should be integer"),

//  check("bookChapter.nmimsAuthors")
//     .notEmpty()
//     .withMessage("nmims authors is required")
//     .bail()
//     .isString()
//     .withMessage("nmims authors is should be integer")
//     .isLength({ min : 2 }),
    
//  check("bookChapter.nmimsCampusAuthors")
//     .notEmpty()
//     .withMessage("nmims campus authors is required")
//     .bail()
//     .isString()
//     .withMessage("nmims campus authors should be integer")
//     .isLength({min : 5}),

//  check("bookChapter.nmimsSchoolAuthors")
//     .notEmpty()
//     .withMessage("nmims school authors is required")
//     .bail()
//     .isString()
//     .withMessage("webLink  should be string"),

//   validationHandler, // Handler for validation errors
// ];
