const chronicleService = require("../services/chronicle-editor.service");
const { getRedisData } = require('../../utils/redis.utils');


function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

module.exports.renderChronicleEdition = async (req, res, next) => {
  const dataId = req.params.id;
  console.log('dataId ====>>>', dataId);

  const sessionid = req.cookies.session;
  let sessionData = await getRedisData(`${sessionid}:session`);
  const userName = sessionData.username;
  console.log('userName in controller  ===>>>>>>', userName);

  const chronicleData = await chronicleService.renderChronicleEdition(userName);

  const chronicleEditorData = [];

  // type of editor container array
  const typeContainerArray = [
    "From Vice Chancellor's Desk",
    "Research",
    "Meeting Stakeholders Aspiration",
    "Branding"
  ];

  // for vc data
  const vcOfficeEditor = chronicleData.fetchVcOfficeData;
  const vcOfficeData = vcOfficeEditor.rows;
  let vcRowCount = parseInt(vcOfficeEditor.rowCount);
  console.log('vcRowCount ===>>>>', vcRowCount);

  // for research editor
  const researchEditor = chronicleData.fetchResearchData;
  const researchData = researchEditor.rows;
  let researchCount = parseInt(researchEditor.rowCount);

  // for meetingEditor
  const meetingEditor = chronicleData.fetchMeetingData;
  const meetingData = meetingEditor.rows;
  let meetingRowCount = parseInt(meetingEditor.rowCount);

  // for brandingEditor
  const brandingEditor = chronicleData.fetchBrandingData;
  const brandingData = brandingEditor.rows;
  let brandingRowCount = parseInt(brandingEditor.rowCount);

  const dataContainerArray = [vcOfficeData, researchData, meetingData, brandingData];

  // append data in chronicleEditorData
  for (let i = 0; i < dataContainerArray.length; i++) {
    const relatedEditorData = dataContainerArray[i];

    for (const item of relatedEditorData) {
      const type = typeContainerArray[i];
      chronicleEditorData.push({
        id: item.id,
        type: type,
        createdBy: item.created_by,
        date: formatDate(item.date),
        updatedAt: formatDate(item.updated_at),
        editorData: item.editor_data
      });
    }
  }

  // sort chronicleEditorData by date
  function sortByDate(a, b) {
    const dateA = new Date(a.date.split('/').reverse().join('/'));
    const dateB = new Date(b.date.split('/').reverse().join('/'));
    return dateA - dateB;
  };

  chronicleEditorData.sort(sortByDate);
  console.log('chronicleEditorData Data ==>>>:', chronicleEditorData);

  const rowCount = vcRowCount + researchCount + meetingRowCount + brandingRowCount;
  res.render("chronicle-edition", {
    chronicleEditorData,
    rowCount,
    userName: userName
  });
};



module.exports.renderVcOfficeChronicle = async(req, res, next) => {
   const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in controller  ===>>>>>>', userName);

  const vcOfficeRenderdData = await chronicleService.renderVcOfficeData();
  console.log('vcOfficeRenderdData in controller ===>>>', vcOfficeRenderdData);
}

module.exports.insertVcData = async (req, res, next) => {
   const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in controller  ===>>>>>>', userName);

  // console.log("data comming from frontend in insertVcData  ==>>", req.body);
  const chronicleEditorData = req.body.chronicleEditorData;
  const chronicleDateDate = req.body.chronicleDate;
  const chronicleDate  = formatDate(chronicleDateDate);
  const currentDate = new Date();
  const updatedAt = formatDate(currentDate);
  const editorType = "From Vice Chancellor's Desk";
  // const chronicleId = req.body.chronicleId;
  const insertVcEditorData = await chronicleService.insertVcDataService(req.body, userName);
  console.log("insertVcEditorData vc data controller ==>>", insertVcEditorData);
  const chronicleId = insertVcEditorData[0].id;
  if (insertVcEditorData) {
    res.status(200).send({
      status: "done",
      chronicleEditorData,
      chronicleDate,
      updatedAt,
      editorType,
      chronicleId
    });
  }
  else{
    res.status(500).send({
      status : 'Failed',
      massage : 'Internal Server error'
    })
  }
};


