const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

const insertDbModels = require('./insert-update-records.models');

module.exports.renderNmimsConsultancyApprovalForm = async (userName) => {
  let approvalFormSql = {
    text: `SELECT f.id AS faculty_id, f.faculty_name, f.designation, f.address, c.id AS consultancy_id,
                        c.year, c.title, c.commencement_date, c.created_by AS created_by, c.updated_by AS updated_by, c.completion_date, c.research_staff_expenses,
                        c.travel, c.computer_charges, c.nmims_facility_charges, c.miscellaneous_including_contingency,
                        c.advanced_payment, c.final_payment, c.per_session_fees, c.session_count_per_days, c.total_fees,
                        c.faculty_shares, c.nmims_shares, c.gross_fees , c.faculty_dsg, c.supporting_documents, c.grandTotal
                      FROM 
                          faculty_table f
                      JOIN 
                          consultancy_approval_form c ON f.id = c.faculty_table_id
                      WHERE created_by = $1 and f.active=true and c.active =true 
                      ORDER BY 
                          c.id desc`,
    values: [userName],
  };

  let facultySql = `SELECT id, faculty_name , designation FROM faculty_table where active=true ORDER BY id`;
  const fetchConsultancyRecord = await researchDbW.query(approvalFormSql);
  const facultyRecord = await researchDbW.query(facultySql);
  const promises = [fetchConsultancyRecord, facultyRecord];
  return Promise.all(promises)
    .then(([fetchConsultancyRecord, facultyRecord]) => {
      return {
        status: "Done",
        message: "Record Fetched Successfully",
        rowCount: fetchConsultancyRecord.rowCount,
        consultancyFormData: fetchConsultancyRecord.rows,
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

module.exports.viewConsultancyApprovalForm = async (
  nmimsConsultancyFormId,
  userName
) => {
  let sql = {
    text: `SELECT f.id AS faculty_id, f.faculty_name, f.designation, f.address, c.id AS consultancy_id,
                c.created_by AS created_by, c.updated_by AS updated_by,
                c.year, c.title, c.commencement_date, c.completion_date, c.research_staff_expenses,
                c.travel, c.computer_charges, c.nmims_facility_charges, c.miscellaneous_including_contingency,
                c.advanced_payment, c.final_payment, c.per_session_fees, c.session_count_per_days, c.total_fees,
                c.faculty_shares, c.nmims_shares, c.gross_fees , c.faculty_dsg, c.supporting_documents, c.grandTotal
            FROM 
                faculty_table f
            JOIN 
                consultancy_approval_form c ON f.id = c.faculty_table_id
            WHERE
                c.id = $1 AND c.created_by = $2 and f.active=true and c.active=true
            ORDER BY 
                c.id`,
    values: [nmimsConsultancyFormId, userName],
  };

  console.log("sql ===>>>>>", nmimsConsultancyFormId);
  const approvalFormSql = await researchDbW.query(sql);
  const promises = [approvalFormSql];
  return Promise.all(promises)
    .then(([approvalFormSql]) => {
      return {
        status: "Done",
        message: "Record Fetched Successfully",
        rowCount: approvalFormSql.rowCount,
        approvedFormData: approvalFormSql.rows,
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

module.exports.insertConsultancyApprovalFormData = async (
  consultancyFormData, consultancyFiles, userName) => {
  console.log("consultancyObject in models arun sir ==>>", consultancyFormData);
  const {year, title, commencementDate, completionDate, sessionNumbers, sessionsFees, facultyShare, nmimsShare,
    researchStaffExpenses, travlExpanses, computerCharges, faculityCharges, miscellaneousContingencyCharges, advancedPayment,
    finalPayment, totalFees, grossFees, facultyId, faculityDsg, grandTotal} = consultancyFormData;

  const consultancyApprovalValues = [year, title, commencementDate, completionDate, sessionNumbers, sessionsFees, facultyShare, nmimsShare,
    researchStaffExpenses, travlExpanses, computerCharges, faculityCharges, miscellaneousContingencyCharges, advancedPayment,
    finalPayment, totalFees, grossFees, facultyId, faculityDsg, grandTotal, consultancyFiles, userName];

  const consultancyApprovalFields = ['year', 'title', 'commencement_date', 'completion_date', 'session_count_per_days',  'per_session_fees',
    'faculty_shares', 'nmims_shares', 'research_staff_expenses', 'travel', 'computer_charges', 'nmims_facility_charges', 'miscellaneous_including_contingency', 'advanced_payment', 'final_payment', 'total_fees', 'gross_fees', 'faculty_table_id', 'faculty_dsg', 'grandTotal',  'supporting_documents', 'created_by'
   ]

  const insertConsultancyApprovalForm = await insertDbModels.insertRecordIntoMainDb('consultancy_approval_form', consultancyApprovalFields, consultancyApprovalValues, userName);
  console.log('insertConsultancyApprovalForm =====>>>>>>>', insertConsultancyApprovalForm);

  return insertConsultancyApprovalForm.status === "Done" ? {
    status : insertConsultancyApprovalForm.status,
    message : insertConsultancyApprovalForm.message
} : {
    status : insertConsultancyApprovalForm.status,
    message : insertConsultancyApprovalForm.message,
    errorCode : insertConsultancyApprovalForm.errorCode
}

  
};

module.exports.updateApprovalFormData = async (nmimsConsultancyFormId, updatedConsultancyApprovalRecord, consultancyFiles, userName
) => {
  const {year, title, commencementDate, completionDate, sessionNumbers, sessionsFees, facultyShare, nmimsShare,
    researchStaffExpenses, travlExpanses, computerCharges, faculityCharges, miscellaneousContingencyCharges, advancedPayment,
    finalPayment, totalFees, grossFees, facultyId, faculityDsg, grandTotal
  } = updatedConsultancyApprovalRecord;

  let updateConsultancyApprovalForm;

  if(consultancyFiles){
    
  const consultancyApprovalValues = [year, title, commencementDate, completionDate, sessionNumbers, sessionsFees, facultyShare, nmimsShare,
    researchStaffExpenses, travlExpanses, computerCharges, faculityCharges, miscellaneousContingencyCharges, advancedPayment,
    finalPayment, totalFees, grossFees, facultyId, faculityDsg, grandTotal, consultancyFiles, userName, nmimsConsultancyFormId];

  const consultancyApprovalFields = ['year', 'title', 'commencement_date', 'completion_date', 'session_count_per_days',  'per_session_fees',
    'faculty_shares', 'nmims_shares', 'research_staff_expenses', 'travel', 'computer_charges', 'nmims_facility_charges', 'miscellaneous_including_contingency', 'advanced_payment', 'final_payment', 'total_fees', 'gross_fees', 'faculty_table_id', 'faculty_dsg', 'grandTotal',  'supporting_documents', 'updated_by'
   ]

  updateConsultancyApprovalForm = await insertDbModels.updateFieldWithFiles('consultancy_approval_form', consultancyApprovalFields, consultancyApprovalValues, userName);


  } else{

    const consultancyApprovalValues = [year, title, commencementDate, completionDate, sessionNumbers, sessionsFees, facultyShare, nmimsShare,
      researchStaffExpenses, travlExpanses, computerCharges, faculityCharges, miscellaneousContingencyCharges, advancedPayment,
      finalPayment, totalFees, grossFees, facultyId, faculityDsg, grandTotal, userName, nmimsConsultancyFormId];
  
    const consultancyApprovalFields = ['year', 'title', 'commencement_date', 'completion_date', 'session_count_per_days',  'per_session_fees',
      'faculty_shares', 'nmims_shares', 'research_staff_expenses', 'travel', 'computer_charges', 'nmims_facility_charges', 'miscellaneous_including_contingency', 'advanced_payment', 'final_payment', 'total_fees', 'gross_fees', 'faculty_table_id', 'faculty_dsg', 'grandTotal', 'updated_by'
     ]
  
    updateConsultancyApprovalForm = await insertDbModels.updateFieldWithOutFiles('consultancy_approval_form', consultancyApprovalFields, consultancyApprovalValues, userName);

  }

  console.log('updateConsultancyApprovalForm ====>>>>>', updateConsultancyApprovalForm);

  return updateConsultancyApprovalForm.status === "Done" ? {
    status : updateConsultancyApprovalForm.status,
    message : updateConsultancyApprovalForm.message
  } : {
    status : updateConsultancyApprovalForm.status,
    message : updateConsultancyApprovalForm.message,
    errorCode : updateConsultancyApprovalForm.errorCode
  }

};

module.exports.deleteconsultancyApprovalformData = async (
  nmimsConsultancyFormId
) => {
  let sql = {
    // text: `DELETE FROM consultancy_approval_form WHERE id = $1`,
    text: `update consultancy_approval_form set active=false WHERE id = $1`,
    values: [nmimsConsultancyFormId],
  };

  console.log("sql ==>>>", nmimsConsultancyFormId);
  const deleteConsultancyform = await researchDbW.query(sql);
  const promises = [deleteConsultancyform];
  return Promise.all(promises)
    .then(([deleteConsultancyform]) => {
      return {
        status: "Done",
        message: "Record Deleted Successfully",
        rowCount: deleteConsultancyform.rowCount,
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
