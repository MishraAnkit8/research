const teachingExecellanceService = require("../services/teaching-excellance.service");
const { getRedisData } = require("../../utils/redis.utils");


module.exports.renderTeachingExecellance = async (req, res, next) => {
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in in dashboard controller  ===>>>>>>', userName);

  const teachingExecellance =
    await teachingExecellanceService.fetchTeachingExecellanceData(userName);
  console.log("teachingExecellance ==>>", teachingExecellance.rows);
  res.render("teaching-excellance", {
    teachingExecellance: teachingExecellance.rows,
    userName : userName,
    rowCount: teachingExecellance.rowCount,
  });
};

module.exports.insertTeachingExecellance = async (req, res, next) => {
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in in dashboard controller  ===>>>>>>', userName);

  console.log("data ===>>", req.body);
  const teachingExecellance = req.body;
  console.log("files in controller ===>>>>", req.files);

  const teachingExecellanceData = await teachingExecellanceService.insertTeachingExecellance(teachingExecellance,
      req.files, userName);

  console.log("teachingExecellanceData ===>>>", teachingExecellanceData);

  const statusCode = teachingExecellanceData.status === "Done" ? 200 : (teachingExecellanceData.errorCode ? 400 : 500);

  res.status(statusCode).send({
    status : teachingExecellanceData.status,
    message : teachingExecellanceData.message,
    errorCode : teachingExecellanceData.errorCode ? teachingExecellanceData.errorCode : null
  })
};

module.exports.updatTeachingData = async (req, res, next) => {
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in in dashboard controller  ===>>>>>>', userName);

  console.log("id ==>", req.body.teachingId);
  const teachingId = req.body.teachingId;
  const updatedTeachingExecellance = req.body;
  console.log(
    "data for updation in controller  ==>>",
    updatedTeachingExecellance
  );


  const updatedTeachingExecellanceData = await teachingExecellanceService.updatedTeachingExecellance(teachingId,
      updatedTeachingExecellance, req.files, userName);

  console.log('updatedTeachingExecellanceData ====>>>>>>', updatedTeachingExecellanceData)
  const statusCode = updatedTeachingExecellanceData.status === "Done" ? 200 : (updatedTeachingExecellanceData.errorCode ? 400 : 500);

  res.status(statusCode).send({
    status : updatedTeachingExecellanceData.status,
    message : updatedTeachingExecellanceData.message,
    errorCode : updatedTeachingExecellanceData.errorCode ? updatedTeachingExecellanceData.errorCode : null
    })

};

module.exports.deleteTeachingExecellance = async (req, res, next) => {
  const { teachingId } = req.body;
  console.log("teachingId ==>", teachingId);
  const teachingExecellance =
    await teachingExecellanceService.deleteTeachingExecellance(teachingId);
  if (teachingExecellance) {
    res.status(200).send({
      status: "done",
      massage: "deleted successfully",
    });
  }
};

module.exports.viewTeachingExecellance = async (req, res, next) => {
  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`)
  const  userName = sessionData.username;
  console.log('userName in in dashboard controller  ===>>>>>>', userName);

  console.log("Id ==>>", req.body);
  const { teachingId } = req.body;
  const teachingExecellanceView =
    await teachingExecellanceService.viewTeachingExecellance(teachingId);
  if (teachingExecellanceView) {
    res.status(200).send({
      status: "done",
      teachingExecellanceView: teachingExecellanceView,
    });
  }
};
