const editedBookPublication = require('../services/edited-book.service');

module.exports.renderEdietedBookPublication = async(req, res, next) => {
    const editedBookPublicationData = await editedBookPublication.fetchEditedBookPublicationData();
    console.log('editeBookList  in controller ==>>', editedBookPublicationData);
    if(editedBookPublicationData){
        res.render('edited-book-publication' , {
            editedBookList : editedBookPublicationData.rows,
            rowCount : editedBookPublicationData.rowCount
        })
    }
}

module.exports.insertEditedBookPublication = async(req, res, next) => {
    const editedBook  = req.body;
    console.log('editedBookPublication ==>>', editedBook);
    const filename =  req.file.filename;
    console.log('data in controller ==>>', req.body);
    const insertEditedBookPublication = await editedBookPublication.insertEditedBookPublication(editedBook, filename);
    if(insertEditedBookPublication){
        res.status(200).send({
            status : 'done',
            editedBooKData : editedBook,
            editedBookId  : insertEditedBookPublication,
            filename : filename
        })
    }

}
module.exports.updateEditedBookPublication = async(req, res, next) => {
    console.log('data comming from frontend ==>>', req.body);
    const editedBookId  = req.body.editedBookId;
    console.log('id ==', editedBookId)
    const updatedEditedBookPublication = req.body;
    if(req.file){
        const updatedFile = req.file.filename;
        const updatedEditedBookData = await editedBookPublication.updateEditedBook(editedBookId, updatedEditedBookPublication, updatedFile);
        if(updatedEditedBookData.status === 'done'){
            res.status(200).send({
                status : 'done',
                updatedEditedBook : updatedEditedBookPublication,
                editedBookId : editedBookId 
            })
        }
    }
    else{
        const updatedEditedBookData = await editedBookPublication.updateEditedBook(editedBookId, updatedEditedBookPublication);
        if(updatedEditedBookData.status === 'done'){
            res.status(200).send({
                status : 'done',
                updatedEditedBook : updatedEditedBookPublication,
                editedBookId : editedBookId 
            })
        }
    }
 

}

module.exports.deleteEditedBookPublication = async(req, res, next) => {
    const editedBookId = req.body.editedBookId;
    const deleteEditedBookPublicationData = await editedBookPublication.deleteEditedBookPublication({editedBookId});
    if(deleteEditedBookPublicationData.status === 'done'){
        res.status(200).send({
            status : 'done',
            massage : 'deleted successfully'
        })
    }
}

module.exports.viewEditedBookPublication = async(req, res, next) => {
    const {editedBookId} = req.body;
    const editedBookView = await editedBookPublication.editedBookPublicationView(editedBookId);
    console.log('data in controller ==>>', editedBookView)
    if(editedBookView){
        res.status(200).send({
            status : 'done',
            editedBookView : editedBookView
        })
    }
}