const chronicleService = require("../services/chronicle-editor.service");

module.exports.renderChronicleEdition = async (req, res, next) => {
  const chronicleData = await chronicleService.renderChronicleEdition();
  console.log("chronicleData ==>>", chronicleData);
  const rowCount = chronicleData.rowCount;
  console.log("rowCount ==>>", rowCount);
  const idTableNameMap = {};
  for (const row of chronicleData.rows) {
      if (!idTableNameMap[row.id]) {
          idTableNameMap[row.id] = [];
      }
      idTableNameMap[row.id].push(row.table_name);
  }
  console.log('idTableNameMap:', idTableNameMap);
  
  let idsArray = ["brandingId", "meetingId", "researchId", "vcId"];

  let valuesArray = ["brandingData", "meetingData", "researchData", "vcData"];

  let chronicleDataObj = [];

  const chronicleIds = [];
  const dividedRow = rowCount % 4;
  console.log("dividedRow ==>>>", dividedRow);
  const loopIteration = rowCount - dividedRow;

  for (let j = 1; j <= dividedRow; j++) {
    const datValueArray = []
    for (let i = 0; i <= loopIteration - 1; i++) {
      const keyName = idsArray[i];
      const dataKeyName = valuesArray[i];
      const valueName = chronicleData.rows[j].id;
      console.log("valueName ===>>>", valueName);
      const dataValues = chronicleData.rows[i].editor_data;
      // data container object
      let dataObj = {};
      dataObj[dataKeyName] = dataValues;
      datValueArray.push(dataObj);
      // id container object
      const idObj = {};
      idObj[keyName] = valueName;
      chronicleIds.push(idObj);
    }
    // datValueArray.push(dataObj);
  }

  console.log("chronicleIds ==>>", chronicleIds);

  console.log("chronicleDataObj ==>>", chronicleDataObj);
  res.render("chronicle-edition", {
    chronicleDataObj: chronicleDataObj,
    chronicleIds: chronicleIds,
    rowCount: rowCount
  });
};


module.exports.insertVcData = async (req, res, next) => {
  // console.log("data comming from frontend in insertVcData  ==>>", req.body);
  const insertVcEditorData = await chronicleService.insertVcDataService(
    req.body
  );
  console.log("insertVcEditorData vc data controller ==>>", insertVcEditorData);
  if (insertVcEditorData) {
    res.status(200).send({
      status: "done",
    });
  }
};


module.exports.insertResearchData = async (req, res, next) => {
  console.log(
    "data comming from frontend in insertResearchData  ==>>",
    req.body
  );
  const insertResearchEditorData =
    await chronicleService.insertResearchDataService(req.body);
  console.log(
    "chronicleDataToBeInserted in controller ==>>",
    insertResearchEditorData
  );
  if (insertResearchEditorData) {
    res.status(200).send({
      status: "done",
    });
  }
};

module.exports.insertMeetingData = async (req, res, next) => {
  console.log(
    "data comming from frontend in insertMeetingData  ==>>",
    req.body
  );
  const insertMeetingEditorData =
    await chronicleService.insertMeetingDataService(req.body);
  console.log(
    "chronicleDataToBeInserted in controller ==>>",
    insertMeetingEditorData
  );
  if (insertMeetingEditorData) {
    res.status(200).send({
      status: "done",
    });
  }
};

module.exports.insertBrandingData = async (req, res, next) => {
  console.log("data comming from frontend in Branding  ==>>", req.body);
  const insertBrandingEditorData =
    await chronicleService.insertBrandingDataService(req.body);
  console.log(
    "chronicleDataToBeInserted in controller ==>>",
    insertBrandingEditorData
  );
  if (insertBrandingEditorData) {
    res.status(200).send({
      status: "done",
    });
  }
};
