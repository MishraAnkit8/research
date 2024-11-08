const journalPaperService = require("../services/journal-paper.service");
const { getRedisData } = require("../../utils/redis.utils");

module.exports.renderJournalPaper = async (req, res, next) => {
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`);
  const userName = sessionData.username;
  console.log("userName in in dashboard controller  ===>>>>>>", userName);

  const journalList = await journalPaperService.renderJournalPaper(userName);

  // console.log('journalList in controller ====>>>>', journalList.rowCount);
  console.log(
    "journalList.allAuthorList ===>>>>>>>",
    journalList.allAuthorList
  );

  res.render("journal-paper", {
    status: journalList.status,
    message: journalList.message,
    journalData: journalList.journalArticleData,
    rowCount: journalList.rowCount,
    nmimsSchoolList: journalList.nmimsSchool,
    internalEmpList: journalList.internalEmpList,
    nmimsCampusList: journalList.nmimsCampus,
    policyCadre: journalList.policyCadre,
    impactFactor: journalList.impactFactor,
    allAuthorList: journalList.allAuthorList,
    paperType: journalList.paperType,
    userName: userName,
    errorCode: journalList.errorCode ? journalList.errorCode : null,
  });
};

module.exports.insertJournalPapperDetails = async (req, res, next) => {
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`);
  const userName = sessionData.username;
  console.log("userName in in dashboard controller  ===>>>>>>", userName);

  console.log("journal data body ", JSON.stringify(req.body));

  const journalPaperData = await journalPaperService.insertJournalPapper(
    req.body,
    req.files,
    userName
  );

  console.log("journalPaperData ===>", journalPaperData.rowCount);

  const statusCode =
    journalPaperData.status === "Done"
      ? 200
      : journalPaperData.errorCode
      ? 400
      : 500;

  res.status(statusCode).send({
    status: journalPaperData.status,
    message: journalPaperData.message,
    rowCount: journalPaperData.rowCount,
    journalPaperId: journalPaperData.journalPaperId,
    // documentIds: journalPaperData.documentIds,
    // articledocumentsIds: journalPaperData.articledocumentsIds,
    // articlImpactFactorIds: journalPaperData.articlImpactFactorIds,
    // articlePolicyCadreIds: journalPaperData.articlePolicyCadreIds,
    // articleSchoolIds: journalPaperData.articleSchoolIds,
    // articleCampusIds: journalPaperData.articleCampusIds,
    // journalAuthorsIds: journalPaperData.journalAuthorsIds,
    // allArticleAuthorIds: journalPaperData.allArticleAuthorIds,
    // schoolList: journalPaperData.schoolList,
    // campusList: journalPaperData.campusList,
    // impactFactorList : journalPaperData.impactFactorList,
    // policyCadreList : journalPaperData.policyCadreList,
    // journalDetails : journalPaperData.journalDetails,
    // schoolsIdsStrings : journalPaperData.schoolsIdsStrings,
    // campusIdsString : journalPaperData.campusIdsString,
    // policadreIdsstring : journalPaperData.policadreIdsstring,
    // impacatFactorIdsString : journalPaperData.impacatFactorIdsString,
    // nmisAuthorIdsstring : journalPaperData.nmisAuthorIdsstring,
    // allAuthorsIdsString : journalPaperData.allAuthorsIdsString,
    // documentIdsString : journalPaperData.documentIdsString,
    // articleFilesNameArray : journalPaperData.articleFilesNameArray,
    errorCode: journalPaperData.errorCode ? journalPaperData.errorCode : null,
  });
};

module.exports.delJournalPaper = async (req, res, next) => {
  const journalPaperId = req.body.journalPaperId;
  const userName = req.body.username;

  const delJournalData = await journalPaperService.deleteJournalPaper(
    journalPaperId
  );

  const statusCode =
    delJournalData.status === "Done"
      ? 200
      : delJournalData.errorCode
      ? 400
      : 500;

  res.status(statusCode).send({
    status: delJournalData.status,
    message: delJournalData.message,
    errorCode: delJournalData.errorCode ? delJournalData.errorCode : null,
  });
};

