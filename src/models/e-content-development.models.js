
const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchEContentDevelopmentData = async(userName) => {
    let sql = {
        text : `SELECT * FROM e_content_development WHERE created_by = $1  ORDER BY id`,
        values : [userName]
    }
    console.log('sql ==>>', sql);
    return researchDbR.query(sql);
}


module.exports.insertEContentRecord = async(EcontentFormData, userName) => {
    console.log('EcontentData in models ===>>>>', EcontentFormData)

    const {facultyName, moduleName, platformName, launchingDate, documentLink, eContentList, MediaCenterLink} = EcontentFormData;

    let sql = {
        text : `INSERT INTO e_content_development(faculty_name, module_name, platform, launch_date, document_links, content_development_facilities, media_centre_video_link, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        values : [facultyName, moduleName, platformName, launchingDate, documentLink, eContentList, MediaCenterLink, userName]
    }

    console.log('sql ===>>>>', sql);

    const eContentDataPromis = await researchDbW.query(sql);
    const response = eContentDataPromis.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Inserted Successfully",
            eContentId : eContentDataPromis.rows[0].id,
            rowCount: eContentDataPromis.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record insertion.",
            errorCode: error?.code
        };
    
    return response;
}


module.exports.updateEcontentRow = async(updatedEContentData, eContentId, userName) => {

    const {facultyName, moduleName, platformName, launchingDate, documentLink, eContentList, MediaCenterLink} = updatedEContentData;

    let sql = {
        text : `UPDATE e_content_development SET faculty_name = $2, module_name = $3, platform = $4, launch_date = $5, document_links = $6, content_development_facilities = $7, media_centre_video_link = $8, updated_by = $9 WHERE id = $1`,
        values : [eContentId, facultyName, moduleName, platformName, launchingDate, documentLink, eContentList, MediaCenterLink, userName]
    }

    console.log('sql ===>>>>', sql);

    const eContentDataPromis = await researchDbW.query(sql);
    const response = eContentDataPromis.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Updated Successfully",
            rowCount: eContentDataPromis.rowCount
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record insertion.",
            errorCode: error?.code
        };
    
    return response;

}

module.exports.deleteEContentRowData = async(eContentId) => {

    let sql = {
        text : `DELETE FROM e_content_development WHERE id = $1`,
        values : [eContentId]
    }

    console.log('sql ===>>>>>', sql);
    const deletedRecord = await researchDbW.query(sql);
    const promises = [deletedRecord];
    return Promise.all(promises).then(([deletedRecord]) => {
        return  { status : "Done" , message : "Record Deleted Successfully", rowCount : deletedRecord.rowCount}
    })
    .catch((error) => {
        return{status : "Failed" , message : error.message , errorCode : error.code}
    })
}

module.exports.viewEContentDevelopmentData = async(eContentId, userName) => {
    console.log('eContentId ===>>>>', eContentId);

    let sql = {
        text : `SELECT faculty_name, module_name, platform, launch_date, document_links, content_development_facilities, media_centre_video_link FROM 
            e_content_development WHERE id = $1 AND created_by = $2`,
        values : [eContentId, userName]
    }
    console.log('sql ===>>>>>', sql);
    const viewRecord = await researchDbR.query(sql);
    const promises = [viewRecord];
    return Promise.all(promises).then(([viewRecord]) => {
        return  { status : "Done" , message : "Record Fetched Successfully", viewEcontentData : viewRecord.rows}
    })
    .catch((error) => {
        return{status : "Failed" , message : error.message , errorCode : error.code}
    })

}