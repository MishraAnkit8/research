const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

module.exports.renderNmimsConsultancyApprovalForm = async (userName) => {
  let approvalFormSql = {
    text: `SELECT f.id AS faculty_id, f.faculty_name, f.designation, f.address, c.id AS consultancy_id,
                        c.year, c.title, c.commencement_date, c.created_by AS created_by, c.updated_by AS updated_by, c.completion_date, c.research_staff_expenses,
                        c.travel, c.computer_charges, c.nmims_facility_charges, c.miscellaneous_including_contingency,
                        c.advanced_payment, c.final_payment, c.per_session_fees, c.session_count_per_days, c.total_fees,
                        c.faculty_shares, c.nmims_shares, c.gross_fees , c.faculty_dsg
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
                c.faculty_shares, c.nmims_shares, c.gross_fees , c.faculty_dsg
            FROM 
                faculty_table f
            JOIN 
                consultancy_approval_form c ON f.id = c.faculty_table_id
            WHERE
                c.id = $1 AND created_by = $2 and f.active=true and c.active=true
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
  consultancyFormData, consultancyFiles, userName
) => {
  console.log("consultancyObject in models arun sir ==>>", consultancyFormData);
  const {
    year,
    title,
    commencementDate,
    completionDate,
    sessionNumbers,
    sessionsFees,
    facultyShare,
    nmimsShare,
    researchStaffExpenses,
    travlExpanses,
    computerCharges,
    faculityCharges,
    miscellaneousContingencyCharges,
    advancedPayment,
    finalPayment,
    totalFees,
    grossFees,
    facultyId,
    faculityDsg
   
  } = consultancyFormData;
  let sql = {
    text: `INSERT INTO consultancy_approval_form (year, title, commencement_date, completion_date, session_count_per_days,  per_session_fees,
        faculty_shares, nmims_shares, research_staff_expenses, travel, computer_charges, nmims_facility_charges, miscellaneous_including_contingency, advanced_payment, final_payment, total_fees, gross_fees, faculty_table_id, faculty_dsg, supporting_documents, created_by
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING id`,

    values: [
      year,
      title,
      commencementDate,
      completionDate,
      sessionNumbers,
      sessionsFees,
      facultyShare,
      nmimsShare,
      researchStaffExpenses,
      travlExpanses,
      computerCharges,
      faculityCharges,
      miscellaneousContingencyCharges,
      advancedPayment,
      finalPayment,
      totalFees,
      grossFees,
      facultyId,
      faculityDsg,
      consultancyFiles,
      userName
      
    ],
  };

  console.log("sql ===>>>", sql);
  const insertFormData = await researchDbW.query(sql);
  const promises = [insertFormData];
  return Promise.all(promises)
    .then(([insertFormData]) => {
      return {
        status: "Done",
        message: "Record Inserted Successfully",
        nmimsConsultancyFormId: insertFormData.rows[0].id,
        rowCount: insertFormData.rowCount,
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

module.exports.updateApprovalFormData = async (nmimsConsultancyFormId,
  updatedConsultancyApprovalRecord, consultancyFiles, userName
) => {
  const {
    year,
    title,
    commencementDate,
    completionDate,
    sessionNumbers,
    sessionsFees,
    facultyShare,
    nmimsShare,
    researchStaffExpenses,
    travlExpanses,
    computerCharges,
    faculityCharges,
    miscellaneousContingencyCharges,
    advancedPayment,
    finalPayment,
    totalFees,
    grossFees,
    facultyId,
    faculityDsg
  } = updatedConsultancyApprovalRecord;

  let baseSql = 
    `UPDATE consultancy_approval_form  SET year = $2, title = $3, commencement_date = $4, completion_date = $5, session_count_per_days = $6,  per_session_fees = $7,
    faculty_shares = $8, nmims_shares = $9, research_staff_expenses = $10, travel = $11, computer_charges = $12, nmims_facility_charges = $13, miscellaneous_including_contingency = $14, advanced_payment = $15, final_payment = $16, total_fees = $17, gross_fees = $18, faculty_table_id = $19, faculty_dsg = $20, updated_by = $21`;
   

  let supportingDocumentsUpdate = consultancyFiles ? `, supporting_documents = $22` : '';

  let queryText = baseSql + supportingDocumentsUpdate + ` WHERE id = $1`;

 let  values = [
    nmimsConsultancyFormId,
    year,
    title,
    commencementDate,
    completionDate,
    sessionNumbers,
    sessionsFees,
    facultyShare,
    nmimsShare,
    researchStaffExpenses,
    travlExpanses,
    computerCharges,
    faculityCharges,
    miscellaneousContingencyCharges,
    advancedPayment,
    finalPayment,
    totalFees,
    grossFees,
    facultyId,
    faculityDsg,
    userName,
  ]

  let sql = {
    text: queryText,
    values: values
};
console.log('sql ====>>>>>>', sql);

  let facultySql = {
    text: `SELECT * FROM faculty_table  WHERE id = $1 and active=true`,
    values: [facultyId],
  };

  console.log("facultySql ===>>>>", facultySql);
  console.log("sql ===>>>", sql);
  const updatedApprovalFormData = await researchDbW.query(sql);
  const facultTableData = await researchDbW.query(facultySql);
  const promises = [updatedApprovalFormData, facultTableData];
  return Promise.all(promises)
    .then(([updatedApprovalFormData, facultTableData]) => {
      return {
        status: "Done",
        message: "Record updated Successfully",
        rowCount: updatedApprovalFormData.rowCount,
        facultTableData: facultTableData.rows,
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
