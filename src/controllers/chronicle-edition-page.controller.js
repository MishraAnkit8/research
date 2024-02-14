const chronicleEditionService = require('../services/chronicle-editor.service');

module.exports.renderChronicleEditionPage = async(req, res, next)  => {
    const chronicleDataController = await chronicleEditionService.renderChronicleEdition();
    console.log('chronicleDataController ==>>>', chronicleDataController.rows);
    let brandingData = [];
    let meetingData = [];
    let researchData = [];
    let vcData = [];
    const chronicleData = chronicleDataController.rows;
    console.log("chronicleData ==>>>", chronicleData);
    for(let i = 0; i <= chronicleData.length - 1; i++){
        console.log('table name  ==>>', chronicleData[i].table_name);
        console.log(' data value ==>>', chronicleData[i].editor_data);
        console.log(' table id ==>>', chronicleData[i].id);

    }
    const dataByTableAndId = {};

    // Group editor_data by table_name and id
    chronicleData.forEach((data) => {
      const { table_name, id, editor_data } = data;
      if (!dataByTableAndId[table_name]) {
        dataByTableAndId[table_name] = {};
      }
      if (!dataByTableAndId[table_name][id]) {
        dataByTableAndId[table_name][id] = [];
      }
      dataByTableAndId[table_name][id].push( editor_data );
    });
    console.log('dataByTableAndId ==>>>', dataByTableAndId.vc_editor_table);
    const vcEditorData = dataByTableAndId.vc_editor_table;
    const brandingEditorData = dataByTableAndId.branding_editor_table;
    const meetingeditotData = dataByTableAndId.meeting_editor_table;
    const researchEditorData = dataByTableAndId.research_editor_table;
    // data array ontainer
    const dataContainerArray = [vcEditorData, researchEditorData, meetingeditotData, brandingEditorData];
    console.log('dataContainerArray ==>>>', dataContainerArray)
    console.log('vcEditorData ==>>>', vcEditorData);

    // heading container array
    const headingContainer = [
        "From Vice Chancellor's Desk",
        "Research",
        "Meeting Stakeholders Aspiration",
        "Branding"   
    ];
    
    console.log('headingContainer ==>>>', headingContainer)
    for (const key in vcEditorData) {
        console.log("ID:", key);
        vcEditorData[key].forEach(item => console.log(item));
      }

    res.render('chronicle-edition-data' , {
        dataContainerArray,
        headingContainer
    })
}

