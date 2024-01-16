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
    const {authorName, bookTitle, edition, editorName, chapterTitle, volumeNumber, publisherCategory, pageNumber, publisherName, publicationYear,
        bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = bookChapter
    let sql = {
        text : `INSERT INTO book_chapter_publications (author_name, book_title, edition, editor_name, chapter_title, volume_number, publisher_category, page_number, publisher_name, 
            publication_year, book_url, doi_id, isbn, number_of_nmims_authors, nmims_authors, nmims_campus_authors, nmims_school_authors, supporting_documents)
            VALUES ($1, $2 , $3 ,$4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING id `,
        values : [authorName, bookTitle, edition, editorName, chapterTitle, volumeNumber, publisherCategory, pageNumber, publisherName, publicationYear,
            bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, filename]
    }
    console.log('sql ===>>', sql)
    return autoDbW.query(sql)
}

module.exports.updatedBookChapter = async(bookChapterId, updatedBookChapterPublication, updatedFile) => {
    const {authorName, bookTitle, edition, editorName, chapterTitle, volumeNumber, publisherCategory, pageNumber, publisherName, publicationYear,
        bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = updatedBookChapterPublication;                      
    let sql = {
        text : `UPDATE book_chapter_publications SET author_name = $2, book_title = $3, edition = $4, editor_name = $5, chapter_title = $6, volume_number = $7, publisher_category = $8, page_number = $9, publisher_name = $10, 
               publication_year = $11, book_url = $12, doi_id = $13, isbn = $14, number_of_nmims_authors = $15, nmims_authors = $16, nmims_campus_authors = $17, nmims_school_authors = $18, supporting_documents = $19 WHERE id = $1`,
        values : [bookChapterId, authorName, bookTitle, edition, editorName, chapterTitle, volumeNumber, publisherCategory, pageNumber, publisherName, publicationYear,
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

