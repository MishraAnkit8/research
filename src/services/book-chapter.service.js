const bookChapterModels = require('../models/book-chapter.model');


module.exports.fetchBookChapter= async() => {
    const BookChapterData = await bookChapterModels.fetchEditedBookPublication();
    console.log(BookChapterData.rows[0]);
    return BookChapterData
}

module.exports.insertBookChapter = async(bookChapter , files) => {
    const bookChapterDataFiles = files?.map(file => file.filename).join(',');
    console.log('updateBookChapterDataFiles ====>>>>', bookChapterDataFiles);
    // var bookChapterDataFiles = '';
    // if(files){
    //   for(let i = 0; i <= files.length - 1; i++){
    //       if(files && files[i].filename){
    //         bookChapterDataFiles += files[i].filename + ',';
    //       }
    //   }
    // }
    const bookChapterInsertedData = await bookChapterModels.insertBookChapterData(bookChapter, bookChapterDataFiles);
    console.log('bookChapterInsertedData ===>>>>', bookChapterInsertedData);
    const bookChapterId = bookChapterInsertedData.id;
    console.log('bookChapterId ====>>>', bookChapterId);
    return {
        status: bookChapterInsertedData.status === 'Done' ? 'Done' : 'Failed',
        message: bookChapterInsertedData.status === 'Done' ? `${bookChapterInsertedData.message}` : `${bookChapterInsertedData.message}`,
        bookChapterDataFiles,
        bookChapterId
    };
}

module.exports.updatedBookChapter = async (bookChapterId, updatedBookChapterPublication, files) => {
    const updateBookChapterDataFiles = files?.map(file => file.filename).join(',');
    console.log('updateBookChapterDataFiles ====>>>>', updateBookChapterDataFiles);
    
    const updatedBookChapterData = await bookChapterModels.updatedBookChapter(bookChapterId, updatedBookChapterPublication, updateBookChapterDataFiles
    );
    console.log('updatedBookChapterData in service ====>>>', updatedBookChapterData);
    return {
        status: updatedBookChapterData.status === 'Done' ? 'Done' : 'Failed',
        message: updatedBookChapterData.status === 'Done' ? `${updatedBookChapterData.message}` : `${updatedBookChapterData.message}`,
        updateBookChapterDataFiles
    };
  };
  

module.exports.deleteBookChapterPublication = async({bookChapterId}) => {
    const bookChapterPublication = await bookChapterModels.deleteBookChapter(bookChapterId);
    if(bookChapterPublication.rowCount === 1){
        return {
            status : 'Done',
            massage : 'Deleted successfully'
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