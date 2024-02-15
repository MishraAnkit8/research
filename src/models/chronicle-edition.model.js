const { autoriders_read_db, autoriders_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const autoDbR = dbPoolManager.get('autoDbR', autoriders_read_db);
const autoDbW = dbPoolManager.get('autoDbW', autoriders_write_db);

module.exports.fetchEditorData = async() =>{
    const sql = {
      text: `
          SELECT 'vc_editor_table' AS table_name, id, vc_editor_data AS editor_data FROM vc_editor_table
          UNION ALL
          SELECT 'research_editor_table' AS table_name, id, research_editor_data AS editor_data FROM research_editor_table
          UNION ALL
          SELECT 'meeting_editor_table' AS table_name, id, meeting_editor_data AS editor_data FROM meeting_editor_table
          UNION ALL
          SELECT 'branding_editor_table' AS table_name, id, branding_editor_data AS editor_data FROM branding_editor_table
          ORDER BY table_name, id
      `,
    };

    console.log('sql ===>>>', sql);
    return autoDbR.query(sql)

};

module.exports.insertVcEditorData = async(body) => {
    const vcEditorData = body.chronicalEditorData;
    // console.log("data in models ==>>", vcEditorData);

    let sql = {
      text : `INSERT INTO vc_editor_table (vc_editor_data) VALUES($1)  RETURNING id `,
      values : [vcEditorData]
    }
    // console.log("sql ==>>>", sql);
    const result = await autoDbW.query(sql);
    // console.log('result ===>>>', result.rows)
    return result.rows
};

module.exports.insertResearchEditor = async(body) => {
    const researchEditorData = body.chronicalEditorData;
    console.log("data in models ==>>", researchEditorData);

    let sql = {
      text : `INSERT INTO research_editor_table (research_editor_data) VALUES($1)  RETURNING id `,
      values : [researchEditorData]
    }
    console.log("sql ==>>>", sql);
    const result = await autoDbW.query(sql);
    console.log('result ===>>>', result.rows)
    return result.rows
};

module.exports.insertMeetingEditor = async(body) => {
    const meetingEditorData = body.chronicalEditorData;
    console.log("data in models ==>>", meetingEditorData);

    let sql = {
      text : `INSERT INTO meeting_editor_table (meeting_editor_data) VALUES($1)  RETURNING id `,
      values : [meetingEditorData]
    }
    console.log("sql ==>>>", sql);
    const result = await autoDbW.query(sql);
    console.log('result ===>>>', result.rows)
    return result.rows
};

module.exports.insertBrandingeditor = async(body) => {
    const brandingEditorData = body.chronicalEditorData;
    console.log("data in models ==>>", brandingEditorData);

    let sql = {
      text : `INSERT INTO branding_editor_table (branding_editor_data) VALUES($1)  RETURNING id `,
      values : [brandingEditorData]
    }
    console.log("sql ==>>>", sql);
    const result = await autoDbW.query(sql);
    console.log('result ===>>>', result.rows)
    return result.rows
};