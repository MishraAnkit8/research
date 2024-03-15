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
    console.log('bookChapterId ====>>>', bookChapterInsertedData.id);
    return  bookChapterInsertedData.status === 'Done' ? {
        status: bookChapterInsertedData.status,
        message: bookChapterInsertedData.message,
        bookChapterDataFiles : bookChapterDataFiles,
        bookChapterId : bookChapterInsertedData.id,
        bookChapterData : bookChapter,
        rowCount : bookChapterInsertedData.rowCount
    } : {
        status : bookChapterInsertedData.status,
        message : bookChapterInsertedData.message,
        errorCode : bookChapterInsertedData.errorCode
    };
}

module.exports.updatedBookChapter = async (bookChapterId, updatedBookChapterPublication, files) => {
    const updateBookChapterDataFiles = files?.map(file => file.filename).join(',');
        
    const updatedBookChapterData = await bookChapterModels.updatedBookChapter(bookChapterId, updatedBookChapterPublication, updateBookChapterDataFiles
    );
    console.log('updatedBookChapterData in service ====>>>', updatedBookChapterData);
    return  updatedBookChapterData.status === 'Done' ? {
        status:  updatedBookChapterData.status,
        message: updatedBookChapterData.message,
        updateBookChapterDataFiles : updateBookChapterDataFiles,
        updatedBookChapterPublication : updatedBookChapterPublication
    } : {
            status : updatedBookChapterData.status,
            message : updatedBookChapterData.message,
            errorCode : updatedBookChapterData.errorCode
    };
  };
  

module.exports.deleteBookChapterPublication = async({bookChapterId}) => {
    console.log('bookChapterId ====>>>>', bookChapterId);
    const bookChapterPublication = await bookChapterModels.deleteBookChapter(bookChapterId);
    
    console.log('bookChapterPublication ===>>>', bookChapterPublication);
    return bookChapterPublication.status === "Done" ? {
        status : bookChapterPublication.status,
        message : bookChapterPublication.message,
        rowCount : bookChapterPublication.rowCount
    } : {
        status : bookChapterPublication.status,
        message : bookChapterPublication.message,
        errorCode : bookChapterPublication.errorCode 
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