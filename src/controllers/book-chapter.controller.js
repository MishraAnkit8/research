
const bookChapterServices = require('../services/book-chapter.service');

module.exports.renderBookChapterPublication = async(req, res, next) => {
    const bookChapterData = await bookChapterServices.fetchBookChapter();
    console.log('bookChapterData in controller ==>>', bookChapterData);
    if(bookChapterData){
        res.render('book-chapter-publication' , {
                bookChapterData : bookChapterData.rows,
                rowCount : bookChapterData.rowCount
        })
    }
}

module.exports.insertBookChapterPublication = async(req, res, next) => {
    const bookChapter  = req.body;
    console.log('bookChapter ==>>', bookChapter);
    // const filename =  req.file.filename;
    console.log('files  in controller ==>>', req.files);
    const insertBookChapterData = await bookChapterServices.insertBookChapter(bookChapter, req.files);
    // const bookChapterId = insertBookChapterData.id;
    console.log('insertBookChapterData in controller ===>>>', insertBookChapterData);
    const filename = insertBookChapterData.bookChapterDataFiles;
    console.log('filename ===>>>', filename);
    const bookChapterId = insertBookChapterData.bookChapterId;
    const status = insertBookChapterData.status === 'Done' ? 200 : (insertBookChapterData.error === 'duplicate key value violates unique constraint "book_chapter_publications_doi_id_key"' ? 502 : 500);
    console.log('status ====>>>>>', status)
    const message = insertBookChapterData.status === 'Done' ? insertBookChapterData.message : insertBookChapterData.message;
    console.log('message ====>>>>>', message)
    return res.status(status).send({
      status: insertBookChapterData.status === "Done" ? "Done" : "Failed",
      message :  message,
      bookChapter: bookChapter,
      filename : filename,
      bookChapterId : bookChapterId
    });


    // if(insertBookChapterData.bookChapterInsertedData.status === 'Done'){
    //     const bookChapterId = insertBookChapterData.bookChapterInsertedData.bookChapterId;
    //     res.status(200).send({
    //         status : 'done',
    //         massage : 'Record Inserted Successfully',
    //         bookChapter : bookChapter,
    //         bookChapterId,
    //         filename

    //     })
    // }
    // else if(insertBookChapterData.status = 'Failed'){
    //     console.log('yes in this side')
    //     const uniqConstraintError = insertBookChapterData.bookChapterInsertedData.error;
    //     console.log('uniqConstraintError ====>>>>>', uniqConstraintError)
    //     if(insertBookChapterData.bookChapterInsertedData.error === 'duplicate key value violates unique constraint "book_chapter_publications_doi_id_key"'){
    //         console.log('this json data we go into frontend')
    //         res.status(502).send({
    //             status : 'Failed',
    //             massage : "DOI ID Of Book Chapter should Be Uniq"
    //         })
    //     }
    //     else{
    //         res.status(500).send({
    //             status : 'Failed',
    //             massage : insertBookChapterData.bookChapterInsertedData.error
    //         })
    //     }
    // }
}

// for updating book chapter
module.exports.updateBookChapterData = async(req, res, next) => {
    console.log('data comming from frontend ==>>', req.body);
    const bookChapterId  = req.body.bookChapterId;
    console.log('id ==', bookChapterId)
    const updatedBookChapterPublication = req.body;
    const updatedBookChapterData = await bookChapterServices.updatedBookChapter(bookChapterId, updatedBookChapterPublication, req.files);
    console.log('updatedBookChapterData in controller ====>>>>>', updatedBookChapterData);
    const updatedFile = updatedBookChapterData ? updatedBookChapterData.updateBookChapterDataFiles : null;
    console.log('updatedFile ===>>>>', updatedFile)
    const statuscode = updatedBookChapterData.status === 'Done' ? 200 : 502;
    console.log('statuscode ===>>>', statuscode)
    const status = updatedBookChapterData.status === 'Done' ? 'Done' : 'Failed'
    const message = updatedBookChapterData.status === 'Done'? updatedBookChapterData.message : updatedBookChapterData.message;
  
    return res
      .status(statuscode)
      .send({statuscode, status, message, updatedFile, updatedBookChapter : updatedBookChapterPublication});

}

module.exports.deleteBookChapterData = async(req, res, next) => {
    const bookChapterId = req.body.bookChapterId;
    const deletebookChapter = await bookChapterServices.deleteBookChapterPublication({bookChapterId});
    if(deletebookChapter.status === 'Done'){
        res.status(200).send({
            status : 'Done',
            massage : 'Deleted successfully'
        })
    }
}

module.exports.viewBookChapterData = async(req, res, next) => {
    const {bookChapterId} = req.body;
    const bookChapterView = await bookChapterServices.viewBookChapterData(bookChapterId);
    console.log('data in controller ==>>', bookChapterView)
    if(bookChapterView){
        res.status(200).send({
            status : 'done',
            bookChapterView : bookChapterView
        })
    }
}
