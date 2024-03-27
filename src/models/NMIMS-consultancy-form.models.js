const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.renderNmimsConsultancyApprovalForm = async() => {
        let sql = `SELECT f.id AS faculty_id, f.faculty_name, f.designation, f.address, c.id AS consultancy_id,
                        c.year, c.title, c.commencement_date, c.completion_date, c.research_staff_expenses,
                        c.travel, c.computer_charges, c.nmims_facility_charges, c.miscellaneous_including_contingency,
                        c.advanced_payment, c.final_payment, c.total_payment, c.per_session_fees, c.days, c.sessions, c.total_fees,
                        c.faculty_shares, c.nmims_shares, c.gross_fees 
                    FROM 
                        faculty_table f
                    JOIN 
                        consultancy_approval_form c ON f.id = c.faculty_table_id
                    ORDER BY 
                        c.id`;
        const fetchRecord = await researchDbW.query(sql);
        const promises = [fetchRecord];
        return Promise.all(promises)
          .then(([fetchRecord]) => {
            return {
              status: "Done",
              message: "Record Fetched Successfully",
              rowCount: fetchRecord.rowCount,
              consultancyFormData : fetchRecord.rows

            };
          })
          .catch((error) => {
            return {
              status: "Failed",
              message: error.message,
              errorCode: error.code,
            };
          });
    //     try {
    //         const result = await researchDbR.query(sql);
    //         return result.rows;
    //     } catch (error) {
    //         throw new Error(`Error fetching IPR data: ${error.message}`);
    //     }
    // };
    
}