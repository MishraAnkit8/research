const express = require('express');
const upload = require('../../multer');

// middleware for server side validation
const { asyncErrorHandler } = require('../middleware/error.middleware');
const {validateOrg} = require('../middleware/data-validation');

const researchController = require('../controllers/research.controller');
const caseStudyController = require('../controllers/case-study.controller');
const journalController = require('../controllers/journal-paper.controller');
const conferenceController = require('../controllers/conference-publication.controller');
const patentSubmission = require('../controllers/patent-submission.controller');
const researchConsultancyController = require('../controllers/research-project-consultancy.controller');
const bookPublicationRoutes = require('./book-publication-main.routes');
const researchSeminarController = require('../controllers/research-seminar.controller')

const router = express.Router();

router.get('/', asyncErrorHandler(researchController.renderResearch));

//journal paper 
router.get('/journal-paper', asyncErrorHandler(journalController.renderJournalPaper));
router.post('/journal-paper/insert', validateOrg, asyncErrorHandler(journalController.createJournalPaper));
router.post('/journal-paper/update', asyncErrorHandler(journalController.updateJournalPaper));
router.post('/journal-paper/delete', asyncErrorHandler(journalController.delJournalPaper));
router.post('/journal-paper/view', asyncErrorHandler(journalController.viewJournalPaper));


//case studies
router.get('/case-study', asyncErrorHandler(caseStudyController.renderCaseStudy) );
router.post('/case-study/insert', (req, res, next) => {
    req.body.caseStudyData = {
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
      };
    next();
}, validateOrg, asyncErrorHandler(caseStudyController.insertCaseStudies));
router.post('/case-study/delete',  asyncErrorHandler(caseStudyController.delCaseStudies));
router.post('/case-study/view', asyncErrorHandler(caseStudyController.caseStudyView));
router.post('/case-study/update', asyncErrorHandler(caseStudyController.updatedCaseStudies));


//conference-publication
router.get('/conference-publication', asyncErrorHandler(conferenceController.renderConferencePage));
router.post('/conference-publication/insert', validateOrg, upload.fields([
    { name: 'conferenceDocument', maxCount: 1 },
    { name: 'conferenceProof', maxCount: 1 },
]),asyncErrorHandler(conferenceController.insertConferencePublicationSData));
router.post('/conference-publication/view', asyncErrorHandler(conferenceController.viewConferencePublication));
router.post('/conference-publication/delete', asyncErrorHandler(conferenceController.deleteConferencePublication));
router.post('/conference-publication/update', upload.fields([
    { name: 'conferenceDocument', maxCount: 1 },
    { name: 'conferenceProof', maxCount: 1 },
]),asyncErrorHandler(conferenceController.updateConferencePublication));

//patent submission form
router.get('/patent-submission', asyncErrorHandler(patentSubmission.renderPatentSubMissionAndGrant));
router.post('/patent-submission/insert', validateOrg, upload.single('patentFile'), asyncErrorHandler(patentSubmission.insertPatentsubmission));
router.post('/patent-submission/update', upload.single('patentFile'), asyncErrorHandler(patentSubmission.updatePatentSubMissiom));
router.post('/patent-submission/delete', asyncErrorHandler(patentSubmission.deletePatentData));
router.post('/patent-submission/view', asyncErrorHandler(patentSubmission.viewPatentSubmissionData));

//research project consultancy
router.get('/research-project-consultancy', asyncErrorHandler(researchConsultancyController.renderResearchProjectConsultancy));
router.post('/research-project-consultancy/insert', validateOrg, upload.single('researchSupportingDocument'), asyncErrorHandler(researchConsultancyController.insertResearchConsultancyData));
router.post('/research-project-consultancy/update', upload.single('researchSupportingDocument'), asyncErrorHandler(researchConsultancyController.updatedConsultantData));
router.post('/research-project-consultancy/delete', asyncErrorHandler(researchConsultancyController.deleteResearchConsultant));
router.post('/research-project-consultancy/view', asyncErrorHandler(researchConsultancyController.viewResearchProjectConsultancy));

// book publication
router.use('/book-publication-main', bookPublicationRoutes);

//research-seminar

router.get('/research-seminar', asyncErrorHandler(researchSeminarController.renderResearchSeminar))
router.post('/research-seminar/insert', validateOrg, asyncErrorHandler(researchSeminarController.createResearchSeminar));
router.post('/research-seminar/update', asyncErrorHandler(researchSeminarController.updateResearchSeminar));
router.post('/research-seminar/delete', asyncErrorHandler(researchSeminarController.delResearchSeminar));
router.post('/research-seminar/view', asyncErrorHandler(researchSeminarController.viewResearchSeminar));
module.exports = router;