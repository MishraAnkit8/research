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
    console.log('data in controller ==>>', req.body);
    const insertBookPublicarionData = await bookPublicationService.insertBookPublication(bookPublicationData, filename);
    if(insertBookPublicarionData){
        res.status(200).send({
            status : 'done',
            bookPublicationData : bookPublicationData,
            bookPublicationId  : insertBookPublicarionData,
            filename : filename
        })
    }

}
module.exports.updateBookPublication = async(req, res, next) => {
    console.log('data comming from frontend ==>>', req.body);
    const bookPublicationId  = req.body.bookPublicationId ;
    console.log('id ==', bookPublicationId )
    const updatedBookPublicationData = req.body;
    const updatedFile = req.file.filename;
    const updatedBookPublication = await bookPublicationService.updateBookPublication( bookPublicationId , updatedBookPublicationData, updatedFile);
    if(updatedBookPublication.status === 'done'){
        res.status(200).send({
            status : 'done',
            updatedBookPublication : updatedBookPublicationData,
            bookPublicationId : bookPublicationId 
        })
    }

}

module.exports.deleteBookPublication = async(req, res, next) => {
    const bookPublicationId = req.body.bookPublicationId;
    const deleteBookPublicationData = await bookPublicationService.deleteBookPublicationData({bookPublicationId});
    if(deleteBookPublicationData.status === 'done'){
        res.status(200).send({
            status : 'done',
            massage : 'deleted successfully'
        })
    }
}

module.exports.viewBookPublication = async(req, res, next) => {
    const {bookPublicationId} = req.body;
    const bookPublicationView = await bookPublicationService.viewBookPublication(bookPublicationId);
    console.log('data in controller ==>>', bookPublicationView)
    if(bookPublicationView){
        res.status(200).send({
            status : 'done',
            bookPublicationView : bookPublicationView
        })
    }
}