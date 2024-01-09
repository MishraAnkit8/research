const { check } = require('express-validator');
const { invalidRequestError } = require('../../utils/error/error.handler');
const { validationHandler } = require('./validation.handler');


// if orgTypeLid is 5(Supplier) then serviceTypeLid is required
const validateServiceType = (value, { req }) => {
    let count = 0;

    return (value, { req }) => {
        let caseStudyData = req.check.caseStudyData;
        let orgTypeLid = caseStudyData[count].orgTypeLid;
        let serviceTypeLid = caseStudyData[count].serviceTypeLid;

        count++;
        if (orgTypeLid === 5 && !serviceTypeLid) {
            return false;
        }
        return true;
    };
};



//check if value is an integer
const isInt = (value) => {
    if (value && isNaN(value)) {
        return false;
    }
    return true;
};

// validate org insert
module.exports.validateOrg = [
    check('caseStudyData', 'No data to be inserted.')
        .notEmpty()
        .withMessage('caseStudyData should not be empty')
        .bail(),
    validationHandler // Handler for validation errors
];