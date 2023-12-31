const bookPublicationModel = require('../models/book-publication.models');

module.exports.fetchBookPublicationData = async() => {
    const bookPublicationdata = await bookPublicationModel.fetchBookPublication();
    console.log(bookPublicationdata.rows[0]);
    return bookPublicationdata.rows
}

module.exports.insertBookPublication = async(bookPublicationData , filename) => {
    const insertBookPublication = await bookPublicationModel.insertBookPublicationData(bookPublicationData , filename);
    if(insertBookPublication){
        return insertBookPublication.rows[0].id;
    }
}

module.exports.updateBookPublication = async(bookPublicationId , updatedBookPublicationData, updatedFile) => {
    const updatedBookPublication = await bookPublicationModel.updatedBookPublication(bookPublicationId , updatedBookPublicationData, updatedFile);
    if(updatedBookPublication && updatedBookPublication.rowCount === 1) {
        return {
            status : 'done',
            massage : 'date updated successfully'
        }
    }
    
}

module.exports.deleteBookPublicationData = async({bookPublicationId}) => {
    const deleteBookPublication = await bookPublicationModel.deleteBookPublicationData(bookPublicationId);
    if(deleteBookPublication.rowCount === 1){
        return {
            status : 'done',
            massage : 'deleted successfully'
        }
    }
}

module.exports.viewBookPublication = async(bookPublicationId) => {
    console.log('id IN service ==>>', bookPublicationId);
    const bookPublicationDataViw = await bookPublicationModel.viewBookPublicationData(bookPublicationId);
    console.log('bookPublicationDataViw ==>>', bookPublicationDataViw.rows[0]);
    if(bookPublicationDataViw.rows[0] && bookPublicationDataViw.rowCount === 1){
        return bookPublicationDataViw.rows[0]
    }
}