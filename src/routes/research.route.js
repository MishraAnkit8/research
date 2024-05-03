const express = require('express');
const upload = require('../../multer');

// middleware for server side validation
const { asyncErrorHandler } = require('../middleware/error.middleware');
const { validateCaseStudy } = require('../middleware/express-validator/case-study.validator');
const { validateJournalPaper } = require('../middleware/express-validator/journal-paper.validators');
const { validateResearchSeminar } = require('../middleware/express-validator/research-seminar.validators');

//middleware for download file
const downloadFileService = require('../middleware/download-file.middleware');

//logger file middle ware
const { authMiddleware } = require('../middleware/authMiddleware');

// controllers
const researchController = require('../controllers/research.controller');
const caseStudyController = require('../controllers/case-study.controller');
const journalController = require('../controllers/journal-paper.controller');
const conferenceController = require('../controllers/conference-publication.controller');
const patentSubmission = require('../controllers/patent-submission.controller');
const researchProjGrantController = require('../controllers/research-project-grant.controller');
const bookPublicationRoutes = require('./book-publication-main.routes');
const researchSeminarController = require('../controllers/research-seminar.controller');
const IPRController = require('../controllers/IPR.controller');
const researchAwardController = require('../controllers/research-award-controller');
const eContentDevelopMentCon = require('../controllers/e-content-development.controller');
const facultyController = require('../controllers/faculty-controller');

const nmimsConsultancyForm = require('../controllers/nmims-consultancy-form.controller');
const seedGrantNonPharmacy = require('../controllers/nmims-seed-grant-non-pharmacy');
const pharmacySeedGrantForm = require('../controllers/pharmacy-seed-grant-form-controller');

// services
const patentSubmissionServices = require('../services/patent-submission.service');
const researchProjGrantServices = require('../services/research-project-grant.service');
const conferenceServices = require('../services/conference-publications.service');




const router = express.Router();

router.get('/', asyncErrorHandler(researchController.renderResearch));

//journal paper 
router.get('/journal-paper', asyncErrorHandler(authMiddleware), asyncErrorHandler(journalController.renderJournalPaper));
router.post('/journal-paper/insert', upload.array('articlesDocuments', 5), asyncErrorHandler(authMiddleware), asyncErrorHandler(journalController.insertJournalPapperDetails));
router.post('/journal-paper/update', upload.array('articlesDocuments', 5), asyncErrorHandler(authMiddleware), asyncErrorHandler(journalController.updateJournalPaper));
router.post('/journal-paper/delete', asyncErrorHandler(authMiddleware), asyncErrorHandler(journalController.delJournalPaper));
router.post('/journal-paper/view', asyncErrorHandler(authMiddleware), asyncErrorHandler(journalController.viewJournalPaper));
router.get('/journal-paper/download/:fileName', asyncErrorHandler(authMiddleware), downloadFileService.downloadFile);


//case studies
router.get('/case-study', asyncErrorHandler(authMiddleware), asyncErrorHandler(caseStudyController.renderCaseStudy));
router.post('/case-study/insert', upload.array('caseStudyDocuments', 5), asyncErrorHandler(authMiddleware), asyncErrorHandler(caseStudyController.insertCaseStudies));
router.post('/case-study/delete',  asyncErrorHandler(authMiddleware), asyncErrorHandler(caseStudyController.delCaseStudies));
router.post('/case-study/view',  asyncErrorHandler(authMiddleware), asyncErrorHandler(caseStudyController.caseStudyView));
router.post('/case-study/update',  upload.array('caseStudyDocuments', 5), asyncErrorHandler(authMiddleware), asyncErrorHandler(caseStudyController.updatedCaseStudies));
router.post('/journal-paper/view', asyncErrorHandler(authMiddleware), asyncErrorHandler(journalController.viewJournalPaper));
router.get('/case-study/download/:fileName', asyncErrorHandler(authMiddleware), downloadFileService.downloadFile);
router.get('/case-study/viewing/:fileName', downloadFileService.viewFile);


//conference-publication
router.get('/conference-publication', asyncErrorHandler(authMiddleware), asyncErrorHandler(conferenceController.renderConferencePage));
router.post('/conference-publication/insert', upload.fields([
    { name: 'conferenceDocument', maxCount: 5 },
    { name: 'conferenceProof', maxCount: 5 }]), asyncErrorHandler(authMiddleware), asyncErrorHandler(conferenceController.insertConferencePublicationSData));
