const { autoriders_read_db, autoriders_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const autoDbR = dbPoolManager.get('autoDbR', autoriders_read_db);
const autoDbW = dbPoolManager.get('autoDbW', autoriders_write_db);

module.exports.fetchEditedBookPublication = async() => {
    let sql = {
        text : `SELECT * FROM book_chapter_publications ORDER BY id`
    }
    console.log('sql ==>', sql)
    return autoDbR.query(sql)
}

module.exports.insertBookChapterData = async(bookChapter, filename) => {
    const {authorFirstName, authorLastName, bookTitle, edition, editorName, chapterTitle, volumeNumber, publisherCategory, pageNumber, publisherName, publicationYear,
        bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = bookChapter
    let sql = {
        text : `INSERT INTO book_chapter_publications (author_first_name, author_last_name, book_title, edition, editor_name, chapter_title, volume_number, publisher_category, page_number, publisher_name, 
            publication_year, book_url, doi_id, isbn_no, number_of_nmims_authors, nmims_authors, nmims_campus_authors, nmims_school_authors, supporting_documents)
            VALUES ($1, $2 , $3 ,$4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING id `,
        values : [authorFirstName, authorLastName, bookTitle, edition, editorName, chapterTitle, volumeNumber, publisherCategory, pageNumber, publisherName, publicationYear,
            bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, filename]
    }
    console.log('sql ===>>', sql)
    return autoDbW.query(sql)
}

module.exports.updatedBookChapter = async(bookChapterId, updatedBookChapterPublication, updatedFile) => {
    const {authorFirstName, authorLastName, bookTitle, edition, editorName, chapterTitle, volumeNumber, publisherCategory, pageNumber, publisherName, publicationYear,
        bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = updatedBookChapterPublication;                      
    let sql = {
        text : `UPDATE book_chapter_publications SET author_first_name = $2, author_last_name = $3, book_title = $4, edition = $5, editor_name = $6, chapter_title = $7, volume_number = $8, publisher_category = $9, page_number = $10, publisher_name = $11, 
               publication_year = $12, book_url = $13, doi_id = $14, isbn_no = $15, number_of_nmims_authors = $16, nmims_authors = $17, nmims_campus_authors = $18, nmims_school_authors = $19, supporting_documents = $20 WHERE id = $1`,
        values : [bookChapterId, authorFirstName, authorLastName, bookTitle, edition, editorName, chapterTitle, volumeNumber, publisherCategory, pageNumber, publisherName, publicationYear,
            bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, updatedFile]
    }
    return autoDbW.query(sql)
    
}

module.exports.deleteBookChapter = async(bookChapterId) => {
    let sql = {
        text : `DELETE FROM book_chapter_publications WHERE id = $1`,
        values : [bookChapterId]
    }
    return autoDbW.query(sql);
}

module.exports.viewBookChapterData = async(bookChapterId) => {
    let sql = {
        text : `SELECT * FROM book_chapter_publications WHERE id = $1`,
        values : [bookChapterId]
    }
    return autoDbW.query(sql);
}

