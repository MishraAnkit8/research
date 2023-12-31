const editedBookPublicationModel = require('../models/book-chapter.model');

module.exports.fetchEditedBookPublicationData = async() => {
    const editedBookPublicationdata = await editedBookPublicationModel.fetchEditedBookPublication();
    console.log(editedBookPublicationdata.rows[0]);
    return editedBookPublicationdata.rows
}

module.exports.insertEditedBookPublication = async(editedBook , filename) => {
    const insertEditedBookData = await editedBookPublicationModel.insertEditedBook(editedBook, filename);
    if(insertEditedBookData){
        return insertEditedBookData.rows[0].id;
    }
}

module.exports.updateEditedBook = async(editedBookId , updatedEditedBookPublication, updatedFile) => {
    const updatedEditedBookData = await editedBookPublicationModel.updatedEditedBookPublication(editedBookId , updatedEditedBookPublication, updatedFile);
    if(updatedEditedBookData && updatedEditedBookData.rowCount === 1) {
        return {
            status : 'done',
            massage : 'date updated successfully'
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