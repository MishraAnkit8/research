const bookPublicationService = require('../services/book-publication.service');


module.exports.renderBookPublication = async(req, res, next) => {
    const fetchBookPublicationData = await bookPublicationService.fetchBookPublicationData();
    console.log('bookPublicationList  in controller ==>>', fetchBookPublicationData);
    if(fetchBookPublicationData){
        res.render('book-publication' , {
            bookPublicationList : fetchBookPublicationData.rows,
            rowCount : fetchBookPublicationData.rowCount
        })
    }
}

module.exports.insertBookPublication = async(req, res, next) => {
    const bookPublicationData  = req.body;
    console.log('data in controller ==>>', req.body);
    console.log('files in controller ==>>>', req.files);
    const insertBookPublicarionData = await bookPublicationService.insertBookPublication(req.body, req.files);
    console.log('insertBookPublicarionData ID in Controller ===>>>', insertBookPublicarionData.bookPublicationId)
    if(insertBookPublicarionData){
        res.status(200).send({
            status : 'done',
            bookPublicationData : bookPublicationData,
            bookPublicationId  : insertBookPublicarionData.bookPublicationId,
            filename : insertBookPublicarionData.bookPublicationfileData
        })
    }
}

module.exports.updateBookPublication = async(req, res, next) => {
    console.log('data comming from frontend ==>>', req.body);
    const bookPublicationId  = req.body.bookPublicationId ;
    console.log('id ==', bookPublicationId )
    const updatedBookPublicationData = req.body;
    if(req.files) {
        console.log('files in controller ===>>>>', req.files)
        // const updatedFiles = req.body.researchSupportingDocument;
        // console.log('updatedFiles ===>>>>', updatedFiles)
        const updatedBookPublication = await bookPublicationService.updateBookPublication( bookPublicationId, updatedBookPublicationData, req.files);
        console.log('updatedBookPublication ==>>>', updatedBookPublication);
        const updatedFile = updatedBookPublication.upadteDataFileString;
        if(updatedBookPublication.status === 'done'){
            res.status(200).send({
                status : 'done',
                updatedBookPublication : updatedBookPublicationData,
                bookPublicationId : bookPublicationId,
                updatedFile : updatedFile 
            })
        }
    }
    else {
        const updatedBookPublication = await bookPublicationService.updateBookPublication( bookPublicationId, updatedBookPublicationData);
        console.log('updatedBookPublication ==>>', updatedBookPublication);
        if(updatedBookPublication.status === 'done'){
            res.status(200).send({
                status : 'done',
                updatedBookPublication : updatedBookPublicationData,
                bookPublicationId : bookPublicationId 
            })
        }

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