module.exports.insertResearchData = async (req, res, next) => {
  // console.log("data comming from frontend in insertResearchData  ==>>",req.body);
  
  const chronicleEditorData = req.body.chronicleEditorData;
  const chronicleDateDate = req.body.chronicleDate;

   const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in controller  ===>>>>>>', userName);

  const chronicleDate  = formatDate(chronicleDateDate);
  const currentDate = new Date();
  const updatedAt = formatDate(currentDate);
  const editorType = 'Research';
  const insertResearchEditorData = await chronicleService.insertResearchDataService(req.body, userName);
  console.log("chronicleDataToBeInserted in controller ==>>", insertResearchEditorData);
  const chronicleId = insertResearchEditorData[0].id;
  if (insertResearchEditorData) {
    res.status(200).send({
      status: "done",
      chronicleEditorData,
      chronicleDate,
      updatedAt,
      editorType,
      chronicleId
    });
  }
};

module.exports.insertMeetingData = async (req, res, next) => {
  // console.log("data comming from frontend in insertMeetingData  ==>>",req.body);
  const chronicleEditorData = req.body.chronicleEditorData;
  const chronicleDateDate = req.body.chronicleDate;

   const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in controller  ===>>>>>>', userName);

  const chronicleDate  = formatDate(chronicleDateDate);
  const currentDate = new Date();
  const updatedAt = formatDate(currentDate);
  const editorType = "Meeting Stakeholders Aspiration";
  const insertMeetingEditorData = await chronicleService.insertMeetingDataService(req.body, userName);
  // console.log("chronicleDataToBeInserted in controller ==>>", insertMeetingEditorData);
  const chronicleId = insertMeetingEditorData[0].id;
  if (insertMeetingEditorData) {
    res.status(200).send({
      status: "done",
      chronicleEditorData,
      chronicleDate,
      updatedAt,
      editorType,
      chronicleId
    });
  }
};

module.exports.insertBrandingData = async (req, res, next) => {
  // console.log("data comming from frontend in Branding  ==>>", req.body);
  const chronicleEditorData = req.body.chronicleEditorData;
  const chronicleDateDate = req.body.chronicleDate;
  const chronicleDate  = formatDate(chronicleDateDate);

   const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in controller  ===>>>>>>', userName);

  const currentDate = new Date();
  const updatedAt = formatDate(currentDate);
  const editorType = "Branding";
  const insertBrandingEditorData = await chronicleService.insertBrandingDataService(req.body, userName);
  // console.log("chronicleDataToBeInserted in controller ==>>", insertBrandingEditorData);
  const chronicleId = insertBrandingEditorData[0].id;
  console.log('chronicleId id in controller ==>>>>', chronicleId);
  if (insertBrandingEditorData) {
    res.status(200).send({
      status: "done",
      chronicleEditorData,
      chronicleDate,
      updatedAt,
      editorType,
      chronicleId
    });
  }
};


module.exports.updateVcData = async(req, res, next) => {
  const updatedChronicleEditorData = req.body.updatedChronicleEditorData;
  const updatedChronicleDate = req.body.updatedChronicleDate;
  const chronicleDate  = formatDate(updatedChronicleDate);

   const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in controller  ===>>>>>>', userName);

  const chronicleId = req.body.chronicleId;
  const currentDate = new Date();
  const updatedAt = formatDate(currentDate);
  // console.log('data comming from frontend ====>>>', req.body);
  const updatedVcData = await chronicleService.updatedVcOfficeData(req.body, userName);
  if(updatedVcData){
    res.status(200).send({
      status : 'done',
      updatedChronicleEditorData,
      chronicleDate,
      updatedAt

    })
  }
  else{
    res.status(404).send({
            status :'failed',
            massage : 'Unable To Update Vc Editor Content'
    })
  }
}

