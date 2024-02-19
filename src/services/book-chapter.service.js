const bookChapterModels = require('../models/book-chapter.model');


module.exports.fetchBookChapter= async() => {
    const BookChapterData = await bookChapterModels.fetchEditedBookPublication();
    console.log(BookChapterData.rows[0]);
    return BookChapterData
}

module.exports.insertBookChapter = async(bookChapter , files) => {
    var bookChapterDataFiles = '';
    if(files){
      for(let i = 0; i <= files.length - 1; i++){
          if(files && files[i].filename){
            bookChapterDataFiles += files[i].filename + ',';
          }
      }
    }
    const bookChapterInsertedData = await bookChapterModels.insertBookChapterData(bookChapter, bookChapterDataFiles);
    const bookChapterId = bookChapterInsertedData.rows[0].id;
    console.log('bookChapterId ===>>>', bookChapterId)
    if(bookChapterInsertedData){
        return{
          bookChapterId,
          bookChapterDataFiles
        } 
    }
}

module.exports.updatedBookChapter = async(bookChapterId, updatedBookChapterPublication, files) => {
    if(files){
        var updateBookChapterDataFiles = '';
        for(let i = 0; i<= files.length - 1 ; i++){
          if(files  && files[i].filename){
            updateBookChapterDataFiles += files[i].filename + ',';
          }
        }
        console.log('updateBookChapterDataFiles ===>>>>', updateBookChapterDataFiles)
        const updatedBookChapterData = await bookChapterModels.updatedBookChapter(bookChapterId , updatedBookChapterPublication, updateBookChapterDataFiles);
        if(updatedBookChapterData && updatedBookChapterData.rowCount === 1) {
            return {
                status : 'done',
                massage : 'date updated successfully',
                updateBookChapterDataFiles
            }
        }
    }
    else{
        const updatedBookChapterData = await bookChapterModels.updatedBookChapter(bookChapterId , updatedBookChapterPublication);
        if(updatedBookChapterData && updatedBookChapterData.rowCount === 1) {
            return {
                status : 'done',
                massage : 'date updated successfully'
            }
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