router.post('/conference-publication/view', asyncErrorHandler(authMiddleware), asyncErrorHandler(conferenceController.viewConferencePublication));
router.post('/conference-publication/delete', asyncErrorHandler(conferenceController.deleteConferencePublication));
router.post('/conference-publication/update', upload.fields([
    { name: 'conferenceDocument', maxCount: 5 },
    { name: 'conferenceProof', maxCount: 5 }])
    , asyncErrorHandler(authMiddleware), asyncErrorHandler(conferenceController.updateConferencePublication));
router.get('/conference-publication/download/:fileName', downloadFileService.downloadFile);
router.get('/conference-publication/viewing/:fileName', downloadFileService.viewFile);

//patent submission form
router.get('/patent-submission', asyncErrorHandler(authMiddleware), asyncErrorHandler(patentSubmission.renderPatentSubMissionAndGrant));
router.post('/patent-submission/insert', upload.array('patentFilesData', 5), asyncErrorHandler(authMiddleware), asyncErrorHandler(patentSubmission.insertPatentsubmission));
router.post('/patent-submission/update', upload.array('patentFilesData', 5), asyncErrorHandler(authMiddleware), asyncErrorHandler(patentSubmission.updatePatentSubMissiom));
router.post('/patent-submission/delete', asyncErrorHandler(authMiddleware), asyncErrorHandler(patentSubmission.deletePatentData));
router.post('/patent-submission/view', asyncErrorHandler(authMiddleware), asyncErrorHandler(patentSubmission.viewPatentSubmissionData));
router.get('/patent-submission/download/:fileName', downloadFileService.downloadFile);
router.get('/patent-submission/viewing/:fileName', downloadFileService.viewFile);

//research project grant insertresearchcConsultancyData
router.get('/research-project-grant', asyncErrorHandler(authMiddleware), asyncErrorHandler(researchProjGrantController.renderResearchProjectConsultancy));
router.post('/research-project-grant/insert', upload.array('researchSupportingDocument', 5), asyncErrorHandler(authMiddleware), asyncErrorHandler(researchProjGrantController.insertResearchConsultancyData));
router.post('/research-project-grant/update', upload.array('researchSupportingDocument', 5), asyncErrorHandler(researchProjGrantController.updatedConsultantData));
router.post('/research-project-grant/delete', asyncErrorHandler(authMiddleware), asyncErrorHandler(researchProjGrantController.deleteResearchConsultant));
router.post('/research-project-grant/view', asyncErrorHandler(authMiddleware), asyncErrorHandler(researchProjGrantController.viewResearchProjectConsultancy));
// router.post('/research-project-grant/faculty-insert', asyncErrorHandler(researchProjGrantController.insertExternalFacultyDetails));

router.get('/research-project-grant/download/:fileName', downloadFileService.downloadFile);
router.get('/research-project-grant/viewing/:fileName', downloadFileService.viewFile);

// book publication
router.use('/book-publication-main', bookPublicationRoutes);

//research-seminar

router.get('/research-seminar', asyncErrorHandler(authMiddleware), asyncErrorHandler(researchSeminarController.renderResearchSeminar))
router.post('/research-seminar/insert',  upload.array('seminarDocuments', 5), asyncErrorHandler(authMiddleware), asyncErrorHandler(researchSeminarController.createResearchSeminar));
router.post('/research-seminar/update' ,upload.array('seminarDocuments', 5), asyncErrorHandler(authMiddleware), asyncErrorHandler(researchSeminarController.updateResearchSeminar));
router.post('/research-seminar/delete',asyncErrorHandler(authMiddleware), asyncErrorHandler(researchSeminarController.delResearchSeminar));
router.post('/research-seminar/view', asyncErrorHandler(authMiddleware), asyncErrorHandler(researchSeminarController.viewResearchSeminar));
router.get('/research-seminar/download/:fileName',asyncErrorHandler(downloadFileService.downloadFile));
router.get('/research-seminar/viewing/:fileName', asyncErrorHandler(downloadFileService.viewFile));


//IPR 
router.get('/IPR', asyncErrorHandler(authMiddleware), asyncErrorHandler(IPRController.renderIPR));
router.post('/IPR/insert', upload.array('supportingDocuments', 5), asyncErrorHandler(authMiddleware), asyncErrorHandler(IPRController.IPRInsertedData));
router.post('/IPR/delete', asyncErrorHandler(authMiddleware), asyncErrorHandler(IPRController.deleteIPRData));
router.post('/IPR/update', upload.array('supportingDocuments', 5), asyncErrorHandler(authMiddleware),asyncErrorHandler(IPRController.updateIPRRowData));
router.post('/IPR/view', asyncErrorHandler(IPRController.viewIprRecordData));
router.get('/IPR/download/:fileName', downloadFileService.downloadFile);
router.get('/IPR/viewing/:fileName', downloadFileService.viewFile);

