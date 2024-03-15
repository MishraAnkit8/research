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
        bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = bookPublicationData;
    const doiBookIdParsed = doiBookId === "" ? null : parseInt(doiBookId, 10);

    let sql = {
        text : `INSERT INTO book_publications ( author_last_name, book_title, edition, publication_place, publisher_category, volume_number, publisher_name, 
            publication_year, book_url, doi_id, isbn, number_of_nmims_authors, nmims_authors, nmims_campus_authors, nmims_school_authors, supporting_documents)
            VALUES ($1, $2 , $3 ,$4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id `,
        values : [ authorLastName, bookTitle, edition, publicationPlace, publisherCategory, volumeNumber, publisherName, publicationYear,
            bookUrl, doiBookIdParsed, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, bookPublicationfileData]
    }
    
    //handle promise and throw error in case of insert 
	return researchDbW.query(sql)
    .then(result => {
        return {
            status: 'Done',
            message: "Record Inserted Successfully",
            rowCount: result.rowCount,
            id : result.rows[0].id
        };
    })
    .catch(error => {
        console.log('error.code ====>>>', error.code);
        console.log('error.constraint ====>>>>>', error.constraint);
        console.log('error.message ====>>>', error.message);
        const message = error.code === '23505' ? 'Doi Id Of Book should Uniq' : error.message;
        console.log('message =====>>>>>>', message);
        return {
            status: 'Failed',
            message: message,
            errorCode: error.code
        };
    });
}

module.exports.updatedBookPublication = async(bookPublicationId, updatedBookPublicationData, upadteDataFileString) => {
    const { authorLastName, bookTitle, edition, publicationPlace, publisherCategory, volumeNumber, publisherName, publicationYear,
        bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = updatedBookPublicationData;
    
    const doiBookIdParsed = doiBookId === "" ? null : parseInt(doiBookId, 10);
    const DataFileString = upadteDataFileString ? upadteDataFileString : null;

    let baseQuery = `UPDATE book_publications SET author_last_name = $2, book_title = $3, edition = $4, publication_place = $5, publisher_category = $6, volume_number = $7, publisher_name = $8, 
    publication_year = $9, book_url = $10, doi_id = $11, isbn = $12, number_of_nmims_authors = $13, nmims_authors = $14, nmims_campus_authors = $15, nmims_school_authors = $16`;

    let supportingDocumentsUpdate = DataFileString ? `, supporting_documents = $17` : '';
    //merge both query 
    let queryText = baseQuery + supportingDocumentsUpdate + ` WHERE id = $1`;

    console.log('queryText ====>>>>', queryText);
    let values = [
        bookPublicationId, authorLastName, bookTitle, edition, publicationPlace, publisherCategory, volumeNumber, publisherName, publicationYear,
        bookUrl, doiBookIdParsed, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, ...(DataFileString ? [DataFileString] : [])
    ];

    let sql = {
        text: queryText,
        values: values
    };
    
    //handle promise and throw error in case of Update 
    return researchDbW.query(sql)
    .then(result => {
        console.log('sql ===>>>', sql);
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
        const message = error.code === '23505' ? 'Doi Id Of Book should Uniq' : error.message;
        console.log('message =====>>>>>>', message);
        return {
            status: 'Failed',
            message: message,
            errorCode: error.code
        };
    });
    // try {
    //     const result = await researchDbW.query(sql); 
    //     console.log('sql inside try ====>>>>',sql)
    //     console.log('Record Updated successfully');
    //     return{status: 'Done', message : 'Record Updated successfully', rowCount : result.rowCount}

    // } catch (error) {
    //     const message = error.code === '23505' ? "DOI ID Of Book Publication Should Be Unique" : error.message;
    //     const errorCode = error.code;
    //     return{status : 'Failed', message : message , errorCode : errorCode}
    // };

    // return researchDbW.query(sql)
//  }
//  else{
//     const { authorLastName, bookTitle, edition, publicationPlace, publisherCategory, volumeNumber, publisherName, publicationYear,
//         bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = updatedBookPublicationData;
//     let sql = {
//         text : `UPDATE book_publications SET  author_last_name = $2, book_title = $3, edition = $4, publication_place = $5, publisher_category = $6, volume_number = $7, publisher_name = $8, 
//                publication_year = $9, book_url = $10, doi_id = $11, isbn = $12, number_of_nmims_authors = $13, nmims_authors = $14, nmims_campus_authors = $15, nmims_school_authors = $16 WHERE id = $1`,
//         values : [bookPublicationId,  authorLastName, bookTitle, edition, publicationPlace, publisherCategory, volumeNumber, publisherName, publicationYear,
//                   bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors]
//     }
   
    
}

module.exports.deleteBookPublicationData = async(bookPublicationId) => {
    let sql = {
        text : `DELETE FROM book_publications WHERE id = $1`,
        values : [bookPublicationId]
    }
    return researchDbW.query(sql)
    .then((result) => {
      return { status: 'Done', message: 'Book Publication Related Record deleted successfully.' , rowCount : result.rowCount};
    })
    .catch((error) => {
      console.error('Error deleting book chapter:', error);
      return { status: 'Failed', message: error.message, errorCode : error.code };
    });
}

module.exports.viewBookPublicationData = async(bookPublicationId) => {
    let sql = {
        text : `SELECT * FROM book_publications WHERE id = $1`,
        values : [bookPublicationId]
    }
    return researchDbW.query(sql)
}

