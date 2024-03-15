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
    const statusCode = insertBookPublicarionData.status === "Done" ? 200 : (insertBookPublicarionData.errorCode === "23505" ? 400 : 500);
    res.status(statusCode).send({
        status : insertBookPublicarionData.status,
        message : insertBookPublicarionData.message,
        rowCount : insertBookPublicarionData.rowCount,
        bookPublicationId : insertBookPublicarionData.bookPublicationId,
        bookPublicationData : insertBookPublicarionData.bookPublicationData,
        filename : insertBookPublicarionData.bookPublicationfileData,
        errorCode : insertBookPublicarionData.errorCode ? insertBookPublicarionData.errorCode : null,

    })
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
        status : updatedBookPublication.status,
        message : updatedBookPublication.message,
        updatedDocuments : updatedBookPublication.upadteDataFileString,
        updatedBookPublication : updatedBookPublication.updatedBookPublicationData,
        errorCode : updatedBookPublication.errorCode ? updatedBookPublication.errorCode : null
    })

}

module.exports.deleteBookPublication = async(req, res, next) => {
    const bookPublicationId = req.body.bookPublicationId;

    const deleteBookPublicationData = await bookPublicationService.deleteBookPublicationData({bookPublicationId});

    console.log('deleteBookPublicationData in controller ==>>>', deleteBookPublicationData);
    const statuscode = deleteBookPublicationData.status === "Done" ? 200 : (deleteBookPublicationData.errorCode ? 400 : 500);
    res.status(statuscode).send({
        status : deleteBookPublicationData.status,
        statuscode : statuscode,
        message : deleteBookPublicationData.message,
        errorCode : deleteBookPublicationData.errorCode ? deleteBookPublicationData.errorCode : null
    })
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