const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

module.exports.fetchEditedBookPublication = async (userName) => {
  let sql = {
    text: `SELECT * FROM book_chapter_publications WHERE created_by = $1 and active=true ORDER BY id desc`,
    values: [userName],
  };
  console.log("sql ==>", sql);
  return researchDbR.query(sql);
};

module.exports.insertBookChapterData = async (
  bookChapter,
  bookChapterDataFiles,
  userName
) => {
  console.log("user name in models ===>>>>>", userName);
  const {
    authorName,
    bookTitle,
    edition,
    // editorName,
    bookEditor,
    chapterTitle,
    volumeNumber,
    publisherCategory,
    pageNumber,
    publisherName,
    publicationYear,
    bookUrl,
    doiBookId,
    isbnNo,
    numberOfNmimsAuthors,
    nmimsAuthors,
    nmimsCampusAuthors,
    nmimsSchoolAuthors,
  } = bookChapter;
  // const doiBookIdParsed = doiBookId === "" ? null : parseInt(doiBookId, 10);
  let sql = {
    text: `INSERT INTO book_chapter_publications (author_name, book_title, edition, book_editor, chapter_title, volume_number, publisher_category, page_number, publisher_name, 
            publication_year, book_url, doi_id, isbn, number_of_nmims_authors, nmims_authors, nmims_campus_authors, nmims_school_authors, supporting_documents, created_by)
            VALUES ($1, $2 , $3 ,$4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING id `,
    values: [
      authorName,
      bookTitle,
      edition,
      // editorName,
      bookEditor,
      chapterTitle,
      volumeNumber,
      publisherCategory,
      pageNumber,
      publisherName,
      publicationYear,
      bookUrl,
      doiBookId,
      isbnNo,
      numberOfNmimsAuthors,
      nmimsAuthors,
      nmimsCampusAuthors,
      nmimsSchoolAuthors,
      bookChapterDataFiles,
      userName,
    ],
  };
  //handling by tre and catch
  return researchDbW
    .query(sql)
    .then((result) => {
      return {
        status: "Done",
        message: "Record Inserted Successfully",
        rowCount: result.rowCount,
        id: result.rows[0].id,
      };
    })
    .catch((error) => {
      console.log("error.code ====>>>", error.code);
      console.log("error.constraint ====>>>>>", error.constraint);
      console.log("error.message ====>>>", error.message);
      const message =
        error.code === "23505" ? " This WebLink /DOI No. already used with another form " : error.message;
      console.log("message =====>>>>>>", message);
      return {
        status: "Failed",
        message: message,
        errorCode: error.code,
      };
    });
};

module.exports.updatedBookChapter = async (
  bookChapterId,
  updatedBookChapterPublication,
  updateBookChapterDataFiles,
  userName
) => {
  const {
    authorName,
    bookTitle,
    edition,
    bookEditor,
    chapterTitle,
    volumeNumber,
    publisherCategory,
    pageNumber,
    publisherName,
    publicationYear,
    bookUrl,
    doiBookId,
    isbnNo,
    numberOfNmimsAuthors,
    nmimsAuthors,
    nmimsCampusAuthors,
    nmimsSchoolAuthors,
  } = updatedBookChapterPublication;

  // const doiBookIdParsed = doiBookId === "" ? null : parseInt(doiBookId, 10);
  const supportingDocuments = updateBookChapterDataFiles || null;

  const sql = {
    text: `UPDATE book_chapter_publications SET author_name = $2, book_title = $3, edition = $4, book_editor = $5, chapter_title = $6, volume_number = $7, publisher_category = $8, page_number = $9, publisher_name = $10,
               publication_year = $11, book_url = $12, doi_id = $13, isbn = $14, number_of_nmims_authors = $15, nmims_authors = $16, nmims_campus_authors = $17, nmims_school_authors = $18, supporting_documents = $19, updated_by = $20 WHERE id = $1`,
    values: [
      bookChapterId,
      authorName,
      bookTitle,
      edition,
      bookEditor,
      chapterTitle,
      volumeNumber,
      publisherCategory,
      pageNumber,
      publisherName,
      publicationYear,
      bookUrl,
      doiBookId,
      isbnNo,
      numberOfNmimsAuthors,
      nmimsAuthors,
      nmimsCampusAuthors,
      nmimsSchoolAuthors,
      supportingDocuments,
      userName,
    ],
  };
  return researchDbW
    .query(sql)
    .then((result) => {
      console.log("sql ===>>>", sql);
      return {
        status: "Done",
        message: "Record Updated Successfully",
        rowCount: result.rowCount,
      };
    })
    .catch((error) => {
      console.log("error.code ====>>>", error.code);
      console.log("error.constraint ====>>>>>", error.constraint);
      console.log("error.message ====>>>", error.message);
      const message =
        error.code === "23505" ? "This WebLink /DOI No. already used with another form " : error.message;
      console.log("message =====>>>>>>", message);
      return {
        status: "Failed",
        message: message,
        errorCode: error.code,
      };
    });
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
