const fs = require('fs');
const path = require('path');

const editedBookPublicationModel = require('../models/edited-book.model');
const uploadFolder = path.join(__dirname, '..', '..', 'uploads');

module.exports.downloadFile = (req, res) => {
    const filename = req.params.fileName;
    const filePath = path.join(uploadFolder, filename);
    console.log("filePath ==>>", filePath);
    console.log("filename ==>>>", filename);
  
    // Extract the original filename from the provided filename
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
const filename = req.params.fileName;
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

module.exports.updateEditedBook = async(editedBookId , updatedEditedBookPublication, updatedFile) => {
    console.log('data in service ==>>', updatedEditedBookPublication)
    if(updatedFile){
        const updatedEditedBookData = await editedBookPublicationModel.updatedEditedBookPublication(editedBookId , updatedEditedBookPublication, updatedFile);
        if(updatedEditedBookData && updatedEditedBookData.rowCount === 1) {
            return {
                status : 'done',
                massage : 'date updated successfully'
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