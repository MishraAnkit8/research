const editedBookPublicationModel = require('../models/edited-book.model');


module.exports.fetchEditedBookPublicationData = async() => {
    const editedBookPublicationdata = await editedBookPublicationModel.fetchEditedBookPublication();
    console.log(editedBookPublicationdata.rows[0]);
    return editedBookPublicationdata
}

module.exports.insertEditedBookPublication = async(editedBook , files) => {
    console.log('files ===>>>', files);
    var editedBookFilesData = '';
    if(files){
      for(let i = 0; i <= files.length - 1; i++){
        if(files && files[i].filename){
          editedBookFilesData += files[i].filename + ',';
        }
      }
    }
    console.log('editedBookFilesData in service ===>>>>', editedBookFilesData);
    const insertEitedBookData = await editedBookPublicationModel.insertEditedBook(editedBook, editedBookFilesData);
    const editedBookId = insertEitedBookData.rows[0].id;
    if(insertEitedBookData){
        return {
          editedBookId,
          editedBookFilesData
        }
    }
}

module.exports.updateEditedBook = async(editedBookId , updatedEditedBookPublication, files) => {
    console.log('data in service ==>>', updatedEditedBookPublication)
    if(files){
        var  updatedEditedBookFiles = '';
        for (let i = 0; i <= files.length - 1; i++){
            if(files[i].filename){
              updatedEditedBookFiles += files[i].filename + ',';
            }
        }
        const updatedEditedBookData = await editedBookPublicationModel.updatedEditedBookPublication(editedBookId , updatedEditedBookPublication, updatedEditedBookFiles);
        if(updatedEditedBookData && updatedEditedBookData.rowCount === 1) {
            return {
                status : 'done',
                massage : 'date updated successfully',
                updatedEditedBookFiles
            }
        }
    }

    else{
        const updatedEditedBookData = await editedBookPublicationModel.updatedEditedBookPublication(editedBookId , updatedEditedBookPublication);
        if(updatedEditedBookData && updatedEditedBookData.rowCount === 1) {
            return {
                status : 'done',
                massage : 'date updated successfully'
            }
        }
    }

    
}

module.exports.deleteEditedBookPublication = async({editedBookId}) => {
    const deleteEditedBook = await editedBookPublicationModel.deleteEditedBookPublicationData(editedBookId);
    if(deleteEditedBook.rowCount === 1){
        return {
            status : 'done',
            massage : 'deleted successfully'
        }
    }
}

module.exports.editedBookPublicationView = async(editedBookId) => {
    console.log('id IN service ==>>', editedBookId);
    const editedbookPublicationDataView = await editedBookPublicationModel.viewEditedBookPublicationData(editedBookId);
    console.log('editedbookPublicationData ==>>', editedbookPublicationDataView.rows[0]);
    if(editedbookPublicationDataView.rows[0] && editedbookPublicationDataView.rowCount === 1){
        return editedbookPublicationDataView.rows[0]
    }
}