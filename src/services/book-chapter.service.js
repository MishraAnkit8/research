const fs = require('fs');
const path = require('path');

const bookChapterModels = require('../models/book-chapter.model');

const uploadFolder = path.join(__dirname, '..', '..', 'uploads');

module.exports.downloadFile = (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadFolder, filename);
    console.log("filePath ==>>", filePath);
    console.log("filename ==>>>", filename);
  
    //  original filename from the provided filename
    const originalFilename = filename.split('_').slice(1).join('_');
  
    // PDF
    res.setHeader('Content-Type', 'application/pdf');
  
    // filename for the download
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

module.exports.fetchBookChapter= async() => {
    const BookChapterData = await bookChapterModels.fetchEditedBookPublication();
    console.log(BookChapterData.rows[0]);
    return BookChapterData
}

module.exports.insertBookChapter = async(bookChapter , filename) => {
    const bookChapterInsertedData = await bookChapterModels.insertBookChapterData(bookChapter, filename);
    if(bookChapterInsertedData){
        return bookChapterInsertedData.rows[0].id;
    }
}

module.exports.updatedBookChapter = async(bookChapterId, updatedBookChapterPublication, updatedFile) => {
    if(updatedFile){
        const updatedBookChapterData = await bookChapterModels.updatedBookChapter(bookChapterId , updatedBookChapterPublication, updatedFile);
        if(updatedBookChapterData && updatedBookChapterData.rowCount === 1) {
            return {
                status : 'done',
                massage : 'date updated successfully'
            }
        }
    }
    else{
        const updatedBookChapterData = await bookChapterModels.updatedBookChapter(bookChapterId , updatedBookChapterPublication);
        if(updatedBookChapterData && updatedBookChapterData.rowCount === 1) {
            return {
                status : 'done',
                massage : 'date updated successfully'
            }
        }
    }
 
    
}

module.exports.deleteBookChapterPublication = async({bookChapterId}) => {
    const bookChapterPublication = await bookChapterModels.deleteBookChapter(bookChapterId);
    if(bookChapterPublication.rowCount === 1){
        return {
            status : 'done',
            massage : 'deleted successfully'
        }
    }
}

module.exports.viewBookChapterData = async(bookChapterId) => {
    console.log('id IN service ==>>', bookChapterId);
    const viewBookChapterPublication = await bookChapterModels.viewBookChapterData(bookChapterId);
    console.log('viewBookChapterPublication ==>>', viewBookChapterPublication.rows[0]);
    if(viewBookChapterPublication.rows[0] && viewBookChapterPublication.rowCount === 1){
        return viewBookChapterPublication.rows[0]
    }
}