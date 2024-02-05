const express = require('express');
const upload = require('../../multer');

// middleware for server side validation
const { asyncErrorHandler } = require('../middleware/error.middleware');
const { validateCaseStudy } = require('../middleware/express-validator/case-study.validator');
const { validateJournalPaper } = require('../middleware/express-validator/journal-paper.validators');
const { validateResearchSeminar } = require('../middleware/express-validator/research-seminar.validators')

// controllers
const researchController = require('../controllers/research.controller');
const caseStudyController = require('../controllers/case-study.controller');
const journalController = require('../controllers/journal-paper.controller');
const conferenceController = require('../controllers/conference-publication.controller');
const patentSubmission = require('../controllers/patent-submission.controller');
const researchConsultancyController = require('../controllers/research-project-consultancy.controller');
const bookPublicationRoutes = require('./book-publication-main.routes');
const researchSeminarController = require('../controllers/research-seminar.controller')

// services
const patentSubmissionServices = require('../services/patent-submission.service');
const researchConsultancyService = require('../services/research-consultancy.service');
const conferenceServices = require('../services/conference-publications.service');


const router = express.Router();

router.get('/', asyncErrorHandler(researchController.renderResearch));

//journal paper 
router.get('/journal-paper', asyncErrorHandler(journalController.renderJournalPaper));
router.post('/journal-paper/insert', validateJournalPaper, asyncErrorHandler(journalController.createJournalPaper));
router.post('/journal-paper/update', asyncErrorHandler(journalController.updateJournalPaper));
router.post('/journal-paper/delete', asyncErrorHandler(journalController.delJournalPaper));
router.post('/journal-paper/view', asyncErrorHandler(journalController.viewJournalPaper));


//case studies
router.get('/case-study', asyncErrorHandler(caseStudyController.renderCaseStudy) );
router.post('/case-study/insert', validateCaseStudy, asyncErrorHandler(caseStudyController.insertCaseStudies));
router.post('/case-study/delete',  asyncErrorHandler(caseStudyController.delCaseStudies));
router.post('/case-study/view', asyncErrorHandler(caseStudyController.caseStudyView));
router.post('/case-study/update', asyncErrorHandler(caseStudyController.updatedCaseStudies));


//conference-publication
router.get('/conference-publication', asyncErrorHandler(conferenceController.renderConferencePage));
router.post('/conference-publication/insert', upload.fields([
    { name: 'conferenceDocument', maxCount: 1 },
    { name: 'conferenceProof', maxCount: 1 },
]),asyncErrorHandler(conferenceController.insertConferencePublicationSData));
router.post('/conference-publication/view', asyncErrorHandler(conferenceController.viewConferencePublication));
router.post('/conference-publication/delete', asyncErrorHandler(conferenceController.deleteConferencePublication));
router.post('/conference-publication/update', upload.fields([
    { name: 'conferenceDocument', maxCount: 1 },
    { name: 'conferenceProof', maxCount: 1 },
]),asyncErrorHandler(conferenceController.updateConferencePublication));
router.get('/conference-publication/download/:fileName', conferenceServices.downloadFile);
router.get('/conference-publication/viewing/:fileName', conferenceServices.viewFile);

//patent submission form
router.get('/patent-submission', asyncErrorHandler(patentSubmission.renderPatentSubMissionAndGrant));
router.post('/patent-submission/insert', upload.array('patentFile' ,5), asyncErrorHandler(patentSubmission.insertPatentsubmission));
router.post('/patent-submission/update', upload.array('patentFile'), asyncErrorHandler(patentSubmission.updatePatentSubMissiom));
router.post('/patent-submission/delete', asyncErrorHandler(patentSubmission.deletePatentData));
router.post('/patent-submission/view', asyncErrorHandler(patentSubmission.viewPatentSubmissionData));
router.get('/patent-submission/download/:fileName', patentSubmissionServices.downloadFile);
router.get('/patent-submission/viewing/:fileName', patentSubmissionServices.viewFile);

//research project consultancy
router.get('/research-project-consultancy', asyncErrorHandler(researchConsultancyController.renderResearchProjectConsultancy));
router.post('/research-project-consultancy/insert', upload.single('researchSupportingDocument'), asyncErrorHandler(researchConsultancyController.insertResearchConsultancyData));
router.post('/research-project-consultancy/update', upload.single('researchSupportingDocument'), asyncErrorHandler(researchConsultancyController.updatedConsultantData));
router.post('/research-project-consultancy/delete', asyncErrorHandler(researchConsultancyController.deleteResearchConsultant));
router.post('/research-project-consultancy/view', asyncErrorHandler(researchConsultancyController.viewResearchProjectConsultancy));
router.get('/research-project-consultancy/download/:fileName', researchConsultancyService.downloadFile);
router.get('/research-project-consultancy/viewing/:fileName', researchConsultancyService.viewFile);

// book publication
router.use('/book-publication-main', bookPublicationRoutes);

//research-seminar

router.get('/research-seminar', asyncErrorHandler(researchSeminarController.renderResearchSeminar))
router.post('/research-seminar/insert', validateResearchSeminar, asyncErrorHandler(researchSeminarController.createResearchSeminar));
router.post('/research-seminar/update', asyncErrorHandler(researchSeminarController.updateResearchSeminar));
router.post('/research-seminar/delete', asyncErrorHandler(researchSeminarController.delResearchSeminar));
router.post('/research-seminar/view', asyncErrorHandler(researchSeminarController.viewResearchSeminar));
module.exports = router;