const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

const insertDbModels = require('./insert-update-records.models');

module.exports.renderSeedGrantNonFormacy = async (userName) => {
  let grantedSeedSql = {
    text: `SELECT f.id AS faculty_id, f.faculty_name, f.designation, f.address, c.id AS consultancy_id,
                    c.year, c.title, c.commencement_date, c.created_by AS created_by, c.commencement_date, c.completion_date, c.research_staff_expenses,
                    c.travel, c.computer_charges, c.nmims_facility_charges, c.miscellaneous_including_contingency,
                    c.advanced_payment, c.final_payment, c.per_session_fees, c.session_count_per_days, c.total_fees,
                    c.faculty_shares, c.nmims_shares, c.gross_fees ,
                    c.totalamount,c.grandtotal, c.faculty_dsg, c.supporting_documents
                FROM 
                    faculty_table f
                JOIN 
                    nmims_seed_grant_non_formacy c ON f.id = c.faculty_table_id
                WHERE
                    c.created_by = $1 and f.active=true and c.active=true 
                ORDER BY 
                    c.id desc`,
    values: [userName],
  };
  let facultySql = `SELECT id, faculty_name , designation FROM faculty_table ORDER BY id`;
  const fetchSeedGrantFormData = await researchDbR.query(grantedSeedSql);
  const facultyRecord = await researchDbR.query(facultySql);
  const promises = [fetchSeedGrantFormData, facultyRecord];
  return Promise.all(promises)
    .then(([fetchSeedGrantFormData, facultyRecord]) => {
      return {
        status: "Done",
        message: "Record Fetched Successfully",
        rowCount: fetchSeedGrantFormData.rowCount,
        seedGrantFormDataRows: fetchSeedGrantFormData.rows,
        facultyData: facultyRecord.rows,
      };
    })
    .catch((error) => {
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
};

module.exports.viewSeedGrantNonFormacy = async (grantedSeedId, userName) => {
  let sql = {
    text: `SELECT f.id AS faculty_id, f.faculty_name, f.designation, f.address, c.id AS consultancy_id,
                c.year, c.title, c.commencement_date, c.created_by AS created_by, c.updated_by AS updated_by, c.completion_date, c.research_staff_expenses,
                c.travel, c.computer_charges, c.nmims_facility_charges, c.miscellaneous_including_contingency,
                c.advanced_payment, c.final_payment, c.per_session_fees, c.session_count_per_days, c.total_fees,
                c.faculty_shares, c.nmims_shares, c.gross_fees,c.totalamount,c.grandtotal, c.faculty_dsg, c.supporting_documents
            FROM 
                faculty_table f
            JOIN 
                nmims_seed_grant_non_formacy c ON f.id = c.faculty_table_id
            WHERE
                c.id = $1 AND created_by = $2 and f.active=true and c.active=true 
            ORDER BY 
                c.id`,
    values: [grantedSeedId, userName],
  };

  console.log("sql ===>>>>>", grantedSeedId);
  const nonFormacyformData = await researchDbR.query(sql);
  const promises = [nonFormacyformData];
  return Promise.all(promises)
    .then(([nonFormacyformData]) => {
      return {
        status: "Done",
        message: "Record Fetched Successfully",
        rowCount: nonFormacyformData.rowCount,
        nonFormacyformData: nonFormacyformData.rows,
      };
    })
    .catch((error) => {
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
};

module.exports.insertSeedGrantNonformacyForm = async (seedGrantFormData, pharmacyFiles, userName) => {
  const {year, title, commencementDate, completionDate, sessionNumbers, sessionsFees, facultyShare, nmimsShare,
    researchStaffExpenses, travlExpanses, computerCharges, faculityCharges, miscellaneousContingencyCharges, advancedPayment,
    finalPayment, totalFees, grossFees, facultyId, totalAmount, grandTotal, facultyDsg} = seedGrantFormData;

  const seedGrantValues = [year, title, commencementDate, completionDate, sessionNumbers, sessionsFees, facultyShare, nmimsShare,
    researchStaffExpenses, travlExpanses, computerCharges, faculityCharges, miscellaneousContingencyCharges, advancedPayment,
    finalPayment, totalFees, grossFees, facultyId, totalAmount, grandTotal, facultyDsg, pharmacyFiles, userName];

  const seedGrantFields = ['year', 'title', 'commencement_date', 'completion_date', 'session_count_per_days',  'per_session_fees',
    'faculty_shares', 'nmims_shares', 'research_staff_expenses', 'travel', 'computer_charges', 'nmims_facility_charges', 'miscellaneous_including_contingency', 'advanced_payment', 'final_payment', 'total_fees', 'gross_fees', 'faculty_table_id',
    'totalamount','grandtotal','faculty_dsg', 'supporting_documents', 'created_by'];
  
  const insertSeedGrantForm = await insertDbModels.insertRecordIntoMainDb('nmims_seed_grant_non_formacy', seedGrantFields, seedGrantValues, userName);

  console.log('insertSeedGrantForm ===>>>>>>>', insertSeedGrantForm);
  return insertSeedGrantForm.status === "Done" ? {
    status : insertSeedGrantForm.status,
    message : insertSeedGrantForm.message
  } : {
    status : insertSeedGrantForm.status,
    message : insertSeedGrantForm.message,
    errorCode : insertSeedGrantForm.errorCode
  }
};

module.exports.updateSeedGrantNonformacyForm = async (grantedSeedId, updatedSeedGrantData, pharmacyFiles,userName
) => {
  const {year, title, commencementDate, completionDate, sessionNumbers, sessionsFees, facultyShare, nmimsShare,
    researchStaffExpenses, travlExpanses, computerCharges, faculityCharges, miscellaneousContingencyCharges, advancedPayment,
    finalPayment, totalFees, grossFees, facultyId, totalAmount, grandTotal, facultyDsg} = updatedSeedGrantData;

  let updateSeedGrantForm;

  if(pharmacyFiles){
    const seedGrantValues = [year, title, commencementDate, completionDate, sessionNumbers, sessionsFees, facultyShare, nmimsShare,
      researchStaffExpenses, travlExpanses, computerCharges, faculityCharges, miscellaneousContingencyCharges, advancedPayment,
      finalPayment, totalFees, grossFees, facultyId, totalAmount, grandTotal, facultyDsg, pharmacyFiles, userName, grantedSeedId];
  
  const seedGrantFields = ['year', 'title', 'commencement_date', 'completion_date', 'session_count_per_days',  'per_session_fees',
      'faculty_shares', 'nmims_shares', 'research_staff_expenses', 'travel', 'computer_charges', 'nmims_facility_charges', 'miscellaneous_including_contingency', 'advanced_payment', 'final_payment', 'total_fees', 'gross_fees', 'faculty_table_id',
      'totalamount','grandtotal','faculty_dsg', 'supporting_documents', 'created_by'];

  updateSeedGrantForm = await insertDbModels.updateFieldWithFiles('nmims_seed_grant_non_formacy', seedGrantFields, seedGrantValues, userName)
  } {
    const seedGrantValues = [year, title, commencementDate, completionDate, sessionNumbers, sessionsFees, facultyShare, nmimsShare,
      researchStaffExpenses, travlExpanses, computerCharges, faculityCharges, miscellaneousContingencyCharges, advancedPayment,
      finalPayment, totalFees, grossFees, facultyId, totalAmount, grandTotal, facultyDsg, userName, grantedSeedId];
  
  const seedGrantFields = ['year', 'title', 'commencement_date', 'completion_date', 'session_count_per_days',  'per_session_fees',
      'faculty_shares', 'nmims_shares', 'research_staff_expenses', 'travel', 'computer_charges', 'nmims_facility_charges', 'miscellaneous_including_contingency', 'advanced_payment', 'final_payment', 'total_fees', 'gross_fees', 'faculty_table_id',
      'totalamount','grandtotal','faculty_dsg', 'created_by'];

  updateSeedGrantForm = await insertDbModels.updateFieldWithOutFiles('nmims_seed_grant_non_formacy', seedGrantFields, seedGrantValues, userName)
  }

  console.log('updateSeedGrantForm ===>>>>', updateSeedGrantForm);
  return updateSeedGrantForm.status === "Done" ? {
    status : updateSeedGrantForm.status,
    message : updateSeedGrantForm.message
  } : {
    status : updateSeedGrantForm.status,
    message : updateSeedGrantForm.message,
    errorCode : updateSeedGrantForm.errorCode
  }

};

module.exports.deleteSeedGrantNonFormacyForm = async (grantedSeedId) => {
  let sql = {
    // text: `DELETE FROM nmims_seed_grant_non_formacy WHERE id = $1`,
    text: `update nmims_seed_grant_non_formacy set active=false WHERE id = $1`,
    values: [grantedSeedId],
  };

  console.log("sql ==>>>", grantedSeedId);
  const deletenonFormacyForm = await researchDbW.query(sql);
  const promises = [deletenonFormacyForm];
  return Promise.all(promises)
    .then(([deletenonFormacyForm]) => {
      return {
        status: "Done",
        message: "Record Deleted Successfully",
        rowCount: deletenonFormacyForm.rowCount,
      };
    })
    .catch((error) => {
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
};
