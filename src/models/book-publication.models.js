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

module.exports.insertBookPublicationData = async(bookPublicationData , filename) => {
    let sql = {
        text : `INSERT INTO book_publications (author_first_name, author_last_name, book_title, edition, publication_place, publisher_category, volume_number, publisher_name, 
            publication_year, book_url, doi_id, isbn, number_of_nmims_authors, nmims_authors, nmims_campus_authors, nmims_school_authors, supporting_documents)
            VALUES ($1, $2 , $3 ,$4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id `,
        values : [authorFirstName, authorLastName, booktitle, edition, ]
    }
}