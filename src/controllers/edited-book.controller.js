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
    console.log('data in controller ==>>', req.body);
    const insertEditedBookPublication = await editedBookPublication.insertEditedBookPublication(editedBook, req.files);
    console.log('insertEditedBookPublication in controller =====>>>>>>>', insertEditedBookPublication);
    const statuscode = insertEditedBookPublication.status === "Done"? 200 : (insertEditedBookPublication.errorCode === insertEditedBookPublication.errorCode ? 502 : 500);
    console.log('statuscode ====>>>>', statuscode);
    insertEditedBookPublication === insertEditedBookPublication ? res.status(statuscode).send({
            status : insertEditedBookPublication.status === "Done" ? "Done" : "Failed",
            message : insertEditedBookPublication.status === "Done" ? insertEditedBookPublication.message : insertEditedBookPublication.message,
            editedBooKData : insertEditedBookPublication.status === "Done" ? editedBook : null,
            editedBookId : insertEditedBookPublication.status === "Done" ? insertEditedBookPublication.editedBookId : null,
            filename : insertEditedBookPublication.status === "Done" ? insertEditedBookPublication.editedBookFilesData : null,
            rowCount : insertEditedBookPublication.status === "Done" ? insertEditedBookPublication.rowCount : null
    }) : res.status(500).send({
        message : 'Internal Server Issue'

    })
}
module.exports.updateEditedBookPublication = async(req, res, next) => {
    console.log('data comming from frontend ==>>', req.body);
    const editedBookId  = req.body.editedBookId;
    console.log('id ==', editedBookId)
    const updatedEditedBookPublication = req.body;
    const updatedEditedBookData = await editedBookPublication.updateEditedBook(editedBookId, updatedEditedBookPublication, req.files);
    console.log('updatedEditedBookData in controller ===>>>>', updatedEditedBookData);
    const errorCode = updatedEditedBookData.errorCode;
    console.log('errorCode ====>>>>', errorCode)
    const statusCode = updatedEditedBookData.status === "Done" ? 200 : (updatedEditedBookData.errorCode === updatedEditedBookData.errorCode ? 502 : 500);
    const errTitleMsg = statusCode === 502 ? "DataBase Error" : "Internal Server Error";
    console.log('errTitleMsg =====>>>>>', errTitleMsg)
    console.log('statusCode ====>>>>>', statusCode);
    updatedEditedBookData === updatedEditedBookData ? res.status(statusCode).send({
            status : updatedEditedBookData.status,
            message : updatedEditedBookData.message,
            errorCode : errorCode,
            errTitleMsg : errTitleMsg,
            updatedEditedBook : updatedEditedBookPublication,
            editedBookId : editedBookId,
            supportingDocuments : updatedEditedBookData.updatedEditedBookFiles
        }) : res.status(statusCode).send({
        message : 'Internal Server Error',
        statusCode : statusCode
    });

    // if(req.files){
    //     // const updatedFile = req.file.filename;
    //     console.log('files in controller ===>>>', req.files)
        // const updatedEditedBookData = await editedBookPublication.updateEditedBook(editedBookId, updatedEditedBookPublication, req.files);
    //     const updatedEditedBookFiles = updatedEditedBookData.updatedEditedBookFiles;
    //     console.log('updated files data in controller ===>>>', updatedEditedBookFiles)
    //     if(updatedEditedBookData.status === 'done'){
    //         res.status(200).send({
    //             status : 'done',
    //             updatedEditedBook : updatedEditedBookPublication,
    //             editedBookId : editedBookId,
    //             updatedEditedBookFiles 
    //         })
    //     }
    // }
    // else{
    //     const updatedEditedBookData = await editedBookPublication.updateEditedBook(editedBookId, updatedEditedBookPublication);
    //     if(updatedEditedBookData.status === 'done'){
    //         res.status(200).send({
    //             status : 'done',
    //             updatedEditedBook : updatedEditedBookPublication,
    //             editedBookId : editedBookId 
    //         })
    //     }
    // }

}

module.exports.deleteEditedBookPublication = async(req, res, next) => {
    const editedBookId = req.body.editedBookId;
    const deleteEditedBookPublicationData = await editedBookPublication.deleteEditedBookPublication({editedBookId});
    if(deleteEditedBookPublicationData.status === 'Done'){
        res.status(200).send({
            status : 'Done',
            massage : 'Record  Deleted Successfully'
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