module.exports.updateJournalPaper = async (req, res, next) => {
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`);
  const userName = sessionData.username;
  console.log("userName in in dashboard controller  ===>>>>>>", userName);
  // console.log('data is comming from template ==>>>>>', JSON.stringify(req.body));

  console.log("files in conteroller ===>>>>", req.files);
  console.log("data is comming from frontend =====>>>>>>", req.body);

  const updatePaper = await journalPaperService.updateJournalPaper(
    req.body,
    req.files,
    userName
  );

  // console.log('updatePaper updation in controller', JSON.stringify(updatePaper));
  const statusCode =
    updatePaper.status === "Done" ? 200 : updatePaper.errorCode ? 400 : 500;
  console.log("statusCode ==>>>>", statusCode);

  res.status(statusCode).send({
    status: updatePaper.status,
    message: updatePaper.message,
    status: updatePaper.status,
    message: updatePaper.message,
    rowCount: updatePaper.rowCount,
    // documentIds: updatePaper.documentIds,
    // articledocumentsIds: updatePaper.articledocumentsIds,
    // articlImpactFactorIds: updatePaper.articlImpactFactorIds,
    // articlePolicyCadreIds: updatePaper.articlePolicyCadreIds,
    // articleSchoolIds: updatePaper.articleSchoolIds,
    // articleCampusIds: updatePaper.articleCampusIds,
    // journalAuthorsIds: updatePaper.journalAuthorsIds,
    // allArticleAuthorIds: updatePaper.allArticleAuthorIds,
    // schoolList: updatePaper.schoolList,
    // campusList: updatePaper.campusList,
    // impactFactorList : updatePaper.impactFactorList,
    // policyCadreList : updatePaper.policyCadreList,
    // schoolsIdsStrings : updatePaper.schoolsIdsStrings,
    // campusIdsString : updatePaper.campusIdsString,
    // policadreIdsstring :updatePaper.policadreIdsstring,
    // impacatFactorIdsString : updatePaper.impacatFactorIdsString,
    // nmisAuthorIdsstring : updatePaper.nmisAuthorIdsstring,
    // allAuthorsIdsString : updatePaper.allAuthorsIdsString,
    // documentIdsString : updatePaper.documentIdsString,
    // articleFilesNameArray : updatePaper.articleFilesNameArray,
    // updateJournalDetails : updatePaper.updateJournalDetails,
    errorCode: updatePaper.errorCode ? updatePaper.errorCode : null,
  });
};

module.exports.viewJournalPaper = async (req, res, next) => {
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`);
  const userName = sessionData.username;
  console.log("userName in in dashboard controller  ===>>>>>>", userName);
  const journalPaperId = req.body.journalPaperId;
  console.log("journalPaperId for View", journalPaperId);

  const viewJournalDetails = await journalPaperService.viewJournalPaper(
    journalPaperId,
    userName
  );

  console.log(
    "viewJournalDetails in controller ====>>>>>>",
    viewJournalDetails
  );

  const statusCode =
    viewJournalDetails.status === "Done"
      ? 200
      : viewJournalDetails.errorCode
      ? 400
      : 500;

  res.status(statusCode).send({
    status: viewJournalDetails.status,
    message: viewJournalDetails.message,
    journalAricleData: viewJournalDetails.journalAricleData,
    nmimsAuthors: viewJournalDetails.nmimsAuthors,
    allAuthorsData: viewJournalDetails.allAuthorsData,
    articleSchoolData: viewJournalDetails.articleSchoolData,
    articleCampusData: viewJournalDetails.articleCampusData,
    articleDocuments: viewJournalDetails.articleDocuments,
    // articleImpactFactor : viewJournalDetails.articleImpactFactor,
    articlePolicyCadre: viewJournalDetails.articlePolicyCadre,
    errorCode: viewJournalDetails.errorCode
      ? viewJournalDetails.errorCode
      : null,
  });
};

