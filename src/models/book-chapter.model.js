const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchEditedBookPublication = async() => {
    let sql = {
        text : `SELECT * FROM book_chapter_publications ORDER BY id`
    }
    console.log('sql ==>', sql)
    return researchDbR.query(sql)
}

module.exports.insertBookChapterData = async(bookChapter, bookChapterDataFiles) => {
    const {authorName, bookTitle, edition, editorName, bookEditor, chapterTitle, volumeNumber, publisherCategory, pageNumber, publisherName, publicationYear,
        bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors} = bookChapter;
        const doiBookIdParsed = doiBookId === "" ? null : parseInt(doiBookId, 10);
    let sql = {
        text : `INSERT INTO book_chapter_publications (author_name, book_title, edition, editor_name, book_editor, chapter_title, volume_number, publisher_category, page_number, publisher_name, 
            publication_year, book_url, doi_id, isbn, number_of_nmims_authors, nmims_authors, nmims_campus_authors, nmims_school_authors, supporting_documents)
            VALUES ($1, $2 , $3 ,$4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING id `,
        values : [authorName, bookTitle, edition, editorName, bookEditor, chapterTitle, volumeNumber, publisherCategory, pageNumber, publisherName, publicationYear,
            bookUrl, doiBookIdParsed, isbnNo, numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, bookChapterDataFiles]
    }
    console.log('sql ==>>', sql);
    //handling the condng by tre and catch
    try {
        const result = await researchDbW.query(sql);
        console.log('Inserted row with id:', result.rows[0].id);
        const message = 'Record Inserted with id:'
        return { status: 'Done', id: result.rows[0].id, message};
    } catch (error) {
        // console.log('error.code ====>>>', error.code)
        // console.log('error.constraint ====>>>>>', error.constraint);
        // console.log('error.message ====>>>', error.message);
        // console.error('Error on update:', error.code, error.message);
        // console.log('error.message ====>>>>>', error.message);
        const message = error.code === '23505' ? "DOI ID Of Book Chapter Should Be Unique" : error.message;
        return { status: 'Failed', message };  
        // if (error.code === '23505' && error.constraint === 'journal_papers_web_link_doi_number_key') {
        //     const message = 
        //     console.error('Insertion failed. web_link_doi_number already exists.');
        //     return { status: 'Failed', error: 'web_link_doi_number already exists' };
        // } else {
        //     console.error('Error occurred::::::::::', error.message);
        //     return { status: 'Failed', error: error.message };
        // }
    }
}

module.exports.updatedBookChapter = async (bookChapterId, updatedBookChapterPublication, updateBookChapterDataFiles) => {
    const {
        authorName, bookTitle, edition, editorName, bookEditor, chapterTitle, volumeNumber, publisherCategory,
        pageNumber, publisherName, publicationYear, bookUrl, doiBookId, isbnNo, numberOfNmimsAuthors, nmimsAuthors,
        nmimsCampusAuthors, nmimsSchoolAuthors
    } = updatedBookChapterPublication;

    const doiBookIdParsed = doiBookId === "" ? null : parseInt(doiBookId, 10);
    const supportingDocuments = updateBookChapterDataFiles || null;

    const sql = {
        text: `UPDATE book_chapter_publications SET author_name = $2, book_title = $3, edition = $4, editor_name = $5, book_editor = $6, chapter_title = $7, volume_number = $8, publisher_category = $9, page_number = $10, publisher_name = $11,
               publication_year = $12, book_url = $13, doi_id = $14, isbn = $15, number_of_nmims_authors = $16, nmims_authors = $17, nmims_campus_authors = $18, nmims_school_authors = $19, supporting_documents = $20 WHERE id = $1`,
        values: [
            bookChapterId, authorName, bookTitle, edition, editorName, bookEditor, chapterTitle, volumeNumber,
            publisherCategory, pageNumber, publisherName, publicationYear, bookUrl, doiBookIdParsed, isbnNo,
            numberOfNmimsAuthors, nmimsAuthors, nmimsCampusAuthors, nmimsSchoolAuthors, supportingDocuments
        ]
    };

    try {
        const result = await researchDbW.query(sql);
        const status = result.rowCount > 0 ? 'Done' : 'Failed';
        console.log('status ====>>>>>', status);
        const message = ' Record Updated successful'
        console.log('sql ====>>>', sql);
        console.log('Updated successful:', result.rowCount, 'Row(s) Updated.');
        return { status , message};
    } catch (error) {
        console.error('Error on update:', error.code, error.message);
        console.log('error.message ====>>>>>', error.message);
        const message = error.code === '23505' ? "DOI ID Of Book Chapter Should Be Unique" : error.message;
        return { status: 'Failed', message };        
        
    }
};


module.exports.deleteBookChapter = async(bookChapterId) => {
    let sql = {
        text : `DELETE FROM book_chapter_publications WHERE id = $1`,
        values : [bookChapterId]
    }
    return researchDbW.query(sql);
}

module.exports.viewBookChapterData = async(bookChapterId) => {
    let sql = {
        text : `SELECT * FROM book_chapter_publications WHERE id = $1`,
        values : [bookChapterId]
    }
    return researchDbW.query(sql);
}

