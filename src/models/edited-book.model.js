const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

const insertDbModels = require('./insert-update-records.models');


module.exports.fetchEditedBookPublication = async (userName) => {
  let sql = {
    text: `SELECT * FROM edited_book_publications WHERE created_by = $1 and active=true ORDER BY id desc`,
    values: [userName],
  };
  console.log("sql ==>", sql);
  return researchDbR.query(sql);
};

module.exports.insertEditedBook = async (editedBook, editedBookFilesData, userName) => {

  const {
    authorName, bookTitle, edition, editorName, publicationPlace, publisherCategory,
    publisherName, publicationYear, bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors,
    nmimsSchoolAuthors
  } = editedBook;

  const editedBookValues = [authorName, bookTitle, edition, editorName, publicationPlace, publisherCategory,
    publisherName, publicationYear, bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors,
    nmimsSchoolAuthors, editedBookFilesData, userName];

  const editedBookField =  ['author_name', 'book_title', 'edition', 'editor_name', 'publication_place', 'publisher_category', 'publisher_name', 
    'publication_year', 'book_url', 'doi_id', 'isbn_no', 'number_of_nmims_authors', 'nmims_authors', 'nmims_campus_authors', 'nmims_school_authors', 'supporting_documents', 'created_by']

  const insertEditedBook = await insertDbModels.insertRecordIntoMainDb('edited_book_publications', editedBookField, editedBookValues, userName);

  console.log('insertEditedBook ====>>>>>>', insertEditedBook);
  const message = insertEditedBook.errorCode === '23505' ? "This WebLink /DOI No. already used with another form" : insertEditedBook.message;

  return insertEditedBook.status === "Done" ? {
    status : insertEditedBook.status,
    message : insertEditedBook.message
  } : {
    status : insertEditedBook.status,
    message : message,
    errorCode : insertEditedBook.errorCode
  }


};

module.exports.updatedEditedBookPublication = async (editedBookId, updatedEditedBookPublication, updatedEditedBookFiles,
  userName) => {

  const {
    authorName, bookTitle, edition, editorName, publicationPlace, publisherCategory,
    publisherName, publicationYear, bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors,
    nmimsSchoolAuthors } = updatedEditedBookPublication;

    let updateEditedBook; 
    if(updatedEditedBookFiles){
      const editedBookValues = [authorName, bookTitle, edition, editorName, publicationPlace, publisherCategory,
        publisherName, publicationYear, bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors,
        nmimsSchoolAuthors, updatedEditedBookFiles, userName, editedBookId];
    
      const editedBookField =  ['author_name', 'book_title', 'edition', 'editor_name', 'publication_place', 'publisher_category', 'publisher_name', 
        'publication_year', 'book_url', 'doi_id', 'isbn_no', 'number_of_nmims_authors', 'nmims_authors', 'nmims_campus_authors', 'nmims_school_authors', 'supporting_documents', 'updated_by']
    
      updateEditedBook = await insertDbModels.updateFieldWithFiles('edited_book_publications', editedBookField, editedBookValues, userName);
    
    }
    else{
      const editedBookValues = [authorName, bookTitle, edition, editorName, publicationPlace, publisherCategory,
        publisherName, publicationYear, bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors,
        nmimsSchoolAuthors, userName, editedBookId];
    
      const editedBookField =  ['author_name', 'book_title', 'edition', 'editor_name', 'publication_place', 'publisher_category', 'publisher_name', 
        'publication_year', 'book_url', 'doi_id', 'isbn_no', 'number_of_nmims_authors', 'nmims_authors', 'nmims_campus_authors', 'nmims_school_authors', 'updated_by']
    
        updateEditedBook = await insertDbModels.updateFieldWithOutFiles('edited_book_publications', editedBookField, editedBookValues, userName);
    
    }

  console.log('updateEditedBook ===>>>>>>', updateEditedBook);

  const message = updateEditedBook.errorCode === '23505' ? "This WebLink /DOI No. already used with another form" : updateEditedBook.message;

  return updateEditedBook.status === "Done" ? {
    status : updateEditedBook.status,
    message : updateEditedBook.message
  } : {
    status : updateEditedBook.status,
    message : message,
    errorCode : updateEditedBook.errorCode
  }


};

module.exports.deleteEditedBookPublicationData = async (editedBookId) => {
  let sql = {
    // text : `DELETE FROM edited_book_publications WHERE id = $1`,
    text: `UPDATE edited_book_publications set active=false WHERE id = $1`,
    values: [editedBookId],
  };
  return researchDbW.query(sql);
};

module.exports.viewEditedBookPublicationData = async (
  editedBookId,
  userName
) => {
  let sql = {
    text: `SELECT * FROM edited_book_publications WHERE id = $1 and active=true AND created_by = $2`,
    values: [editedBookId, userName],
  };
  return researchDbW.query(sql);
};
