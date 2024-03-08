const bookPublicationModel = require('../models/book-publication.models');


module.exports.fetchBookPublicationData = async() => {
    const bookPublicationdata = await bookPublicationModel.fetchBookPublication();
    console.log(bookPublicationdata.rows[0]);
    return bookPublicationdata
}

module.exports.insertBookPublication = async(body, files) => {
  console.log('files ====>>>', files);
  const bookPublicationfileData = files?.map(file => file.filename).join(',');
  console.log('bookPublicationfileData ====>>>>', bookPublicationfileData);
  const bookPublicationData = body;
  console.log('Data in Service ===>>>', bookPublicationData);
  console.log('bookPublicationfileData In service ===>>>', bookPublicationfileData)
  const insertBookPublication = await bookPublicationModel.insertBookPublicationData(bookPublicationData , bookPublicationfileData);
  console.log('insertBookPublication in service ===>>>>', insertBookPublication);
//   const bookPublicationId = insertBookPublication.status === 'Done' ? insertBookPublication.id : null;
//   const errorCode = insertBookPublication.status === 'Failed' ? insertBookPublication.errorCode : null;
//   console.log('bookPublicationId ====>>>', bookPublicationId)
  return {
     status : insertBookPublication.status === 'Done' ? 'Done' : 'Failed',
     message : insertBookPublication.status === 'Done' ? insertBookPublication.message : insertBookPublication.message,
     bookPublicationId : insertBookPublication.status === 'Done' ? insertBookPublication.id : null,
     errorCode : insertBookPublication.status === 'Failed' ? insertBookPublication.errorCode : null,
     bookPublicationfileData : bookPublicationfileData
  }


}

module.exports.updateBookPublication = async(bookPublicationId, updatedBookPublicationData, files) => {
    const upadteDataFileString = files?.map(file => file.filename).join(',');
    console.log('upadteDataFileString ====>>>>>', upadteDataFileString)
    const updatedBookPublication = await bookPublicationModel.updatedBookPublication(bookPublicationId , updatedBookPublicationData, upadteDataFileString);
    console.log('updatedBookPublication in service ===>>>>', updatedBookPublication);
    return{
        status : updatedBookPublication.status === "Done" ? "Done" : 'Failed',
        message : updatedBookPublication.status === "Done" ? updatedBookPublication.message : updatedBookPublication.message,
        errorCode : updatedBookPublication.status === "Failed" ? updatedBookPublication.errorCode : null,
        upadteDataFileString : upadteDataFileString
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
    const bookPublicationDataViw = await bookPublicationModel.viewBookPublicationData(bookPublicationId);
    console.log('bookPublicationDataViw ==>>', bookPublicationDataViw.rows[0]);
    if(bookPublicationDataViw.rows[0] && bookPublicationDataViw.rowCount === 1){
        return bookPublicationDataViw.rows[0]
    }
}