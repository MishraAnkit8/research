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
    // const filename =  req.file.filename;
    console.log('data in controller ==>>', req.body);
    const insertEditedBookPublication = await editedBookPublication.insertEditedBookPublication(editedBook, req.files);
    const filename = insertEditedBookPublication.editedBookFilesData;
    const editedBookId = insertEditedBookPublication.editedBookId;
    console.log('returning id in controller ===>>>', editedBookId)
    if(insertEditedBookPublication){
        res.status(200).send({
            status : 'done',
            editedBooKData : editedBook,
            editedBookId,
            filename
        })
    }

}
module.exports.updateEditedBookPublication = async(req, res, next) => {
    console.log('data comming from frontend ==>>', req.body);
    const editedBookId  = req.body.editedBookId;
    console.log('id ==', editedBookId)
    const updatedEditedBookPublication = req.body;
    if(req.files){
        // const updatedFile = req.file.filename;
        console.log('files in controller ===>>>', req.files)
        const updatedEditedBookData = await editedBookPublication.updateEditedBook(editedBookId, updatedEditedBookPublication, req.files);
        const updatedEditedBookFiles = updatedEditedBookData.updatedEditedBookFiles;
        console.log('updated files data in controller ===>>>', updatedEditedBookFiles)
        if(updatedEditedBookData.status === 'done'){
            res.status(200).send({
                status : 'done',
                updatedEditedBook : updatedEditedBookPublication,
                editedBookId : editedBookId,
                updatedEditedBookFiles 
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