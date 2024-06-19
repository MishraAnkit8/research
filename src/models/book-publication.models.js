const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

const insertDbModels = require('./insert-update-records.models');

module.exports.fetchBookPublication = async (userName) => {
  let sql = {
    text: `SELECT * FROM book_publications WHERE created_by = $1 and active=true ORDER BY id desc`,
    values: [userName],
  };
  console.log("sql ==>", sql);
  return researchDbR.query(sql);
};

module.exports.insertBookPublicationData = async (bookPublicationData, bookPublicationfileData, userName) => {

  const { authorName, bookTitle, edition, publicationPlace, publisherCategory,
    volumeNumber, publisherName, publicationYear, bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors,
    nmimsSchoolAuthors} = bookPublicationData;
 

  const bookPublicationValues = [ authorName, bookTitle, edition, publicationPlace, publisherCategory,
    volumeNumber, publisherName, publicationYear, bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors,
    nmimsSchoolAuthors, bookPublicationfileData, userName];

  const bookPublicationField = ['author_last_name', 'book_title', 'edition', 'publication_place', 'publisher_category', 'volume_number', 'publisher_name', 
    'publication_year', 'book_url', 'doi_id', 'isbn', 'number_of_nmims_authors', 'nmims_authors', 'nmims_campus_authors', 'nmims_school_authors', 'supporting_documents', 'created_by'];

  const insertBookPublication = await insertDbModels.insertRecordIntoMainDb('book_publications', bookPublicationField, bookPublicationValues, userName);

  console.log('insertBookPublication ===>>>>>>', insertBookPublication);

  const message = insertBookPublication.errorCode === '23505' ? "This WebLink /DOI No. already used with another form" : insertBookPublication.message;

  return insertBookPublication.status === "Done" ? {
    status : insertBookPublication.status,
    message : insertBookPublication.message
  } : {
    status : insertBookPublication.status,
    message : message,
    errorCode : insertBookPublication.errorCode
  }

};

module.exports.updatedBookPublication = async (bookPublicationId, updatedBookPublicationData, upadteDataFileString,
  userName) => {

  const { authorName, bookTitle, edition, publicationPlace, publisherCategory,volumeNumber, publisherName,
    publicationYear, bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors,
    nmimsSchoolAuthors} = updatedBookPublicationData;

  let updateBookPublication;

  if(upadteDataFileString){
    const bookPublicationValues = [ authorName, bookTitle, edition, publicationPlace, publisherCategory,
      volumeNumber, publisherName, publicationYear, bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors,
      nmimsSchoolAuthors, upadteDataFileString, userName, bookPublicationId];
  
    const bookPublicationField = ['author_last_name', 'book_title', 'edition', 'publication_place', 'publisher_category', 'volume_number', 'publisher_name', 
      'publication_year', 'book_url', 'doi_id', 'isbn', 'number_of_nmims_authors', 'nmims_authors', 'nmims_campus_authors', 'nmims_school_authors', 'supporting_documents', 'updated_by'];
  
    updateBookPublication = await insertDbModels.updateFieldWithFiles('book_publications', bookPublicationField, bookPublicationValues, userName);
  
  } {
    const bookPublicationValues = [ authorName, bookTitle, edition, publicationPlace, publisherCategory,
      volumeNumber, publisherName, publicationYear, bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors,
      nmimsSchoolAuthors, userName, bookPublicationId];
  
    const bookPublicationField = ['author_last_name', 'book_title', 'edition', 'publication_place', 'publisher_category', 'volume_number', 'publisher_name', 
      'publication_year', 'book_url', 'doi_id', 'isbn', 'number_of_nmims_authors', 'nmims_authors', 'nmims_campus_authors', 'nmims_school_authors', 'updated_by'];
  
    updateBookPublication = await insertDbModels.updateFieldWithOutFiles('book_publications', bookPublicationField, bookPublicationValues, userName);
  
  }
  
  console.log('updateBookPublication ===>>>>>>', updateBookPublication);

  const message = updateBookPublication.errorCode === '23505' ? "This WebLink /DOI No. already used with another form" : updateBookPublication.message;

  return updateBookPublication.status === "Done" ? {
    status : updateBookPublication.status,
    message : updateBookPublication.message
  } : {
    status : updateBookPublication.status,
    message : message,
    errorCode : updateBookPublication.errorCode
  }
};

module.exports.deleteBookPublicationData = async (
  bookPublicationId,
  userName
) => {
  let sql = {
    // text : `DELETE FROM book_publications WHERE id = $1`,
    text: `UPDATE book_publications set active=false WHERE id = $1`,
    values: [bookPublicationId],
  };
  return researchDbW
    .query(sql)
    .then((result) => {
      return {
        status: "Done",
        message: "Book Publication Related Record deleted successfully.",
        rowCount: result.rowCount,
      };
    })
    .catch((error) => {
      console.error("Error deleting book chapter:", error);
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
};

module.exports.viewBookPublicationData = async (bookPublicationId) => {
  let sql = {
    text: `SELECT * FROM book_publications WHERE  id = $1 and active=true`,
    values: [bookPublicationId],
  };
  return researchDbW.query(sql);
};
