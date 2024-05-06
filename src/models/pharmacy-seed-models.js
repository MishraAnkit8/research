const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.renderPharmacyData = async() => {

}

module.exports.insertInvestigatorEducationDetails = async(educationalDetails) => {
    console.log('data in service ====>>>>>', educationalDetails);

    const {education, university, passoutYear} = educationalDetails;

    let sql = {
        text : `INSERT INTO investigator_education (course_name, university_name, passout_year) values ($1, $2, $3) returning id`,
        values : [education, university, passoutYear]
    }
    console.log('sql ===>>>>', sql);

    const result = await researchDbW.query(sql);
    const response = result.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Inserted Successfully",
            investorEduId: result.rows[0].id,
            rowCount: result.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record insertion.",
            errorCode: error?.code
        };
    
    return response;

}

module.exports.insertInvestigatorExperienceDetails = async(workExperienceDetails) => {
    console.log('data in service ====>>>>>', workExperienceDetails);

    const {investigatorPossition, investigatorOrganization, investigatorExperience} = workExperienceDetails;


    let sql = {
        text : `INSERT INTO investigator_experience (possition, organization_name, experience) values ($1, $2, $3) returning id`,
        values : [investigatorPossition, investigatorOrganization, investigatorExperience]
    }
    console.log('sql ===>>>>', sql);

    const result = await researchDbW.query(sql);
    const response = result.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Inserted Successfully",
            invastigatorExperienceId: result.rows[0].id,
            rowCount: result.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record insertion.",
            errorCode: error?.code
        };
    
    return response;

}

module.exports.insertInvestigatorBookDetails = async(investigatorBookDetails) => {
    console.log('data in service ====>>>>>', investigatorBookDetails);

    const {investigatorbookAuthor, investigatorBookNames, investigatorBookYear, investigatorBookVolumne, investigatorBookPublisher, investigatorBookIsbn} = investigatorBookDetails;

    let sql = {
        text : `INSERT INTO investigator_book (book_author, book_names, book_year, book_volume, book_publisher, book_isbn) values ($1, $2, $3, $4, $5, $6, $7) returning id`,
        values : [investigatorbookAuthor, investigatorBookNames, investigatorBookYear, investigatorBookVolumne, investigatorBookPublisher, investigatorBookIsbn]
    }
    console.log('sql ===>>>>', sql);

    const result = await researchDbW.query(sql);
    const response = result.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Inserted Successfully",
            bookId: result.rows[0].id,
            rowCount: result.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record insertion.",
            errorCode: error?.code
        };
    
    return response;

}

module.exports.insertInvestigatorBookChapterDetails = async(investigatorBookChapterDetails) => {
    console.log('data in model ====>>>>>', investigatorBookChapterDetails);

    const {investigatorbookChapterAuthor, investigatorBookChapterTitle, investigatorBookChapterNames, investigatorBookVolumne,
        investigatorBookChapterPageNumber,
       investigatorBookChapterPublisher, investigatorBookChapterIsbn} = investigatorBookChapterDetails;

    let sql = {
        text : `INSERT INTO investigator_book_chapter (book_chapter_author, book_chapter__title, book_chapter_names, book_chapter_volume,book_chapter_publisher, book_chapter_page_number, book_chapter_isbn) values ($1, $2, $3, $4, $5, $6, $7) returning id`,
        values : [investigatorbookChapterAuthor, investigatorBookChapterTitle, investigatorBookChapterNames, investigatorBookVolumne,
                    investigatorBookChapterPageNumber, investigatorBookChapterPublisher, investigatorBookChapterIsbn]
    }
    console.log('sql ===>>>>', sql);

    const result = await researchDbW.query(sql);
    const response = result.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Inserted Successfully",
            bookChapterId: result.rows[0].id,
            rowCount: result.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record insertion.",
            errorCode: error?.code
        };
    
    return response;

}

module.exports.insertInvestigatorPatentDetails = async(investigatorPatentDetails) => {
    console.log('data in models ====>>>>>', investigatorPatentDetails);

    const {investigatorApplicantName, investigatorPatentTitle, investigatorPatentStatus, investigatorPatentYear} = investigatorPatentDetails;

    let sql = {
        text : `INSERT INTO investigator_patent (applicant_name, patent_title, patent_status, patent_year) values ($1, $2, $3, $4) returning id`,
        values : [investigatorApplicantName, investigatorPatentTitle, investigatorPatentStatus, investigatorPatentYear]
    }
    console.log('sql ===>>>>', sql);

    const result = await researchDbW.query(sql);
    const response = result.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Inserted Successfully",
            patentId: result.rows[0].id,
            rowCount: result.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record insertion.",
            errorCode: error?.code
        };
    
    return response;

}

module.exports.insertInvestigatorPublicationDetails = async(investigatorPublicationDetails) => {
    console.log('data in service ====>>>>>', investigatorPublicationDetails);

    const {publicationAuthor, publicationTitle, publicationjournalName, publicationYear, publicationVolume,
        publicationPublisher, publicationIsbn} = investigatorPublicationDetails;

    let sql = {
        text : `INSERT INTO investigator_publication (publication_author, publication_title, publication_jorunal_name, publication_publisher, publication_year, publication_volume, publication_isbn) values ($1, $2, $3, $4, $5, $6, $7) returning id`,
        values : [publicationAuthor, publicationTitle, publicationjournalName, publicationYear, publicationVolume,
            publicationPublisher, publicationIsbn]
    }
    console.log('sql ===>>>>', sql);

    const result = await researchDbW.query(sql);
    const response = result.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Inserted Successfully",
            publicationId: result.rows[0].id,
            rowCount: result.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record insertion.",
            errorCode: error?.code
        };
    
    return response;

}

module.exports.insertInvestigatorResearchImplementationDetails = async(researchProjectDetails) => {
    console.log('data in models ====>>>>>', researchProjectDetails);

    const {researchTitle, researchAgency, researchRole, projectDuration, projectCost} = researchProjectDetails;

    let sql = {
        text : `INSERT INTO investigator_research_implementation (research_im_title, research_im_agency, research_im_role, research_im_duration, research_im_project_cost) values ($1, $2, $3, $4, $5) returning id`,
        values : [researchTitle, researchAgency, researchRole, projectDuration, projectCost]
    }
    console.log('sql ===>>>>', sql);

    const result = await researchDbW.query(sql);
    const response = result.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Inserted Successfully",
            implementationId: result.rows[0].id,
            rowCount: result.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record insertion.",
            errorCode: error?.code
        };
    
    return response;

}

module.exports.insertInvestigatorResearchCompletedDetails = async(researchProjectCompleteDetails) => {
    console.log('data in models ====>>>>>', researchProjectCompleteDetails);

    const { compltedProjecTitle, completedProjectAgency, completedProjectRole, completedProjectDuration, completedProjectCost} = educationalDetails;

    let sql = {
        text : `INSERT INTO investigator_research_complete (research_cm_title, research_cm_agency, research_cm_role, research_cm_duration, research_cm_project_cost) values ($1, $2, $3, $4, $5) returning id`,
        values : [ compltedProjecTitle, completedProjectAgency, completedProjectRole, completedProjectDuration, completedProjectCost]
    }
    console.log('sql ===>>>>', sql);

    const result = await researchDbW.query(sql);
    const response = result.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Inserted Successfully",
            CompletedId: result.rows[0].id,
            rowCount: result.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record insertion.",
            errorCode: error?.code
        };
    
    return response;

}

