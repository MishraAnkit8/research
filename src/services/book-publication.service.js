const fs = require('fs');
const path = require('path');

const bookPublicationModel = require('../models/book-publication.models');
// uploaded file path for dowload
const uploadFolder = path.join(__dirname, '..', '..', 'uploads');

module.exports.downloadFile = (req, res) => {
    const filename = req.params.fileName;
    const filePath = path.join(uploadFolder, filename);
    console.log("filePath ==>>", filePath);
    console.log("filename ==>>>", filename);

    const originalFilename = filename.split('_').slice(1).join('_');
  
    // Set the content type header to force the browser to treat it as a PDF
    res.setHeader('Content-Type', 'application/pdf');
  
    // Set the filename for the download
    res.download(filePath, originalFilename, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).send("Error downloading file");
      } else {
        console.log('File downloaded successfully');
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