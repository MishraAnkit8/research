const bookChapterModels = require('../models/book-chapter.model');

module.exports.fetchBookChapter= async() => {
    const BookChapterData = await bookChapterModels.fetchEditedBookPublication();
    console.log(BookChapterData.rows[0]);
    return BookChapterData.rows
}

module.exports.insertBookChapter = async(bookChapter , filename) => {
    const bookChapterInsertedData = await bookChapterModels.insertBookChapterData(bookChapter, filename);
    if(bookChapterInsertedData){
        return bookChapterInsertedData.rows[0].id;
    }
}

module.exports.updatedBookChapter = async(bookChapterId, updatedBookChapterPublication, updatedFile) => {
    const updatedBookChapterData = await bookChapterModels.updatedBookChapter(bookChapterId , updatedBookChapterPublication, updatedFile);
    if(updatedBookChapterData && updatedBookChapterData.rowCount === 1) {
        return {
            status : 'done',
            massage : 'date updated successfully'
        }
    }
    
}

module.exports.deleteBookChapterPublication = async({bookChapterId}) => {
    const bookChapterPublication = await bookChapterModels.deleteBookChapter(bookChapterId);
    if(bookChapterPublication.rowCount === 1){
        return {
            status : 'done',
            massage : 'deleted successfully'
        }
    }
}

module.exports.viewBookChapterData = async(bookChapterId) => {
    console.log('id IN service ==>>', bookChapterId);
    const viewBookChapterPublication = await bookChapterModels.viewBookChapterData(bookChapterId);
    console.log('viewBookChapterPublication ==>>', viewBookChapterPublication.rows[0]);
    if(viewBookChapterPublication.rows[0] && viewBookChapterPublication.rowCount === 1){
        return viewBookChapterPublication.rows[0]
    }
}