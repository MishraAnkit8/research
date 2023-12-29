const bookPublicationService = require('../services/book-publication.service');

module.exports.renderBookPublication = async(req, res, next) => {
    const fetchBookPublicationData = await bookPublicationService.fetchBookPublicationData();
    console.log('bookPublicationList  in controller ==>>', fetchBookPublicationData);
    if(fetchBookPublicationData){
        res.render('book-publication' , {
            bookPublicationList : fetchBookPublicationData
        })
    }
}

module.exports.insertBookPublication = async(req, res, next) => {
    const bookPublicationData  = req.body;
    const filename =  req.file.filename;
    const insertBookPublicarionData = await bookPublicationService.insertBookPublication(bookPublicationData, filename);
    if(insertBookPublicarionData){
        res.status(200).send({
            status : 'done',
            bookPublicationData : bookPublicationData,
            BookpublicationId : insertBookPublicarionData,
            filename : filename
        })
    }

}
module.exports.updateBookPublication = async(req, res, next) => {
    console.log('data comming from frontend ==>>', req.body);
    const BookpublicationId = req.body.BookpublicationId;
    console.log('id ==', BookpublicationId)
    const updatedBookPublicationData = req.body;
    const updatedFile = req.file.filename;
    const updatedBookPublication = await bookPublicationService.updateBookPublication(BookpublicationId, updatedBookPublicationData, updatedFile);
    if(updatedBookPublication.status === 'done'){
        res.status(200).send({
            status : 'done',
            updatedBookPublication : updatedBookPublicationData,
            BookpublicationId : BookpublicationId
        })
    }

}