module.exports.updateMeetingData = async(req, res, next) => {
  console.log(' meeting data in controller ', req.body);
  const updatedChronicleEditorData = req.body.updatedChronicleEditorData;
  const updatedChronicleDate = req.body.updatedChronicleDate;
  const chronicleDate  = formatDate(updatedChronicleDate);

   const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in controller  ===>>>>>>', userName);

  const chronicleId = req.body.chronicleId;
  const currentDate = new Date();
  const updatedAt = formatDate(currentDate);
  const updatedMeetingData = await chronicleService.updatedMeetingStackholder(req.body, userName);
  if(updatedMeetingData){
    res.status(200).send({
      status : 'done',
      updatedChronicleEditorData,
      chronicleDate,
      updatedAt,
      chronicleId

    })
  }
  else{
    res.status(404).send({
            status :'failed',
            massage : 'Unable To Update Meeting Editor Content'
    })
  }
  
}

module.exports.updateResearchData = async(req, res, next) => {
  console.log('research  data in controller ', req.body);
  const updatedChronicleEditorData = req.body.updatedChronicleEditorData;
  const updatedChronicleDate = req.body.updatedChronicleDate;
  const chronicleDate  = formatDate(updatedChronicleDate);

   const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in controller  ===>>>>>>', userName);

  const chronicleId = req.body.chronicleId;
  const currentDate = new Date();
  const updatedAt = formatDate(currentDate);
  const updatedResearchData = await chronicleService.updatedResearch(req.body, userName);
  console.log('updatedResearchData ====>>>>>>', updatedResearchData);
  if(updatedResearchData){
    res.status(200).send({
      status : 'done',
      updatedChronicleEditorData,
      chronicleDate,
      updatedAt,
      chronicleId

    })
  }
  else{
    res.status(404).send({
            status :'failed',
            massage : 'Unable To Update Research Editor Content'
    })
  }
}

module.exports.updateBrandingData = async(req, res, next) => {
  console.log(' branding data in controller ', req.body);
  const updatedChronicleEditorData = req.body.updatedChronicleEditorData;
  const updatedChronicleDate = req.body.updatedChronicleDate;
  const chronicleDate  = formatDate(updatedChronicleDate);

   const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in controller  ===>>>>>>', userName);

  const chronicleId = req.body.chronicleId;
  const currentDate = new Date();
  const updatedAt = formatDate(currentDate);
  
  const updatedBrandingData = await chronicleService.updatedBrandingAdvertising(req.body, userName);
  if(updatedBrandingData){
    res.status(200).send({
      status : 'done',
      updatedChronicleEditorData,
      chronicleDate,
      updatedAt,
      chronicleId

    })
  }
  else{
    res.status(404).send({
            status :'failed',
            massage : 'Unable To Update Branding Editor Content'
    })
  }
}

module.exports.deleteVcData = async(req, res, next) => {
  console.log('data in controller ===>>>', req.body);

   const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in controller  ===>>>>>>', userName);

  const deleteVcEditor = await chronicleService.deleteVcContent(req.body, userName);
  if(deleteVcEditor){
    res.status(200).send({
      status : 'done'
    })
  }
}

module.exports.deleteResearchData = async(req, res, next) => {
  console.log('data in controller ===>>>', req.body);

   const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in controller  ===>>>>>>', userName);

  const deleteResearchEditor = await chronicleService.deleteResearchContent(req.body, userName);
  if(deleteResearchEditor){
    res.status(200).send({
      status : 'done'
    })
  }

}

module.exports.deleteMeetingData = async(req, res, next) => {
  console.log('data in controller ===>>>', req.body);

   const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in controller  ===>>>>>>', userName);

  const deleteMeetingEditor = await chronicleService.deleteMeetingContent(req.body, userName);
  if(deleteMeetingEditor){
    res.status(200).send({
      status : 'done'
    })
  }

}

module.exports.deleteBrandingData = async(req, res, next) => {
  console.log('data in controller ===>>>', req.body);

   const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in controller  ===>>>>>>', userName);

  const deleteBrandingEditor = await chronicleService.deleteBrandingContent(req.body, userName);
  if(deleteBrandingEditor){
    res.status(200).send({
      status : 'done'
    })
  }
}

