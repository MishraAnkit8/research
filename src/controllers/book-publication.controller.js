const fs = require('fs');
const path = require('path');

const bookPublicationService = require('../services/book-publication.service');

// uploaded file path for dowload
const uploadFolder = path.join(__dirname, '..', '..', 'uploads');
console.log('uploadFolder ==>>', uploadFolder)

module.exports.downloadFile = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadFolder, filename);
  console.log("filePath ==>>", filePath);
  console.log("filename ==>>>", filename);
  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send("Error downloading file");
    }
  });
};

module.exports.viewFile = (req, res, next) => {
const filename = req.params.filename;
  const filePath = path.join(uploadFolder, filename);
  console.log("filePath ==>>", filePath);
  console.log("filename ==>>>", filename);

  fs.access(filePath, fs.constants.R_OK, (err) => {
    if (err) {
      console.error('Error accessing file:', err);
      res.status(404).send('File not found');
    } else {
      // Stream the file to the response for download
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    }
  });
}


module.exports.renderBookPublication = async(req, res, next) => {
    const fetchBookPublicationData = await bookPublicationService.fetchBookPublicationData();
    console.log('bookPublicationList  in controller ==>>', fetchBookPublicationData);
    if(fetchBookPublicationData){
        res.render('book-publication' , {
            bookPublicationList : fetchBookPublicationData.rows,
            rowCount : fetchBookPublicationData.rowCount
        })
    }
}

module.exports.insertBookPublication = async(req, res, next) => {
    const bookPublicationData  = req.body;
    const filename =  req.file.filename;
    console.log('data in controller ==>>', req.body);
    const insertBookPublicarionData = await bookPublicationService.insertBookPublication(bookPublicationData, filename);
    if(insertBookPublicarionData){
        res.status(200).send({
            status : 'done',
            bookPublicationData : bookPublicationData,
            bookPublicationId  : insertBookPublicarionData,
            filename : filename
        })
    }

}
module.exports.updateBookPublication = async(req, res, next) => {
    console.log('data comming from frontend ==>>', req.body);
    const bookPublicationId  = req.body.bookPublicationId ;
    console.log('id ==', bookPublicationId )
    const updatedBookPublicationData = req.body;
    updatedBookPublicationData.researchSupportingDocument = req.file ? req.file.filename : null;
    console.log(' updatedFile in controller ==>>', req.file);
    if(req.file) {
        const updatedFile = req.file.filename;
        const updatedBookPublication = await bookPublicationService.updateBookPublication( bookPublicationId, updatedBookPublicationData, updatedFile);
        console.log('updatedBookPublication ==>>>', updatedBookPublication);
        if(updatedBookPublication.status === 'done'){
            res.status(200).send({
                status : 'done',
                updatedBookPublication : updatedBookPublicationData,
                bookPublicationId : bookPublicationId,
                updatedFile : updatedFile 
            })
        }
    }
    else {
        const updatedBookPublication = await bookPublicationService.updateBookPublication( bookPublicationId, updatedBookPublicationData);
        console.log('updatedBookPublication ==>>', updatedBookPublication);
        if(updatedBookPublication.status === 'done'){
            res.status(200).send({
                status : 'done',
                updatedBookPublication : updatedBookPublicationData,
                bookPublicationId : bookPublicationId 
            })
        }

    }
  

}

module.exports.deleteBookPublication = async(req, res, next) => {
    const bookPublicationId = req.body.bookPublicationId;
    const deleteBookPublicationData = await bookPublicationService.deleteBookPublicationData({bookPublicationId});
    if(deleteBookPublicationData.status === 'done'){
        res.status(200).send({
            status : 'done',
            massage : 'deleted successfully'
        })
    }
}

module.exports.viewBookPublication = async(req, res, next) => {
    const {bookPublicationId} = req.body;
    const bookPublicationView = await bookPublicationService.viewBookPublication(bookPublicationId);
    console.log('data in controller ==>>', bookPublicationView)
    if(bookPublicationView){
        res.status(200).send({
            status : 'done',
            bookPublicationView : bookPublicationView
        })
    }
}