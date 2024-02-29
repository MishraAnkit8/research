const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchBookPublication = async() => {
    let sql = {
        text : `SELECT * FROM book_publications ORDER BY id`
    }
    console.log('sql ==>', sql)
    return researchDbR.query(sql)
}

module.exports.insertBookPublicationData = async(bookPublicationData, bookPublicationfileData) => {
    const { authorLastName, bookTitle, edition, publicationPlace, publisherCategory, volumeNumber, publisherName, publicationYear,
        bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = bookPublicationData
    let sql = {
        text : `INSERT INTO book_publications ( author_last_name, book_title, edition, publication_place, publisher_category, volume_number, publisher_name, 
            publication_year, book_url, doi_id, isbn, number_of_nmims_authors, nmims_authors, nmims_campus_authors, nmims_school_authors, supporting_documents)
            VALUES ($1, $2 , $3 ,$4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id `,
        values : [ authorLastName, bookTitle, edition, publicationPlace, publisherCategory, volumeNumber, publisherName, publicationYear,
            bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, bookPublicationfileData]
    }
    console.log('sql ===>>', sql)
    return researchDbW.query(sql)
}

module.exports.updatedBookPublication = async(bookPublicationId, updatedBookPublicationData, upadteDataFileString) => {
    if(upadteDataFileString) {
    const { authorLastName, bookTitle, edition, publicationPlace, publisherCategory, volumeNumber, publisherName, publicationYear,
        bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = updatedBookPublicationData;
    let sql = {
        text : `UPDATE book_publications SET  author_last_name = $2, book_title = $3, edition = $4, publication_place = $5, publisher_category = $6, volume_number = $7, publisher_name = $8, 
               publication_year = $9, book_url = $10, doi_id = $11, isbn = $12, number_of_nmims_authors = $13, nmims_authors = $14, nmims_campus_authors = $15, nmims_school_authors = $16, supporting_documents = $17 WHERE id = $1`,
        values : [bookPublicationId,  authorLastName, bookTitle, edition, publicationPlace, publisherCategory, volumeNumber, publisherName, publicationYear,
                  bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, upadteDataFileString]
    }
    return researchDbW.query(sql)
 }
 else{
    const { authorLastName, bookTitle, edition, publicationPlace, publisherCategory, volumeNumber, publisherName, publicationYear,
        bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = updatedBookPublicationData;
    let sql = {
        text : `UPDATE book_publications SET  author_last_name = $2, book_title = $3, edition = $4, publication_place = $5, publisher_category = $6, volume_number = $7, publisher_name = $8, 
               publication_year = $9, book_url = $10, doi_id = $11, isbn = $12, number_of_nmims_authors = $13, nmims_authors = $14, nmims_campus_authors = $15, nmims_school_authors = $16 WHERE id = $1`,
        values : [bookPublicationId,  authorLastName, bookTitle, edition, publicationPlace, publisherCategory, volumeNumber, publisherName, publicationYear,
                  bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors]
    }
    return researchDbW.query(sql)
 }
    
}

module.exports.deleteBookPublicationData = async(bookPublicationId) => {
    let sql = {
        text : `DELETE FROM book_publications WHERE id = $1`,
        values : [bookPublicationId]
    }
    return researchDbW.query(sql);
}

module.exports.viewBookPublicationData = async(bookPublicationId) => {
    let sql = {
        text : `SELECT * FROM book_publications WHERE id = $1`,
        values : [bookPublicationId]
    }
    return researchDbW.query(sql);
}

