const fs = require('fs');
const path = require('path');

const bookChapterModels = require('../models/book-chapter.model');

const uploadFolder = path.join(__dirname, '..', '..', 'uploads');

module.exports.downloadFile = (req, res) => {
    const filename = req.params.fileName;
    const filePath = path.join(uploadFolder, filename);
    console.log("filePath ==>>", filePath);
    console.log("filename ==>>>", filename);
  
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

module.exports.fetchBookChapter= async() => {
    const BookChapterData = await bookChapterModels.fetchEditedBookPublication();
    console.log(BookChapterData.rows[0]);
    return BookChapterData
}

module.exports.insertBookChapter = async(bookChapter , files) => {
    var bookChapterDataFiles = '';
    if(files){
      for(let i = 0; i <= files.length - 1; i++){
          if(files && files[i].filename){
            bookChapterDataFiles += files[i].filename + ',';
          }
      }
    }
    const bookChapterInsertedData = await bookChapterModels.insertBookChapterData(bookChapter, bookChapterDataFiles);
    const bookChapterId = bookChapterInsertedData.rows[0].id;
    console.log('bookChapterId ===>>>', bookChapterId)
    if(bookChapterInsertedData){
        return{
          bookChapterId,
          bookChapterDataFiles
        } 
    }
}

module.exports.updatedBookChapter = async(bookChapterId, updatedBookChapterPublication, files) => {
    if(files){
        var updateBookChapterDataFiles = '';
        for(let i = 0; i<= files.length - 1 ; i++){
          if(files  && files[i].filename){
            updateBookChapterDataFiles += files[i].filename + ',';
          }
        }
        console.log('updateBookChapterDataFiles ===>>>>', updateBookChapterDataFiles)
        const updatedBookChapterData = await bookChapterModels.updatedBookChapter(bookChapterId , updatedBookChapterPublication, updateBookChapterDataFiles);
        if(updatedBookChapterData && updatedBookChapterData.rowCount === 1) {
            return {
                status : 'done',
                massage : 'date updated successfully',
                updateBookChapterDataFiles
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