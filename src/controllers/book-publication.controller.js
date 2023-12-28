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

}