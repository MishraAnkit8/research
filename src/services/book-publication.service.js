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

module.exports.updateBookPublication = async(BookpublicationId, updatedBookPublicationData, updatedFile) => {
    const updatedBookPublication = await bookPublicationModel.updatedBookPublication(BookpublicationId, updatedBookPublicationData, updatedFile);
    if(updatedBookPublication && updatedBookPublication.rowCount === 1) {
        return {
            status : 'done',
            massage : 'date updated successfully'
        }
    }
    
}