//delete  article school details from drop down
module.exports.deleteJournalArticleSchool = async (req, res, next) => {
  const userName = req.body.username;
  console.log("Data Comming from Template", req.body);
  console.log("userName ====>>>>>>", userName);

  const deleteSchoolStatus = await journalPaperService.deleteSchoolDetails(
    req.body,
    userName
  );

  console.log("deleteSchoolStatus ===>>>>>>", deleteSchoolStatus);
  const statusCode =
    deleteSchoolStatus.status === "Done"
      ? 200
      : deleteSchoolStatus.errorCode
      ? 400
      : 500;
  res.status(statusCode).send({
    status: deleteSchoolStatus.status,
    message: deleteSchoolStatus.message,
    errorCode: deleteSchoolStatus.errorCode
      ? deleteSchoolStatus.errorCode
      : null,
  });
};

//delete  article details  campus from drop down
module.exports.deleteJournalArticleCampus = async (req, res, next) => {
  const userName = req.body.username;
  console.log("Data Comming from Template", req.body);
  console.log("userName ====>>>>>>", userName);

  const deleteCampusStatus = await journalPaperService.deleteCampusDetails(
    req.body,
    userName
  );

  console.log("deleteCampusStatus ===>>>>>>", deleteCampusStatus);

  const statusCode =
    deleteCampusStatus.status === "Done"
      ? 200
      : deleteCampusStatus.errorCode
      ? 400
      : 500;
  res.status(statusCode).send({
    status: deleteCampusStatus.status,
    message: deleteCampusStatus.message,
    errorCode: deleteCampusStatus.errorCode
      ? deleteCampusStatus.errorCode
      : null,
  });
};

//delete  article policy cadre details from drop down
module.exports.deleteJournalArticlePolicyCadre = async (req, res, next) => {
  const userName = req.body.username;
  console.log("Data Comming from Template", req.body);
  console.log("userName ====>>>>>>", userName);

  const deleteInternalAuthorsStatus =
    await journalPaperService.deletePolicyDetails(req.body, userName);

  console.log(
    "deleteInternalAuthorsStatus ===>>>>>>",
    deleteInternalAuthorsStatus
  );

  const statusCode =
    deleteInternalAuthorsStatus.status === "Done"
      ? 200
      : deleteInternalAuthorsStatus.errorCode
      ? 400
      : 500;
  res.status(statusCode).send({
    status: deleteInternalAuthorsStatus.status,
    message: deleteInternalAuthorsStatus.message,
    errorCode: deleteInternalAuthorsStatus.errorCode
      ? deleteInternalAuthorsStatus.errorCode
      : null,
  });
};

//delete  article intenal nmims details from drop down
module.exports.deleteJournalArticleIntrenalFaculty = async (req, res, next) => {
  const userName = req.body.username;
  console.log("Data Comming from Template", req.body);
  console.log("userName ====>>>>>>", userName);

  const deleteAllAuthorsStatus =
    await journalPaperService.deleteNmimsAuthorsDetails(req.body, userName);

  console.log("deleteAllAuthorsStatus ===>>>>>>", deleteAllAuthorsStatus);
  const statusCode =
    deleteAllAuthorsStatus.status === "Done"
      ? 200
      : deleteAllAuthorsStatus.errorCode
      ? 400
      : 500;
  res.status(statusCode).send({
    status: deleteAllAuthorsStatus.status,
    message: deleteAllAuthorsStatus.message,
    errorCode: deleteAllAuthorsStatus.errorCode
      ? deleteAllAuthorsStatus.errorCode
      : null,
  });
};

//delete  article  all authors details from drop down
module.exports.deleteJournalArticleAllAuthors = async (req, res, next) => {
  const userName = req.body.username;
  console.log("Data Comming from Template", req.body);
  console.log("userName ====>>>>>>", userName);

  const deletePolicyCadreStatus =
    await journalPaperService.deleteAllauthorsDetails(req.body, userName);

  console.log("deletePolicyCadreStatus ===>>>>>>", deletePolicyCadreStatus);
  const statusCode =
    deletePolicyCadreStatus.status === "Done"
      ? 200
      : deletePolicyCadreStatus.errorCode
      ? 400
      : 500;
  res.status(statusCode).send({
    status: deletePolicyCadreStatus.status,
    message: deletePolicyCadreStatus.message,
    errorCode: deletePolicyCadreStatus.errorCode
      ? deletePolicyCadreStatus.errorCode
      : null,
  });
};
