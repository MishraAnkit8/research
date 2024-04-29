const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.renderSeedGrantNonFormacy = async(userName) => {
        let grantedSeedSql = {
         text :  `SELECT f.id AS faculty_id, f.faculty_name, f.designation, f.address, c.id AS consultancy_id,
                    c.year, c.title, c.commencement_date, c.created_by AS created_by, c.commencement_date, c.completion_date, c.research_staff_expenses,
                    c.travel, c.computer_charges, c.nmims_facility_charges, c.miscellaneous_including_contingency,
                    c.advanced_payment, c.final_payment, c.per_session_fees, c.session_count_per_days, c.total_fees,
                    c.faculty_shares, c.nmims_shares, c.gross_fees 
                FROM 
                    faculty_table f
                JOIN 
                    nmims_seed_grant_non_formacy c ON f.id = c.faculty_table_id
                WHERE
                    created_by = $1
                ORDER BY 
                    c.id`,
          values : [userName]
        };
        let facultySql = `SELECT * FROM faculty_table ORDER BY id`;
        const fetchSeedGrantFormData = await researchDbW.query(grantedSeedSql);
        const facultyRecord = await researchDbW.query(facultySql);
        const promises = [fetchSeedGrantFormData, facultyRecord];
        return Promise.all(promises)
          .then(([fetchSeedGrantFormData, facultyRecord]) => {
            return {
              status: "Done",
              message: "Record Fetched Successfully",
              rowCount: fetchSeedGrantFormData.rowCount,
              seedGrantFormDataRows : fetchSeedGrantFormData.rows,
              facultyData : facultyRecord.rows

            };
          })
          .catch((error) => {
            return {
              status: "Failed",
              message: error.message,
              errorCode: error.code,
            };
          });
    
}



module.exports.viewSeedGrantNonFormacy = async(grantedSeedId, userName) => {

  let sql = {
    text: `SELECT f.id AS faculty_id, f.faculty_name, f.designation, f.address, c.id AS consultancy_id,
                c.year, c.title, c.commencement_date, c.created_by AS created_by, c.updated_by AS updated_by, c.completion_date, c.research_staff_expenses,
                c.travel, c.computer_charges, c.nmims_facility_charges, c.miscellaneous_including_contingency,
                c.advanced_payment, c.final_payment, c.per_session_fees, c.session_count_per_days, c.total_fees,
                c.faculty_shares, c.nmims_shares, c.gross_fees 
            FROM 
                faculty_table f
            JOIN 
                nmims_seed_grant_non_formacy c ON f.id = c.faculty_table_id
            WHERE
                c.id = $1 AND created_by = $2 
            ORDER BY 
                c.id`,
    values: [grantedSeedId, userName] 
};

  console.log('sql ===>>>>>', grantedSeedId);
  const nonFormacyformData = await researchDbW.query(sql)
  const promises = [nonFormacyformData];
  return Promise.all(promises).then(([nonFormacyformData]) => {
    return  { status : "Done" , message : "Record Fetched Successfully" ,  rowCount : nonFormacyformData.rowCount, nonFormacyformData : nonFormacyformData.rows}
})
.catch((error) => {
    return{status : "Failed" , message : error.message , errorCode : error.code}
})



}


module.exports.insertSeedGrantNonformacyForm = async(seedGrantFormData, userName) => {

  const {year, title, commencementDate, completionDate, sessionNumbers, sessionsFees, facultyShare, nmimsShare, researchStaffExpenses, 
    travlExpanses, computerCharges, faculityCharges, miscellaneousContingencyCharges, advancedPayment, finalPayment, totalFees,  grossFees, facultyId} = seedGrantFormData;
  let sql = {
    text : `INSERT INTO nmims_seed_grant_non_formacy (year, title, commencement_date, completion_date, session_count_per_days,  per_session_fees,
        faculty_shares, nmims_shares, research_staff_expenses, travel, computer_charges, nmims_facility_charges, miscellaneous_including_contingency, advanced_payment, final_payment, total_fees, gross_fees, faculty_table_id, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING id`,

    values : [year, title, commencementDate, completionDate, sessionNumbers, sessionsFees, facultyShare, nmimsShare, researchStaffExpenses, 
    travlExpanses, computerCharges, faculityCharges, miscellaneousContingencyCharges, advancedPayment, finalPayment, totalFees,  grossFees, facultyId, userName]
  }

  console.log('sql ===>>>', sql);
  const insertFormData = await researchDbW.query(sql);
  const promises = [insertFormData];
  return Promise.all(promises).then(([insertFormData]) => {
    return  { status : "Done" , message : "Record Inserted Successfully" , grantedSeedId : insertFormData.rows[0].id, rowCount : insertFormData.rowCount}
})
.catch((error) => {
    return{status : "Failed" , message : error.message , errorCode : error.code}
})
}


module.exports.updateSeedGrantNonformacyForm = async(grantedSeedId, updatedSeedGrantData, userName) => {

  const {year, title, commencementDate, completionDate, sessionNumbers, sessionsFees, facultyShare, nmimsShare, researchStaffExpenses, 
    travlExpanses, computerCharges, faculityCharges, miscellaneousContingencyCharges, advancedPayment, finalPayment, totalFees,  grossFees, facultyId} = updatedSeedGrantData;

  let sql = {
    text : `UPDATE nmims_seed_grant_non_formacy  SET year = $2, title = $3, commencement_date = $4, completion_date = $5, session_count_per_days = $6,  per_session_fees = $7,
    faculty_shares = $8, nmims_shares = $9, research_staff_expenses = $10, travel = $11, computer_charges = $12, nmims_facility_charges = $13, miscellaneous_including_contingency = $14, advanced_payment = $15, final_payment = $16, total_fees = $17, gross_fees = $18, faculty_table_id = $19, updated_by = $20 WHERE id = $1`,
    values : [grantedSeedId, year, title, commencementDate, completionDate, sessionNumbers, sessionsFees, facultyShare, nmimsShare, researchStaffExpenses, 
      travlExpanses, computerCharges, faculityCharges, miscellaneousContingencyCharges, advancedPayment, finalPayment, totalFees,  grossFees, facultyId, userName]
  }

  let facultySql  ={
  text : `SELECT * FROM faculty_table  WHERE id = $1`,
  values : [facultyId]
  }

  console.log('facultySql ===>>>>', facultySql)
  console.log('sql ===>>>', sql);
  const updatedGrantedSeedData = await researchDbW.query(sql);
  const facultTableData = await researchDbW.query(facultySql)
  const promises = [updatedGrantedSeedData, facultTableData];
  return Promise.all(promises).then(([updatedGrantedSeedData, facultTableData]) => {
    return  { status : "Done" , message : "Record updated Successfully" ,  rowCount : updatedGrantedSeedData.rowCount, facultTableData : facultTableData.rows}
})
.catch((error) => {
    return{status : "Failed" , message : error.message , errorCode : error.code}
})

}


module.exports.deleteSeedGrantNonFormacyForm = async(grantedSeedId) => {
  let sql = {
    text: `DELETE FROM nmims_seed_grant_non_formacy WHERE id = $1`,
    values: [grantedSeedId],
  };

  console.log('sql ==>>>', grantedSeedId);
  const deletenonFormacyForm = await researchDbW.query(sql);
  const promises = [deletenonFormacyForm];
  return Promise.all(promises).then(([deletenonFormacyForm]) => {
    return  { status : "Done" , message : "Record Deleted Successfully" ,  rowCount : deletenonFormacyForm.rowCount}
})
.catch((error) => {
    return{status : "Failed" , message : error.message , errorCode : error.code}
})
}