//reserach award 
router.get('/research-award', asyncErrorHandler(authMiddleware), asyncErrorHandler(researchAwardController.renderResearchAward));
router.post('/research-award/insert' , upload.array('researchAwardDocuments', 5) , asyncErrorHandler(authMiddleware), asyncErrorHandler(researchAwardController.insertResearchAwardFormData));
router.post('/research-award/update' , upload.array('researchAwardDocuments', 5) , asyncErrorHandler(authMiddleware), asyncErrorHandler(researchAwardController.updateResearchAwardData));
router.post('/research-award/delete' , asyncErrorHandler(authMiddleware), asyncErrorHandler(researchAwardController.deleteResearchAwardRow));
router.post('/research-award/view' , asyncErrorHandler(authMiddleware), asyncErrorHandler(researchAwardController.viewResearchAwardData));
router.get('/research-award/download/:fileName', downloadFileService.downloadFile);
router.get('/research-award/viewing/:fileName', downloadFileService.viewFile);

// E content Development

router.get('/e-content', asyncErrorHandler(authMiddleware), asyncErrorHandler(eContentDevelopMentCon.renderEContentDevelopmentPage));
router.post('/e-content/insert', asyncErrorHandler(authMiddleware), asyncErrorHandler(eContentDevelopMentCon.insertEContentData));
router.post('/e-content/update', asyncErrorHandler(authMiddleware), asyncErrorHandler(eContentDevelopMentCon.updateEcontentData));
router.post('/e-content/delete', asyncErrorHandler(authMiddleware), asyncErrorHandler(eContentDevelopMentCon.deleteEcontentRowData));
router.post('/e-content/view', asyncErrorHandler(authMiddleware), asyncErrorHandler(eContentDevelopMentCon.viewEContentData));

// nmims consultancy form
router.get('/nmims-consultancy-approval-form', asyncErrorHandler(authMiddleware), asyncErrorHandler(nmimsConsultancyForm.renderNmimsConsultancyForm));
router.post('/nmims-consultancy-approval-form/insert', asyncErrorHandler(authMiddleware), asyncErrorHandler(nmimsConsultancyForm.insertconsultancyFormData));
router.post('/nmims-consultancy-approval-form/view', asyncErrorHandler(authMiddleware), asyncErrorHandler(nmimsConsultancyForm.viewConsultancyFormApprovalData));
router.post('/nmims-consultancy-approval-form/update', asyncErrorHandler(authMiddleware), asyncErrorHandler(nmimsConsultancyForm.updateConsultancyApprovalFormData));
router.post('/nmims-consultancy-approval-form/delete', asyncErrorHandler(authMiddleware), asyncErrorHandler(nmimsConsultancyForm.deleteConsultancyFormData));

// seedGrantNonPharmacy
router.get('/nmims-seed-grant-non-pharmacy', asyncErrorHandler(authMiddleware), asyncErrorHandler(seedGrantNonPharmacy.renderNmimsSeedGrantNonFormacy));
router.post('/nmims-seed-grant-non-pharmacy/insert', asyncErrorHandler(authMiddleware), asyncErrorHandler(seedGrantNonPharmacy.insertGrantedSeedNonFormacyForm));
router.post('/nmims-seed-grant-non-pharmacy/view', asyncErrorHandler(authMiddleware), asyncErrorHandler(seedGrantNonPharmacy.viewNonformacyForm));
router.post('/nmims-seed-grant-non-pharmacy/update', asyncErrorHandler(authMiddleware), asyncErrorHandler(seedGrantNonPharmacy.updatedNonFormacyform));
router.post('/nmims-seed-grant-non-pharmacy/delete', asyncErrorHandler(authMiddleware), asyncErrorHandler(seedGrantNonPharmacy.deleteNonFormacyForm));

// pharmacySeedGrantForm
router.get('/pharmacy-seed-grant-form', asyncErrorHandler(authMiddleware), asyncErrorHandler(pharmacySeedGrantForm.renderPharmacySeedGrantform));

//insert external faculty details controller

router.post('/external/faculty-insert', asyncErrorHandler(authMiddleware), asyncErrorHandler(facultyController.insertExternalFacultyDetails));

// userController





module.exports = router;