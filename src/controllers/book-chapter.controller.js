
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
    const bookChapterId = insertBookChapterData.bookChapterId;
    const filename = insertBookChapterData.bookChapterDataFiles;
    if(insertBookChapterData){
        res.status(200).send({
            status : 'done',
            bookChapter : bookChapter,
            bookChapterId,
            filename
        })
    }

}
module.exports.updateBookChapterData = async(req, res, next) => {
    console.log('data comming from frontend ==>>', req.body);
    const bookChapterId  = req.body.bookChapterId;
    console.log('id ==', bookChapterId)
    const updatedBookChapterPublication = req.body;
    if(req.files){
        console.log('files ===>>>', req.files);
        const updatedBookChapterData = await bookChapterServices.updatedBookChapter(bookChapterId, updatedBookChapterPublication, req.files);
        const updatedFile = updatedBookChapterData.updateBookChapterDataFiles;
        console.log('updatedFile ===>>>>', updatedFile)
        if(updatedBookChapterData.status === 'done'){
            res.status(200).send({
                status : 'done',
                updatedBookChapter : updatedBookChapterPublication,
                bookChapterId : bookChapterId,
                updatedFile 
            })
        }
    }
    else{
        const updatedBookChapterData = await bookChapterServices.updatedBookChapter(bookChapterId, updatedBookChapterPublication);
        if(updatedBookChapterData.status === 'done'){
            res.status(200).send({
                status : 'done',
                updatedBookChapter : updatedBookChapterPublication,
                bookChapterId : bookChapterId 
            })
        }
    }
   

}

module.exports.deleteBookChapterData = async(req, res, next) => {
    const bookChapterId = req.body.bookChapterId;
    const deletebookChapter = await bookChapterServices.deleteBookChapterPublication({bookChapterId});
    if(deletebookChapter.status === 'done'){
        res.status(200).send({
            status : 'done',
            massage : 'deleted successfully'
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
