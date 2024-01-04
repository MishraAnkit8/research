const { autoriders_read_db, autoriders_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const autoDbR = dbPoolManager.get('autoDbR', autoriders_read_db);
const autoDbW = dbPoolManager.get('autoDbW', autoriders_write_db);

module.exports.fetchBookPublication = async() => {
    let sql = {
        text : `SELECT * FROM book_publications ORDER BY id`
    }
    console.log('sql ==>', sql)
    return autoDbR.query(sql)
}

module.exports.insertBookPublicationData = async(bookPublicationData, filename) => {
    const {authorFirstName, authorLastName, bookTitle, edition, publicationPlace, publisherCategory, volumeNumber, publisherName, publicationYear,
        bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = bookPublicationData
    let sql = {
        text : `INSERT INTO book_publications (author_first_name, author_last_name, book_title, edition, publication_place, publisher_category, volume_number, publisher_name, 
            publication_year, book_url, doi_id, isbn, number_of_nmims_authors, nmims_authors, nmims_campus_authors, nmims_school_authors, supporting_documents)
            VALUES ($1, $2 , $3 ,$4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id `,
        values : [authorFirstName, authorLastName, bookTitle, edition, publicationPlace, publisherCategory, volumeNumber, publisherName, publicationYear,
            bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, filename]
    }
    console.log('sql ===>>', sql)
    return autoDbW.query(sql)
}

module.exports.updatedBookPublication = async(bookPublicationId, updatedBookPublicationData, updatedFile) => {
    const {authorFirstName, authorLastName, bookTitle, edition, publicationPlace, publisherCategory, volumeNumber, publisherName, publicationYear,
        bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = updatedBookPublicationData;
    let sql = {
        text : `UPDATE book_publications SET author_first_name = $2, author_last_name = $3, book_title = $4, edition = $5, publication_place = $6, publisher_category = $7, volume_number = $8, publisher_name = $9, 
               publication_year = $10, book_url = $11, doi_id = $12, isbn = $13, number_of_nmims_authors = $14, nmims_authors = $15, nmims_campus_authors = $16, nmims_school_authors = $17, supporting_documents = $18 WHERE id = $1`,
        values : [bookPublicationId, authorFirstName, authorLastName, bookTitle, edition, publicationPlace, publisherCategory, volumeNumber, publisherName, publicationYear,
                  bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, updatedFile]
    }
    return autoDbW.query(sql)
    
}

module.exports.deleteBookPublicationData = async(bookPublicationId) => {
    let sql = {
        text : `DELETE FROM book_publications WHERE id = $1`,
        values : [bookPublicationId]
    }
    return autoDbW.query(sql);
}

module.exports.viewBookPublicationData = async(bookPublicationId) => {
    let sql = {
        text : `SELECT * FROM book_publications WHERE id = $1`,
        values : [bookPublicationId]
    }
    return autoDbW.query(sql);
}

