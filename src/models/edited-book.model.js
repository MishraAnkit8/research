const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchEditedBookPublication = async(userName ) => {
    let sql = {
        text : `SELECT * FROM edited_book_publications WHERE created_by = $1 ORDER BY id desc`,
        values : [userName]
    }
    console.log('sql ==>', sql)
    return researchDbR.query(sql)
}

module.exports.insertEditedBook = async(editedBook, editedBookFilesData, userName) => {
    console.log("insertEditedBook Query : ",userName);
    const {authorName, bookTitle, edition, editorName, chapterTitle, publicationPlace, publisherCategory, pageNumber, publisherName, publicationYear,
        bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = editedBook;

    const doiIdParsed = doiBookId === "" ? null : parseInt(doiBookId , 10);

    let sql = {
        text : `INSERT INTO edited_book_publications (author_name, book_title, edition, editor_name, chapter_title, publication_place, publisher_category, page_number, publisher_name, 
            publication_year, book_url, doi_id, isbn_no, number_of_nmims_authors, nmims_authors, nmims_campus_authors, nmims_school_authors, supporting_documents, created_by)
            VALUES ($1, $2 , $3 ,$4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING id `,
        values : [authorName, bookTitle, edition, editorName, chapterTitle, publicationPlace, publisherCategory, pageNumber, publisherName, publicationYear,
            bookUrl, doiIdParsed, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, editedBookFilesData, userName]
    }

    return researchDbW.query(sql)
    .then(result => {
        console.log('Inserted row with id:', result.rows[0].id);
        return {
            status: 'Done',
            message: "Record Inserted Successfully",
            id: result.rows[0].id,
            rowCount: result.rowCount
        };
    })
    .catch(error => {
        console.log('error.code ====>>>', error.code);
        console.log('error.constraint ====>>>>>', error.constraint);
        console.log('error.message ====>>>', error.message);
        const errorCode = error.code;
        console.log('errorCode +>>>>>>>', errorCode);
        const message = error.code === '23505' ? 'Doi Id Of Book should Uniq' : error.message;
        console.log('message =====>>>>>>', message);
        return {
            status: 'Failed',
            message: message,
            errorCode: errorCode
        };
    });
}

module.exports.updatedEditedBookPublication = async(editedBookId, updatedEditedBookPublication, updatedEditedBookFiles, userName) => {

    const {authorName, bookTitle, edition, editorName, chapterTitle, publicationPlace, publisherCategory, pageNumber, publisherName, publicationYear,
            bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = updatedEditedBookPublication; 
    const supportingDocumentString = updatedEditedBookFiles ? updatedEditedBookFiles : null;
    const doiIdParsed = doiBookId === '' ? null : parseInt(doiBookId , 10);
    let querywithOutDoc =    `UPDATE edited_book_publications SET author_name = $2, book_title = $3, edition = $4, editor_name = $5, chapter_title = $6, publication_place = $7, publisher_category = $8, page_number = $9, publisher_name = $10, 
                            publication_year = $11, book_url = $12, doi_id = $13, isbn_no = $14, number_of_nmims_authors = $15, nmims_authors = $16, nmims_campus_authors = $17, nmims_school_authors = $18,  updated_by = $19`; 
    console.log('querywithOutDoc ====>>>', querywithOutDoc)
    let docQuery = supportingDocumentString ? `, supporting_documents = $20` : '';

    let queryText =  querywithOutDoc + docQuery + ` WHERE id = $1`;
    console.log('queryText ====>>>>', queryText);
    let values = [editedBookId, authorName, bookTitle, edition, editorName, chapterTitle, publicationPlace, publisherCategory, pageNumber, publisherName, publicationYear,
        bookUrl, doiIdParsed, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, userName, ...(supportingDocumentString ? [supportingDocumentString] : [])];
    let sql = {
        text : queryText,
        values : values
    }

    return researchDbW.query(sql)
    .then(result => {
        return {
            status: 'Done',
            message: "Record Updated Successfully",
            rowCount: result.rowCount
        };
    })
    .catch(error => {
        console.log('error.code ====>>>', error.code);
        console.log('error.constraint ====>>>>>', error.constraint);
        console.log('error.message ====>>>', error.message);
        const errorCode = error.code;
        console.log('errorCode +>>>>>>>', errorCode);
        const message = error.code === '23505' ? 'Doi Id Of Book should Uniq' : error.message;
        console.log('message =====>>>>>>', message);
        return {
            status: 'Failed',
            message: message,
            errorCode: errorCode
        };
    });
    
// }
//         let sql = {
//             text : `UPDATE edited_book_publications SET author_name = $2, book_title = $3, edition = $4, editor_name = $5, chapter_title = $6, publication_place = $7, publisher_category = $8, page_number = $9, publisher_name = $10, 
//                    publication_year = $11, book_url = $12, doi_id = $13, isbn_no = $14, number_of_nmims_authors = $15, nmims_authors = $16, nmims_campus_authors = $17, nmims_school_authors = $18, supporting_documents = $19 WHERE id = $1`,
//             values : [editedBookId, authorName, bookTitle, edition, editorName, chapterTitle, publicationPlace, publisherCategory, pageNumber, publisherName, publicationYear,
//                 bookUrl, doiIdParsed, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, updatedEditedBookFiles]
//         }
//         try {
//             const result = await researchDbW.query(sql);
//             if (result.rowCount > 0) {
//                 console.log('sql ====>>>', sql)
//                 console.log('Updated successful:', result.rowCount, 'Row(s) Updated.');
//                 return { status: 'Done' };
//             } else {
//                 console.log('No record found or updated with id:', journalPaperId);
//                 return { status: 'Failed', error: 'No record found or updated' };
//             }
//         } catch (error) {
//             console.error('Error on update:', error.code, error.message);
//             return { status: 'Failed', error: error.message };
//         }

    

    // else{
    //     const {authorName, bookTitle, edition, editorName, chapterTitle, publicationPlace, publisherCategory, pageNumber, publisherName, publicationYear,
    //         bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = updatedEditedBookPublication;                      
    //     let sql = {
    //         text : `UPDATE edited_book_publications SET author_name = $2, book_title = $3, edition = $4, editor_name = $5, chapter_title = $6, publication_place = $7, publisher_category = $8, page_number = $9, publisher_name = $10, 
    //                publication_year = $11, book_url = $12, doi_id = $13, isbn_no = $14, number_of_nmims_authors = $15, nmims_authors = $16, nmims_campus_authors = $17, nmims_school_authors = $18 WHERE id = $1`,
    //         values : [editedBookId, authorName, bookTitle, edition, editorName, chapterTitle, publicationPlace, publisherCategory, pageNumber, publisherName, publicationYear,
    //             bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors]
    //     }
    //     try {
    //         const result = await researchDbW.query(sql);
    //         if (result.rowCount > 0) {
    //             console.log('sql ====>>>', sql)
    //             console.log('Updated successful:', result.rowCount, 'Row(s) Updated.');
    //             return { status: 'Done' };
    //         } else {
    //             console.log('No record found or updated with id:', journalPaperId);
    //             return { status: 'Failed', error: 'No record found or updated' };
    //         }
    //     } catch (error) {
    //         console.error('Error on update:', error.code, error.message);
    //         return { status: 'Failed', error: error.message };
    //     }
    // }
   
    
}

module.exports.deleteEditedBookPublicationData = async(editedBookId) => {
    let sql = {
        text : `DELETE FROM edited_book_publications WHERE id = $1`,
        values : [editedBookId]
    }
    return researchDbW.query(sql);
}

module.exports.viewEditedBookPublicationData = async(editedBookId, userName) => {
    let sql = {
        text : `SELECT * FROM edited_book_publications WHERE id = $1 AND created_by = $2`,
        values : [editedBookId, userName]
    }
    return researchDbW.query(sql);
}

