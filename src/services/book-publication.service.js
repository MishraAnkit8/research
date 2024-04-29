const bookPublicationModel = require('../models/book-publication.models');


module.exports.fetchBookPublicationData = async(userName) => {
    const bookPublicationdata = await bookPublicationModel.fetchBookPublication(userName);
    console.log(bookPublicationdata.rows[0]);
    return bookPublicationdata
}

module.exports.insertBookPublication = async(body, files, userName) => {
  console.log('files ====>>>', files);
  const bookPublicationfileData = files?.map(file => file.filename).join(',');
  const bookPublicationData = body;
  console.log('Data in Service ===>>>', bookPublicationData);
  console.log('bookPublicationfileData In service ===>>>', bookPublicationfileData);

  const insertBookPublication = await bookPublicationModel.insertBookPublicationData(bookPublicationData , bookPublicationfileData, userName);

  console.log('insertBookPublication in service ===>>>>', insertBookPublication);
  return insertBookPublication.status === "Done" ? {
    status : insertBookPublication.status,
    message : insertBookPublication.message,
    rowCount : insertBookPublication.rowCount,
    bookPublicationId : insertBookPublication.id,
    bookPublicationData : bookPublicationData,
    bookPublicationfileData : bookPublicationfileData
  } : {
    status : insertBookPublication.status,
    message : insertBookPublication.message,
    errorCode : insertBookPublication.errorCode
  }
}

module.exports.updateBookPublication = async(bookPublicationId, updatedBookPublicationData, files, userName) => {
    const upadteDataFileString = files?.map(file => file.filename).join(',');
    console.log('updatedBookPublicationData ===>>>>', updatedBookPublicationData);
    console.log('upadteDataFileString ====>>>>>', upadteDataFileString);

    const updatedBookPublication = await bookPublicationModel.updatedBookPublication(bookPublicationId , updatedBookPublicationData, upadteDataFileString, userName);

    console.log('updatedBookPublication in service ===>>>>', updatedBookPublication);
    return updatedBookPublication.status === "Done" ? {
        status : updatedBookPublication.status,
        message : updatedBookPublication.message,
        rowCount : updatedBookPublication.rowCount,
        updatedBookPublicationData : updatedBookPublicationData,
        upadteDataFileString : upadteDataFileString
      } : {
        status : updatedBookPublication.status,
        message : updatedBookPublication.message,
        errorCode : updatedBookPublication.errorCode
      }
}

module.exports.deleteBookPublicationData = async({bookPublicationId}) => {
    console.log('bookPublicationId ===>>>>', bookPublicationId);

    const deleteBookPublication = await bookPublicationModel.deleteBookPublicationData(bookPublicationId);

    console.log('deleteBookPublication ===>>>', deleteBookPublication);
    return deleteBookPublication.status === "Done" ? {
      status : deleteBookPublication.status,
      message : deleteBookPublication.message,
      rowCount : deleteBookPublication.rowCount
    } : {
      status : deleteBookPublication.status,
      message : deleteBookPublication.message,
      errorCode : deleteBookPublication.errorCode
    }
}

module.exports.viewBookPublication = async(bookPublicationId) => {
    const bookPublicationDataViw = await bookPublicationModel.viewBookPublicationData(bookPublicationId);
    console.log('bookPublicationDataViw ==>>', bookPublicationDataViw.rows);
    if(bookPublicationDataViw.rowCount > 0){
      return bookPublicationDataViw.rows;
    }
}