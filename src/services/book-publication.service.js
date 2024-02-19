const bookPublicationModel = require('../models/book-publication.models');


module.exports.fetchBookPublicationData = async() => {
    const bookPublicationdata = await bookPublicationModel.fetchBookPublication();
    console.log(bookPublicationdata.rows[0]);
    return bookPublicationdata
}

module.exports.insertBookPublication = async(body, files) => {
  console.log('files ====>>>', files);
  const bookPublicationData = body;
  console.log('Data in Service ===>>>', bookPublicationData);
  var bookPublicationfileData = '';
  for(let i = 0; i <= files.length - 1; i++){
    if(files && files[i].filename){
      console.log('file name ==>>', files[i].filename)
      bookPublicationfileData += files[i].filename + ',';
    }
  }
  console.log('bookPublicationfileData In service ===>>>', bookPublicationfileData)
    const insertBookPublication = await bookPublicationModel.insertBookPublicationData(bookPublicationData , bookPublicationfileData);
    console.log('insertBookPublication Id ==>>', insertBookPublication.rows[0].id)
    const bookPublicationId = insertBookPublication.rows[0].id;
    if(insertBookPublication){
        return{ 
        insertBookPublication,
        bookPublicationfileData,
        bookPublicationId
        }
    }
}

module.exports.updateBookPublication = async(bookPublicationId, updatedBookPublicationData, files) => {
    if(files){
      console.log('updated Files ===>>> in service ===>>>', files);
      var upadteDataFileString = '';
      for(let i = 0; i <= files.length - 1 ; i++){
        upadteDataFileString += files[i].filename + ',';
      }
      console.log('Stringify Data upadteDataFileString ==>>', upadteDataFileString)
        const updatedBookPublication = await bookPublicationModel.updatedBookPublication(bookPublicationId , updatedBookPublicationData, upadteDataFileString);
        if(updatedBookPublication && updatedBookPublication.rowCount === 1) {
            return {
                status : 'done',
                massage : 'date updated successfully',
                upadteDataFileString
            }
        }
        
    }

    else{
        const updatedBookPublication = await bookPublicationModel.updatedBookPublication(bookPublicationId, updatedBookPublicationData);
        if(updatedBookPublication && updatedBookPublication.rowCount === 1) {
            return {
                status : 'done',
                massage : 'date updated successfully'
            }
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
    const bookPublicationDataViw = await bookPublicationModel.viewBookPublicationData(bookPublicationId);
    console.log('bookPublicationDataViw ==>>', bookPublicationDataViw.rows[0]);
    if(bookPublicationDataViw.rows[0] && bookPublicationDataViw.rowCount === 1){
        return bookPublicationDataViw.rows[0]
    }
}