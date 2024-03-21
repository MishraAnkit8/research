const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchResearchAward = async() => {
    let sql = {
        text : `SELECT * FROM research_award ORDER BY id`
    }
    console.log('sql ===>>>>>', sql);
    
    return researchDbW.query(sql);
}
