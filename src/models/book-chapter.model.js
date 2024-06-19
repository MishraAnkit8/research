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
    text: `SELECT * FROM book_chapter_publications WHERE created_by = $1 and active=true ORDER BY id desc`,
    values: [userName],
  };
  console.log("sql ==>", sql);
  return researchDbR.query(sql);
};

module.exports.insertBookChapterData = async (bookChapter, bookChapterDataFiles, userName) => {
  console.log("user name in models ===>>>>>", userName);
  const {
    authorName, bookTitle, edition, bookEditor, chapterTitle, volumeNumber, publisherCategory, pageNumber,
    publisherName, publicationYear, bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors,
    nmimsSchoolAuthors} = bookChapter;
  
  const bookChapterValues = [authorName, bookTitle, edition, bookEditor, chapterTitle, volumeNumber, publisherCategory, pageNumber,
    publisherName, publicationYear, bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors,
    nmimsSchoolAuthors, bookChapterDataFiles, userName];

  const bookChapterField = ['author_name', 'book_title', 'edition', 'book_editor', 'chapter_title', 'volume_number', 'publisher_category', 'page_number', 'publisher_name', 
    'publication_year', 'book_url', 'doi_id', 'isbn', 'number_of_nmims_authors', 'nmims_authors', 'nmims_campus_authors', 'nmims_school_authors', 'supporting_documents', 'created_by'];

    const insertBookChapter = await insertDbModels.insertRecordIntoMainDb('book_chapter_publications', bookChapterField, bookChapterValues, userName);

    console.log('insertBookChapter ===>>>>>>', insertBookChapter);
  
    const message = insertBookChapter.errorCode === '23505' ? "This WebLink /DOI No. already used with another form" : insertBookChapter.message;
  
    return insertBookChapter.status === "Done" ? {
      status : insertBookChapter.status,
      message : insertBookChapter.message
    } : {
      status : insertBookChapter.status,
      message : message,
      errorCode : insertBookChapter.errorCode
    }
};

module.exports.updatedBookChapter = async (bookChapterId, updatedBookChapterPublication, updateBookChapterDataFiles,
  userName) => {
  const {
    authorName, bookTitle, edition, bookEditor, chapterTitle, volumeNumber, publisherCategory, pageNumber,
    publisherName, publicationYear, bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors,
    nmimsSchoolAuthors} = updatedBookChapterPublication;
    let updateBookChapter ;

    if(updateBookChapterDataFiles){
      const bookChapterValues = [authorName, bookTitle, edition, bookEditor, chapterTitle, volumeNumber, publisherCategory, pageNumber,
        publisherName, publicationYear, bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors,
        nmimsSchoolAuthors, updateBookChapterDataFiles, userName, bookChapterId];
    
      const bookChapterField = ['author_name', 'book_title', 'edition', 'book_editor', 'chapter_title', 'volume_number', 'publisher_category', 'page_number', 'publisher_name', 
        'publication_year', 'book_url', 'doi_id', 'isbn', 'number_of_nmims_authors', 'nmims_authors', 'nmims_campus_authors', 'nmims_school_authors', 'supporting_documents', 'updated_by'];
    
        updateBookChapter = await insertDbModels.updateFieldWithFiles('book_chapter_publications', bookChapterField, bookChapterValues, userName);
      }
      else{
        const bookChapterValues = [authorName, bookTitle, edition, bookEditor, chapterTitle, volumeNumber, publisherCategory, pageNumber,
          publisherName, publicationYear, bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors,
          nmimsSchoolAuthors, updateBookChapterDataFiles, userName, bookChapterId];
      
        const bookChapterField = ['author_name', 'book_title', 'edition', 'book_editor', 'chapter_title', 'volume_number', 'publisher_category', 'page_number', 'publisher_name', 
          'publication_year', 'book_url', 'doi_id', 'isbn', 'number_of_nmims_authors', 'nmims_authors', 'nmims_campus_authors', 'nmims_school_authors', 'supporting_documents', 'updated_by'];
      
        updateBookChapter = await insertDbModels.updateFieldWithOutFiles('book_chapter_publications', bookChapterField, bookChapterValues, userName);

      }
        console.log('updateBookChapter ===>>>>>>', updateBookChapter);
      
        const message = updateBookChapter.errorCode === '23505' ? "This WebLink /DOI No. already used with another form" : updateBookChapter.message;
      
        return updateBookChapter.status === "Done" ? {
          status : updateBookChapter.status,
          message : updateBookChapter.message
        } : {
          status : updateBookChapter.status,
          message : message,
          errorCode : updateBookChapter.errorCode
        }
};

module.exports.deleteBookChapter = async (bookChapterId) => {
  let sql = {
    
    text: `UPDATE book_chapter_publications set active=false WHERE id = $1`,
    values: [bookChapterId],
  };
  //handle promis for deleting record
  return researchDbW
    .query(sql)
    .then(() => {
      return { status: "Done", message: "Record Deleted successfully." };
    })
    .catch((error) => {
      console.error("Error Deleting ReCord:", error);
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
};

module.exports.viewBookChapterData = async (bookChapterId, userName) => {
  let sql = {
    text: `SELECT * FROM book_chapter_publications WHERE id = $1 AND created_by = $2 and active=true`,
    values: [bookChapterId, userName],
  };
  return researchDbW.query(sql);
};
