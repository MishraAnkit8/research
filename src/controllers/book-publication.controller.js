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
    console.log('insertBookPublicarionData ====>>>>', insertBookPublicarionData);
    const status = insertBookPublicarionData.status === "Done" ? 200 : (insertBookPublicarionData.errorCode === "23505" ? 502 : 500);
    res.status(status).send({
        status : insertBookPublicarionData.status === "Done" ? "Done" : "Failed",
        message : insertBookPublicarionData.status === "Done" ? insertBookPublicarionData.message : insertBookPublicarionData.message,
        bookPublicationData : insertBookPublicarionData.status === "Done" ? bookPublicationData : bookPublicationData,
        bookPublicationId  : insertBookPublicarionData.status === "Done" ? insertBookPublicarionData.bookPublicationId : insertBookPublicarionData.bookPublicationId,
        filename : insertBookPublicarionData.status === "Done" ? insertBookPublicarionData.bookPublicationfileData : insertBookPublicarionData.bookPublicationfileData

    });
}

module.exports.updateBookPublication = async(req, res, next) => {
    console.log('data comming from frontend ==>>', req.body);
    const updatedBookPublicationData = req.body;
    const bookPublicationId  = req.body.bookPublicationId ;
    console.log('id ==', bookPublicationId );
    const updatedBookPublication = await bookPublicationService.updateBookPublication( bookPublicationId, updatedBookPublicationData, req.files);
    console.log('updatedBookPublication =====>>>>>', updatedBookPublication);
    
    const statuscode = updatedBookPublication.status === "Done" ? 200 : (updatedBookPublication.errorCode === '23505' ? 502 : 500);
    console.log('statuscode ====>>>>', statuscode);
    res.status(statuscode).send({
        statuscode : statuscode,
        status : updatedBookPublication.status === "Done" ? "Done" : "Failed",
        message : updatedBookPublication.status === "Done" ? updatedBookPublication.message : updatedBookPublication.message,
        updatedDocuments : updatedBookPublication.status === "Done" ? updatedBookPublication.upadteDataFileString : updatedBookPublication.upadteDataFileString,
        updatedBookPublication : updatedBookPublication.status === "Done" ? updatedBookPublicationData : updatedBookPublicationData,
        bookPublicationId : bookPublicationId
    })

}

module.exports.deleteBookPublication = async(req, res, next) => {
    const bookPublicationId = req.body.bookPublicationId;
    const deleteBookPublicationData = await bookPublicationService.deleteBookPublicationData({bookPublicationId});
    if(deleteBookPublicationData.status === 'done'){
        res.status(200).send({
            status : 'Done',
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