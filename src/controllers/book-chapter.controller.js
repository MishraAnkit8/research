
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
    const filename =  req.file.filename;
    console.log('data in controller ==>>', req.body);
    const insertBookChapterData = await bookChapterServices.insertBookChapter(bookChapter, filename);
    if(insertBookChapterData){
        res.status(200).send({
            status : 'done',
            bookChapter : bookChapter,
            bookChapterId  : insertBookChapterData,
            filename : filename
        })
    }

}
module.exports.updateBookChapterData = async(req, res, next) => {
    console.log('data comming from frontend ==>>', req.body);
    const bookChapterId  = req.body.bookChapterId;
    console.log('id ==', bookChapterId)
    const updatedBookChapterPublication = req.body;
    if(req.file){
        const updatedFile = req.file.filename;
        const updatedBookChapterData = await bookChapterServices.updatedBookChapter(bookChapterId, updatedBookChapterPublication, updatedFile);
        if(updatedBookChapterData.status === 'done'){
            res.status(200).send({
                status : 'done',
                updatedBookChapter : updatedBookChapterPublication,
                bookChapterId : bookChapterId 
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
