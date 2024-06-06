const bookChapterServices = require("../services/book-chapter.service");
const { getRedisData } = require("../../utils/redis.utils");

module.exports.renderBookChapterPublication = async (req, res, next) => {
  const userName = req.body.username;
  console.log("userName in book chapter controller  ===>>>>>>", userName);

  const bookChapterData = await bookChapterServices.fetchBookChapter(userName);
  // console.log('bookChapterData in controller ==>>', bookChapterData);
  if (bookChapterData) {
    res.render("book-chapter-publication", {
      bookChapterData: bookChapterData.rows,
      rowCount: bookChapterData.rowCount,
      userName : userName
    });
  }
};

module.exports.insertBookChapterPublication = async (req, res, next) => {
  // const  userName = req.body.username;
  // console.log('userName in controller fghjh ===>>>>>>', userName);
  const cookies = req.cookies;
  console.log("cookies ==>>>>>", cookies);
  const key = cookies.session;
  const userSession = await getRedisData(`${key}:session`);
  console.log("userSession ====>>>>>>>", userSession);

  const userName = userSession.username;
  try {
    const { status, headers, body } = await serverFetch(
      "https://portal.svkm.ac.in/api-gateway/auth/mobile/auth/logout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userName),
      }
    );
  } catch (error) {
    console.log("errrror ::::::::", error);
  }

  const bookChapter = req.body;
  console.log("bookChapter ==>>", req.body);
  console.log("files  in controller ==>>", req.files);

  const insertBookChapterData = await bookChapterServices.insertBookChapter(
    bookChapter,
    req.files,
    userName
  );

  console.log(
    "insertBookChapterData in controller ===>>>",
    insertBookChapterData
  );
  const statuscode =
    insertBookChapterData.status === "Done"
      ? 200
      : insertBookChapterData.errorCode
      ? 400
      : 500;
  console.log("statuscode ===>>>", statuscode);
  res.status(statuscode).send({
    status: insertBookChapterData.status,
    message: insertBookChapterData.message,
    bookChapter: insertBookChapterData.bookChapterData,
    supportingDocuments: insertBookChapterData.bookChapterDataFiles,
    errorCode: insertBookChapterData.errorCode
      ? insertBookChapterData.errorCode
      : null,
    statuscode: statuscode,
    bookChapterId: insertBookChapterData.bookChapterId,
    rowCount: insertBookChapterData.rowCount,
  });
};

// for updating book chapter
module.exports.updateBookChapterData = async (req, res, next) => {
  const userName = req.body.username;
  console.log("userName in controller  ===>>>>>>", userName);

  console.log("data comming from frontend ==>>", req.body);
  const bookChapterId = req.body.bookChapterId;
  console.log("id ==", bookChapterId);
  const updatedBookChapterPublication = req.body;

  const updatedBookChapterData = await bookChapterServices.updatedBookChapter(
    bookChapterId,
    updatedBookChapterPublication,
    req.files,
    userName
  );

  console.log(
    "updatedBookChapterData in controller ====>>>>>",
    updatedBookChapterData
  );
  const updatedFile = updatedBookChapterData
    ? updatedBookChapterData.updateBookChapterDataFiles
    : null;
  console.log("updatedFile ===>>>>", updatedFile);
  const statuscode =
    updatedBookChapterData.status === "Done"
      ? 200
      : updatedBookChapterData.errorCode
      ? 400
      : 500;
  console.log("statuscode ===>>>", statuscode);
  res.status(statuscode).send({
    status: updatedBookChapterData.status,
    message: updatedBookChapterData.message,
    updatedBookChapter: updatedBookChapterData.updatedBookChapterPublication,
    updatedFile: updatedBookChapterData.updateBookChapterDataFiles,
    errorCode: updatedBookChapterData.errorCode
      ? updatedBookChapterData.errorCode
      : null,
    statuscode: updatedBookChapterData,
  });
};

module.exports.deleteBookChapterData = async (req, res, next) => {
  const bookChapterId = req.body.bookChapterId;
  //const deletebookChapter = await bookChapterServices.deleteBookChapterPublication({bookChapterId});
  const deletebookChapter =
    await bookChapterServices.deleteBookChapterPublication(bookChapterId);

  const statuscode =
    deletebookChapter.status === "Done"
      ? 200
      : deletebookChapter.errorCode
      ? 400
      : 500;
  res.status(statuscode).send({
    status: deletebookChapter.status,
    message: deletebookChapter.message,
    errorCode: deletebookChapter.errorCode ? deletebookChapter.errorCode : null,
  });
};

module.exports.viewBookChapterData = async (req, res, next) => {
  const userName = req.body.username;
  console.log("userName in controller  ===>>>>>>", userName);

  const { bookChapterId } = req.body;
  const bookChapterView = await bookChapterServices.viewBookChapterData(
    bookChapterId,
    userName
  );
  console.log("data in controller ==>>", bookChapterView);
  if (bookChapterView) {
    res.status(200).send({
      status: "done",
      bookChapterView: bookChapterView,
    });
  }
};
