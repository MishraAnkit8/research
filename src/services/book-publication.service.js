const bookPublicationModel = require('../models/book-publication.models');

module.exports.fetchBookPublicationData = async() => {
    const bookPublicationdata = await bookPublicationModel.fetchBookPublication();
    console.log(bookPublicationdata.rows[0]);
    return bookPublicationdata.rows
}

module.exports.insertBookPublication = async(bookPublicationData , filename) => {
    const insertBookPublication = await bookPublicationModel.insertBookPublicationData(bookPublicationData , filename);
}