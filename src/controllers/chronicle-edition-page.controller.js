const chronicleEditionService = require('../services/chronicle-editor.service');

module.exports.renderChronicleEditionPage = async(req, res, next)  => {
  const dataId = req.params.id;
  console.log('dataId ====>>>', dataId);

  const chronicleDataController = await chronicleEditionService.renderChronicleEdition();

  console.log(' supporting text ===>>>', req.params.textdata)
  // for vc data
  const vcOfficeEditor = chronicleDataController.fetchVcOfficeData;
  const vcOfficeData = vcOfficeEditor.rows;
    // for research
  const researchEditor = chronicleDataController.fetchResearchData;
  const researchData = researchEditor.rows;
  // for meetingEditor
  const meetingEditor = chronicleDataController.fetchMeetingData;
  const meetingData = meetingEditor.rows;
  // console.log('meetingData ===>>', meetingData);

  // for brandingEditor
  const brandingEditor = chronicleDataController.fetchBrandingData;
  const brandingData = brandingEditor.rows;
  console.log('brandingEditor ===>>>>', brandingData)

  console.log("vcOfficeData ===>>>>", vcOfficeData);
  //for vc data view 
  if (req.params.textdata === "vcOfficeData") {
    const desiredData = vcOfficeData.find((item) => item.id == dataId);

    if (desiredData) {
      const viewDataById = desiredData.editor_data;
      console.log("viewDataById =====>>>>", viewDataById);
      res.status(200).render("chronicle-edition-data", {
        status: "Done",
        viewDataById,
      });
    } else {
      console.log("Data not found for ID:", dataId);
      // Handle the case when data is not found for the given ID
      res.status(404).send("Data not found");
    }
  }

   // for meeting data
   if (req.params.textdata === "meetingData") {
    const desiredData = meetingData.find((item) => item.id == dataId);

    if (desiredData) {
      const viewDataById = desiredData.editor_data;
      console.log("viewDataById =====>>>>", viewDataById);
      res.status(200).render("chronicle-edition-data", {
        status: "Done",
        viewDataById,
      });
    } else {
      console.log("Data not found for ID:", dataId);
      // Handle the case when data is not found for the given ID
      res.status(404).send("Data not found");
    }
  }

   // for reseach data
   if (req.params.textdata === "researchData") {
    const desiredData = researchData.find((item) => item.id == dataId);

    if (desiredData) {
      const viewDataById = desiredData.editor_data;
      console.log("viewDataById =====>>>>", viewDataById);
      res.status(200).render("chronicle-edition-data", {
        status: "Done",
        viewDataById,
      });
    } else {
      console.log("Data not found for ID:", dataId);
      // Handle the case when data is not found for the given ID
      res.status(404).send("Data not found");
    }
  }

    // for branding data
    if (req.params.textdata === "brandingData") {
      const desiredData = brandingData.find((item) => item.id == dataId);
  
      if (desiredData) {
        const viewDataById = desiredData.editor_data;
        console.log("viewDataById =====>>>>", viewDataById);
        res.status(200).render("chronicle-edition-data", {
          status: "Done",
          viewDataById,
        });
      } else {
        console.log("Data not found for ID:", dataId);
        // Handle the case when data is not found for the given ID
        res.status(404).send("Data not found");
      }
    }
}











