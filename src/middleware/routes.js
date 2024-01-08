router.post("/create",
//middleware to add dummy org data in req.body.insertData
(req, res, next) => {
    req.body.insertData = [{
        orgTypeLid: 5,
        serviceTypeLid: 1,
        tradeName: 'Org 1',
        legalName: 'Org 1 Legal',
        parentOrgLid: '',
        orgGroupLid: '',
        orgIndustryLid: 1,
        orgEntityLid: 1,
        isMsme: false,
        is24Hours: true,
        openingTime: '',
        closingTime: ''
      },
      {
        orgTypeLid: 4,
        serviceTypeLid: '',
        tradeName: 'Org 2',
        legalName: 'Org 2 Legal',
        parentOrgLid: '',
        orgGroupLid: '',
        orgIndustryLid: 1,
        orgEntityLid: 1,
        isMsme: false,
        is24Hours: true,
        openingTime: '',
        closingTime: ''
      },
      {
        orgTypeLid: 5,
        serviceTypeLid: 2,
        tradeName: 'Org 3',
        legalName: 'Org 3 Legal',
        parentOrgLid: '',
        orgGroupLid: '',
        orgIndustryLid: 1,
        orgEntityLid: 1,
        isMsme: false,
        is24Hours: true,
        openingTime: '',
        closingTime: ''
      },
      {
        orgTypeLid: 5,
        serviceTypeLid: '',
        tradeName: 'Org 4',
        legalName: 'Org 4 Legal',
        parentOrgLid: '',
        orgGroupLid: '',
        orgIndustryLid: 1,
        orgEntityLid: 1,
        isMsme: false,
        is24Hours: true,
        openingTime: '',
        closingTime: ''
      }];
    next();
},
validateOrg, asyncErrorHandler(org.insert));