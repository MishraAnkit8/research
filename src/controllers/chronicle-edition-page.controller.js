const chronicleEditionService = require('../services/chronicle-editor.service');

module.exports.renderChronicleEditionPage = async(req, res, next)  => {
    const chronicleDataController = await chronicleEditionService.renderChronicleEdition();
    console.log('chronicleDataController ==>>>', chronicleDataController.rows);

    const chronicleData = chronicleDataController.rows;
    console.log("chronicleData ==>>>", chronicleData);
    const dateString = chronicleData[0].date;
    console.log('dateString ===>>', dateString);
    for(let i = 0; i <= chronicleData.length - 1; i++){
        console.log('table name  ==>>', chronicleData[i].table_name);
        console.log(' data value ==>>', chronicleData[i].editor_data);
        console.log('editor date ==>>', chronicleData[i].date)
        console.log(' table id ==>>', chronicleData[i].id);

    }
    const dataByTableAndId = {};

    // Group editor_data by table_name and id
    chronicleData.forEach((data) => {
      const { table_name, id, editor_data, date} = data;
      console.log('data in controller ===>>>', data)
      if (!dataByTableAndId[table_name]) {
        dataByTableAndId[table_name] = {};
      }
      if (!dataByTableAndId[table_name][id]) {
        dataByTableAndId[table_name][id] = [];
      }
      dataByTableAndId[table_name][id].push( date );

      dataByTableAndId[table_name][id].push( editor_data );
    });
    console.log('dataByTableAndId ====.>>', dataByTableAndId)
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
      res.status(200).render('chronicle-edition-data' , {
        status: 'Done',
        dataContainerArray,
        headingContainer
    });
    
}












