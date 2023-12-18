const express = require('express');
const multer = require('multer');

const { asyncErrorHandler } = require('../middleware/error.middleware');
const researchController = require('../controllers/research.controller');
const caseStudyController = require('../controllers/case-study.controller');
const journalController = require('../controllers/journal-paper.controller');
const conferenceController = require('../controllers/conference-publication.controller');
const patentSubmission = require('../controllers/patent-submission.controller');

const router = express.Router();

router.get('/', asyncErrorHandler(researchController.renderResearch));

//journal paper 
router.get('/journal-paper', asyncErrorHandler(journalController.renderJournalPaper));
router.post('/journal-paper/create', asyncErrorHandler(journalController.createJournalPaper));
router.post('/journal-paper/update', asyncErrorHandler(journalController.updateJournalPaper));
router.post('/journal-paper/delete', asyncErrorHandler(journalController.delJournalPaper));
router.post('/journal-paper/view' , asyncErrorHandler(journalController.viewJournalPaper));


//case studies
router.get('/case-study', asyncErrorHandler(caseStudyController.renderCaseStudy) );
router.post('/case-study/insert' , asyncErrorHandler(caseStudyController.insertCaseStudies));
router.post('/case-study/delete' , asyncErrorHandler(caseStudyController.delCaseStudies));
router.post('/case-study/view' , asyncErrorHandler(caseStudyController.caseStudyView));
router.post('/case-study/update' , asyncErrorHandler(caseStudyController.updatedCaseStudies));


//conference-publication

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // destination folder
    },
    filename: function (req, file, cb) {
        // Define the filename as the original filename
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });


router.get('/conference-publication' , asyncErrorHandler(conferenceController.renderConferencePage));
router.post('/conference-publication/view' , asyncErrorHandler(conferenceController.viewconferencePublication));
router.post('/conference-publication/insert' , asyncErrorHandler(conferenceController.insertConferencePublicationSData));
router.post('/conference-publication/delete' , asyncErrorHandler(conferenceController.deleteConference));

//patent submission form
router.get('/patent-submission', asyncErrorHandler(patentSubmission.renderPatentSubMissionAndGrant));
router.post('/patent-submission/insert' , asyncErrorHandler(patentSubmission.insertPatentsubmission));
router.post('/patent-submission/fileupload', upload.single('myfile'), asyncErrorHandler(patentSubmission.handleFileUpload));


module.exports = router;