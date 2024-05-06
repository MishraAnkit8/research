const { getRedisData } = require('../../utils/redis.utils');
const editedBookPublication = require('../services/edited-book.service');

module.exports.renderEdietedBookPublication = async(req, res, next) => {
    const  userName = req.body.username;
 console.log('userName in controller  ===>>>>>>', userName);

    const editedBookPublicationData = await editedBookPublication.fetchEditedBookPublicationData(userName);
    console.log('editeBookList  in controller ==>>', editedBookPublicationData);
    if(editedBookPublicationData){
        res.render('edited-book-publication' , {
            editedBookList : editedBookPublicationData.rows,
            rowCount : editedBookPublicationData.rowCount
        })
    }
}

module.exports.insertEditedBookPublication = async(req, res, next) => {
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in controller insertEditedBookPublication===>>>>>>', userName);

    const editedBook  = req.body;
    console.log('editedBookPublication ==>>', editedBook);
    console.log('data in controller ==>>', req.body);
    const insertEditedBookPublication = await editedBookPublication.insertEditedBookPublication(editedBook, req.files, userName);
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
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    console.log('data comming from frontend ==>>', req.body);
    const editedBookId  = req.body.editedBookId;
    console.log('id ==', editedBookId)
    const updatedEditedBookPublication = req.body;

    const updatedEditedBookData = await editedBookPublication.updateEditedBook(editedBookId, updatedEditedBookPublication, req.files, userName);

    console.log('updatedEditedBookData in controller ===>>>>', updatedEditedBookData);
    const statusCode = updatedEditedBookData.status === "Done" ? 200 : (updatedEditedBookData.errorCode ? 502 : 500);
    res.status(statusCode).send({
        status : updatedEditedBookData.status,
        message : updatedEditedBookData.message,
        rowCount : updatedEditedBookData.rowCount,
        supportingDocuments : updatedEditedBookData.updatedEditedBookFiles,
        updatedEditedBook : updatedEditedBookData.updatedEditedBookPublication,
        errorCode : updatedEditedBookData.errorCode ? updatedEditedBookData.errorCode : null,
        statusCode : statusCode
    })

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
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const {editedBookId} = req.body;
    const editedBookView = await editedBookPublication.editedBookPublicationView(editedBookId, userName);
    console.log('data in controller ==>>', editedBookView)
    if(editedBookView){
        res.status(200).send({
            status : 'done',
            editedBookView : editedBookView
        })
    }
}