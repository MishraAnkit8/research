const { autoriders_read_db, autoriders_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const autoDbR = dbPoolManager.get('autoDbR', autoriders_read_db);
const autoDbW = dbPoolManager.get('autoDbW', autoriders_write_db);

module.exports.fetchEditorData = async() =>{
    const sql = {
      text: `
          SELECT 'vc_editor_table' AS table_name, id, editor_data AS editor_data, date as date FROM vc_editor_table
          UNION ALL
          SELECT 'research_editor_table' AS table_name, id, editor_data AS editor_data, date as date FROM research_editor_table
          UNION ALL
          SELECT 'meeting_editor_table' AS table_name, id, editor_data AS editor_data, date as date FROM meeting_editor_table
          UNION ALL
          SELECT 'branding_editor_table' AS table_name, id, editor_data AS editor_data, date as date FROM branding_editor_table
          ORDER BY table_name, id
      `,
    };

    // console.log('sql ===>>>', sql);
    return autoDbR.query(sql)

};

module.exports.fetchVcOfficeData = async() => {

  let sql = {
    text : `SELECT * FROM vc_editor_table ORDER BY id`
  }
  // console.log('sql ====>>>>', sql)
  return autoDbR.query(sql)
}

// fetch research_editor_table
module.exports.renderResearchData = async() => {

  let sql = {
    text : `SELECT * FROM research_editor_table ORDER BY id`
  }
  // console.log('sql ====>>>>', sql)
  return autoDbR.query(sql)
}

// fetch meeting_editor_table
module.exports.renderMeetingData = async() => {

  let sql = {
    text : `SELECT * FROM meeting_editor_table ORDER BY id`
  }
  console.log('sql ==== herererererer>>>>', sql)
  return autoDbR.query(sql)
}

// fetch branding data
module.exports.renderBrandingData = async() => {

  let sql = {
    text : `SELECT * FROM branding_editor_table ORDER BY id`
  }
  // console.log('sql ====>>>>', sql)
  return autoDbR.query(sql)
}

module.exports.insertVcEditorData = async(chronicleEditorData, chronicleDate) => {
    // const vcEditorData = body.chronicleEditorData;
    // console.log("data in models ==>>", chronicleEditorData);
    // const chronicleEditorData = chronicleEditionData.chronicleEditorData;
    // const chronicleDate = chronicleEditionData.chronicleDate;
    // const chronicleEditionData=  {chronicleEditorData , chronicleDate}
    console.log('chronicleEditionData data in models ==>>>', chronicleDate) 

    let sql = {
      text : `INSERT INTO vc_editor_table (date, editor_data) VALUES($1,$2)  RETURNING id `,
      values : [chronicleDate, chronicleEditorData]
    }
    console.log("sql insertVcEditorData ==>>>", sql);
    const result = await autoDbW.query(sql);
    // console.log('result ===>>>', result.rows)
    return result.rows
};

module.exports.insertResearchEditor = async(chronicleEditorData, chronicleDate) => {
    let sql = {
      text : `INSERT INTO research_editor_table (date, editor_data) VALUES($1, $2) RETURNING id `,
      values : [chronicleDate, chronicleEditorData]
    }
    console.log("sql insertResearchEditor ==>>>", sql);
    const result = await autoDbW.query(sql);
    // console.log('result ===>>>', result.rows)
    return result.rows
};

module.exports.insertMeetingEditor = async(chronicleEditorData, chronicleDate) => {
  console.log('chronicleDate ===>>>', chronicleDate)

    let sql = {
      text : `INSERT INTO meeting_editor_table (date, editor_data) VALUES($1, $2) RETURNING id `,
      values : [chronicleDate, chronicleEditorData]
    }
    console.log("sql insertMeetingEditor ==>>>", sql);
    const result = await autoDbW.query(sql);
    console.log('result ===>>>', result.rows)
    return result.rows
};

module.exports.insertBrandingeditor = async(chronicleEditorData, chronicleDate) => {
  console.log()

    let sql = {
      text : `INSERT INTO branding_editor_table (date, editor_data) VALUES($1, $2)  RETURNING id `,
      values : [chronicleDate, chronicleEditorData]
    }
    console.log("sql insertBrandingeditor ==>>>", sql);
    const result = await autoDbW.query(sql);
    return result.rows
};


// update vc content
module.exports.updateVcData = async (body) => {
  console.log("data in model ====>>>", body);
  const updatedChronicleEditorData = body.updatedChronicleEditorData;
  console.log('updatedChronicleEditorData in model ===>>', updatedChronicleEditorData);
  const updatedChronicleDate = body.updatedChronicleDate;
  console.log('updatedChronicleDate in model ===>>>', updatedChronicleDate);
  const chronicleId = body.chronicleId;
  console.log('chronicleId ====>>>', chronicleId);

  let sql = {
    text : `UPDATE vc_editor_table SET date = $2,  editor_data= $3, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
    values : [chronicleId, updatedChronicleDate, updatedChronicleEditorData]
}
  console.log('sql ====>>>', sql);
  return autoDbW.query(sql);

};

// update meeting content
module.exports.updateMeetingData = async (body) => {
  const updatedChronicleEditorData = body.updatedChronicleEditorData;
  const updatedChronicleDate = body.updatedChronicleDate;
  const chronicleId = body.chronicleId;
  let sql = {
    text : `UPDATE meeting_editor_table SET date = $2,  editor_data= $3, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
    values : [chronicleId, updatedChronicleDate, updatedChronicleEditorData]
}
  console.log('sql ====>>>', sql);
  return autoDbW.query(sql);
};

// upadate research content
module.exports.updateResearchData = async (body) => {
  const updatedChronicleEditorData = body.updatedChronicleEditorData;
  const updatedChronicleDate = body.updatedChronicleDate;
  const chronicleId = body.chronicleId;
  let sql = {
    text : `UPDATE research_editor_table SET date = $2,  editor_data= $3, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
    values : [chronicleId, updatedChronicleDate, updatedChronicleEditorData]
}
  console.log('sql ====>>>', sql);
  return autoDbW.query(sql);
};

// update branding content
module.exports.updateBrandingData = async (body) => {
  const updatedChronicleEditorData = body.updatedChronicleEditorData;
  const updatedChronicleDate = body.updatedChronicleDate;
  const chronicleId = body.chronicleId;
  let sql = {
    text : `UPDATE branding_editor_table SET date = $2,  editor_data= $3, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
    values : [chronicleId, updatedChronicleDate, updatedChronicleEditorData]
}
  console.log('sql ====>>>', sql);
  return autoDbW.query(sql);
};



module.exports.deleteVcEditorContent = async(body) => {
      const chronicleId = body.chronicleId;

      let sql = {
        text : `DELETE FROM vc_editor_table WHERE id = $1 `,
        values : [chronicleId]
    };
    console.log('sql ==>>'. sql)
    return autoDbR.query(sql);
};

module.exports.deleteMeetingEditorContent = async(body) => {
  const chronicleId = body.chronicleId;

  let sql = {
    text : `DELETE FROM meeting_editor_table WHERE id = $1 `,
    values : [chronicleId]
};
console.log('sql ==>>'. sql)
return autoDbR.query(sql);
};

module.exports.deleteResearchEditorContent = async(body) => {
  const chronicleId = body.chronicleId;

  let sql = {
    text : `DELETE FROM research_editor_table WHERE id = $1 `,
    values : [chronicleId]
};
console.log('sql ==>>'. sql)
return autoDbR.query(sql);
};

module.exports.deleteBrandingEditorContnent = async(body) => {
  const chronicleId = body.chronicleId;

  let sql = {
    text : `DELETE FROM branding_editor_table WHERE id = $1 `,
    values : [chronicleId]
};
console.log('sql ==>>'. sql)
return autoDbR.query(sql);
};
