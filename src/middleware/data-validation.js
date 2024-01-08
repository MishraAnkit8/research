const { body } = require('express-validator');
const { invalidRequestError } = require('../../../utils/error/error');
const { validationHandler } = require('./validation.handler');


// if orgTypeLid is 5(Supplier) then serviceTypeLid is required
const validateServiceType = (value, { req }) => {
    let count = 0;

    return (value, { req }) => {
        let insertData = req.body.insertData;
        let orgTypeLid = insertData[count].orgTypeLid;
        let serviceTypeLid = insertData[count].serviceTypeLid;

        count++;
        if (orgTypeLid === 5 && !serviceTypeLid) {
            return false;
        }
        return true;
    };
};

// validate duplicate tradeName and legalName
const checkDuplicateTradeLegalName = (value, { req }) => {
    const uniqueTradeNames = new Set();
    const uniqueLegalNames = new Set();

    for (const item of value) {
        const tradeNameKey = item.tradeName;
        const legalNameKey = item.legalName;

        if (uniqueTradeNames.has(tradeNameKey) || uniqueLegalNames.has(legalNameKey)) {
            return false;
        }

        uniqueTradeNames.add(tradeNameKey);
        uniqueLegalNames.add(legalNameKey);
    }

    return true;
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
    body('insertData', 'No data to be inserted.')
        .notEmpty()
        .bail()
        .isArray({ min: 1 })
        .withMessage('insertData should be an array with min 1 item')
        .bail()
        .custom(checkDuplicateTradeLegalName) // Custom validation
        .withMessage('Duplicate tradeName and legalName found'),

    body('insertData.*.orgTypeLid', 'orgTypeLid is required')
        .notEmpty()
        .bail()
        .isInt(),

    body('insertData.*.serviceTypeLid')
        .custom(validateServiceType) // Custom validation
        .withMessage('serviceTypeLid is required for Supplier')
        .bail() // Stops validation chain if custom validation fails
        .custom(isInt)
        .withMessage('serviceTypeLid should be an integer'),

    body('insertData.*.tradeName', 'tradeName is required')
        .notEmpty()
        .bail()
        .isString({ min: 2, max: 255 })
        .withMessage('tradeName should be a string with min 2 and max 255 characters'),

    body('insertData.*.orgEntityLid', 'orgEntityLid is required')
        .notEmpty()
        .bail()
        .isInt()
        .withMessage('orgEntityLid should be an integer'),

    body('insertData.*.orgTypeLid', 'orgTypeLid should be an integer')
        .notEmpty()
        .bail()
        .isInt()
        .withMessage('orgTypeLid should be an integer'),

    body('insertData.*.orgIndustryLid', 'orgIndustryLid is required')
        .notEmpty()
        .bail()
        .isInt()
        .withMessage('orgIndustryLid should be an integer'),

    body('insertData.*.parentOrgLid', 'parentOrgLid should be an integer')
        .optional({ checkFalsy: true }) // Optional with falsy values allowed
        .isInt()
        .withMessage('parentOrgLid should be an integer'),

    body('insertData.*.orgGroupLid', 'orgGroupLid should be an integer')
        .optional({ checkFalsy: true }) // Optional with falsy values allowed
        .isInt()
        .withMessage('orgGroupLid should be an integer'),

    body('insertData.*.isMsme', 'isMsme should be a boolean')
        .optional()
        .isBoolean(),

    body('insertData.*.is24Hours', 'is24Hours should be a boolean')
        .optional()
        .isBoolean(),

    body('insertData.*.openingTime', 'openingTime should be a valid time')
        .optional({ checkFalsy: true }) // Optional with falsy values allowed
        .isISO8601(),

    body('insertData.*.closingTime', 'closingTime should be a valid time')
        .optional({ checkFalsy: true }) // Optional with falsy values allowed
        .isISO8601(),

    validationHandler // Handler for validation errors
];