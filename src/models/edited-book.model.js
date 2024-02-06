const { autoriders_read_db, autoriders_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const autoDbR = dbPoolManager.get('autoDbR', autoriders_read_db);
const autoDbW = dbPoolManager.get('autoDbW', autoriders_write_db);

module.exports.fetchEditedBookPublication = async() => {
    let sql = {
        text : `SELECT * FROM edited_book_publications ORDER BY id`
    }
    console.log('sql ==>', sql)
    return autoDbR.query(sql)
}

module.exports.insertEditedBook = async(editedBook, editedBookFilesData) => {
    const {authorName, bookTitle, edition, editorName, chapterTitle, publicationPlace, publisherCategory, pageNumber, publisherName, publicationYear,
        bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = editedBook
    let sql = {
        text : `INSERT INTO edited_book_publications (author_name, book_title, edition, editor_name, chapter_title, publication_place, publisher_category, page_number, publisher_name, 
            publication_year, book_url, doi_id, isbn_no, number_of_nmims_authors, nmims_authors, nmims_campus_authors, nmims_school_authors, supporting_documents)
            VALUES ($1, $2 , $3 ,$4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING id `,
        values : [authorName, bookTitle, edition, editorName, chapterTitle, publicationPlace, publisherCategory, pageNumber, publisherName, publicationYear,
            bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, editedBookFilesData]
    }
    console.log('sql ===>>', sql)
    return autoDbW.query(sql)
}

module.exports.updatedEditedBookPublication = async(editedBookId, updatedEditedBookPublication, updatedEditedBookFiles) => {
    if(updatedEditedBookFiles) {
        const {authorName, bookTitle, edition, editorName, chapterTitle, publicationPlace, publisherCategory, pageNumber, publisherName, publicationYear,
            bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = updatedEditedBookPublication;                      
        let sql = {
            text : `UPDATE edited_book_publications SET author_name = $2, book_title = $3, edition = $4, editor_name = $5, chapter_title = $6, publication_place = $7, publisher_category = $8, page_number = $9, publisher_name = $10, 
                   publication_year = $11, book_url = $12, doi_id = $13, isbn_no = $14, number_of_nmims_authors = $15, nmims_authors = $16, nmims_campus_authors = $17, nmims_school_authors = $18, supporting_documents = $19 WHERE id = $1`,
            values : [editedBookId, authorName, bookTitle, edition, editorName, chapterTitle, publicationPlace, publisherCategory, pageNumber, publisherName, publicationYear,
                bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, updatedEditedBookFiles]
        }
        return autoDbW.query(sql)

    }

    else{
        const {authorName, bookTitle, edition, editorName, chapterTitle, publicationPlace, publisherCategory, pageNumber, publisherName, publicationYear,
            bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = updatedEditedBookPublication;                      
        let sql = {
            text : `UPDATE edited_book_publications SET author_name = $2, book_title = $3, edition = $4, editor_name = $5, chapter_title = $6, publication_place = $7, publisher_category = $8, page_number = $9, publisher_name = $10, 
                   publication_year = $11, book_url = $12, doi_id = $13, isbn_no = $14, number_of_nmims_authors = $15, nmims_authors = $16, nmims_campus_authors = $17, nmims_school_authors = $18 WHERE id = $1`,
            values : [editedBookId, authorName, bookTitle, edition, editorName, chapterTitle, publicationPlace, publisherCategory, pageNumber, publisherName, publicationYear,
                bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors]
        }
        return autoDbW.query(sql)
    }
   
    
}

module.exports.deleteEditedBookPublicationData = async(editedBookId) => {
    let sql = {
        text : `DELETE FROM edited_book_publications WHERE id = $1`,
        values : [editedBookId]
    }
    return autoDbW.query(sql);
}

module.exports.viewEditedBookPublicationData = async(editedBookId) => {
    let sql = {
        text : `SELECT * FROM edited_book_publications WHERE id = $1`,
        values : [editedBookId]
    }
    return autoDbW.query(sql);
}

