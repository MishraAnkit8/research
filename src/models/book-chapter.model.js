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

module.exports.insertBookChapterData = async(bookChapter, bookChapterDataFiles) => {
    const {authorName, bookTitle, edition, editorName, bookEditor, chapterTitle, volumeNumber, publisherCategory, pageNumber, publisherName, publicationYear,
        bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = bookChapter
    let sql = {
        text : `INSERT INTO book_chapter_publications (author_name, book_title, edition, editor_name, book_editor, chapter_title, volume_number, publisher_category, page_number, publisher_name, 
            publication_year, book_url, doi_id, isbn, number_of_nmims_authors, nmims_authors, nmims_campus_authors, nmims_school_authors, supporting_documents)
            VALUES ($1, $2 , $3 ,$4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING id `,
        values : [authorName, bookTitle, edition, editorName, bookEditor, chapterTitle, volumeNumber, publisherCategory, pageNumber, publisherName, publicationYear,
            bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, bookChapterDataFiles]
    }
    console.log('sql ===>>', sql)
    return autoDbW.query(sql)
}

module.exports.updatedBookChapter = async(bookChapterId, updatedBookChapterPublication, updateBookChapterDataFiles) => {
    if(updateBookChapterDataFiles){
        const {authorName, bookTitle, edition, editorName, bookEditor, chapterTitle, volumeNumber, publisherCategory, pageNumber, publisherName, publicationYear,
            bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = updatedBookChapterPublication;                      
        let sql = {
            text : `UPDATE book_chapter_publications SET author_name = $2, book_title = $3, edition = $4, editor_name = $5, book_editor = $6, chapter_title = $7, volume_number = $8, publisher_category = $9, page_number = $10, publisher_name = $11, 
                   publication_year = $12, book_url = $13, doi_id = $14, isbn = $15, number_of_nmims_authors = $16, nmims_authors = $17, nmims_campus_authors = $18, nmims_school_authors = $19, supporting_documents = $20 WHERE id = $1`,
            values : [bookChapterId, authorName, bookTitle, edition, editorName, bookEditor, chapterTitle, volumeNumber, publisherCategory, pageNumber, publisherName, publicationYear,
                bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, updateBookChapterDataFiles]
        }
        return autoDbW.query(sql)

    }
    else{
        const {authorName, bookTitle, edition, editorName, bookEditor, chapterTitle, volumeNumber, publisherCategory, pageNumber, publisherName, publicationYear,
            bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = updatedBookChapterPublication;                      
        let sql = {
            text : `UPDATE book_chapter_publications SET author_name = $2, book_title = $3, edition = $4, editor_name = $5, book_editor = $6, chapter_title = $7, volume_number = $8, publisher_category = $9, page_number = $10, publisher_name = $11, 
                   publication_year = $12, book_url = $13, doi_id = $14, isbn = $15, number_of_nmims_authors = $16, nmims_authors = $17, nmims_campus_authors = $18, nmims_school_authors = $19 WHERE id = $1`,
            values : [bookChapterId, authorName, bookTitle, edition, editorName, bookEditor, chapterTitle, volumeNumber, publisherCategory, pageNumber, publisherName, publicationYear,
                bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors]
        }
        return autoDbW.query(sql)
    }
   
    
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

