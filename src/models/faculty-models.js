const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

module.exports.insertFacultyDetails = async (exetrnalFacultyDetails) => {
  console.log("exetrnalFacultyDetails ====>>>>>", exetrnalFacultyDetails);
  const { facultyEmpId, facultyName, facultyDsg, facultyAddr } =
    exetrnalFacultyDetails;

  let sql = {
    text: `INSERT INTO faculties (faculty_type_id, employee_id, faculty_name, designation, address) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    values: [2, facultyEmpId, facultyName, facultyDsg, facultyAddr],
  };

  console.log("sql ====>>>>>", sql);
  const insertFacultyDetails = await researchDbW.query(sql);
  const promises = [insertFacultyDetails];
  return Promise.all(promises)
    .then(([insertFacultyDetails]) => {
      return {
        status: "Done",
        message: "Faculty Record  Inserted Successfully",
        rowCount: insertFacultyDetails.rowCount,
        externalFacultyId: insertFacultyDetails.rows[0].id,
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

module.exports.upsertFacultyDetails = async (
  externalFacultyDetails,
  consultantId
) => {
  const { facultyName, facultyDesignation, facultyAddr, facultyEmp, grantId } =
    externalFacultyDetails;
  console.log(
    "externalFacultyDetails in faculty models ",
    externalFacultyDetails
  );

  let facultysql = {
    text: `INSERT INTO faculties (faculty_type_id, employee_id, faculty_name, designation, address) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    values: [2, facultyEmp, facultyName, facultyDesignation, facultyAddr],
  };

  const facultyPromise = await researchDbW.query(facultysql);
  const facultyId = facultyPromise.rows[0].id;
  console.log("facultyId =====>>>>>>>", facultyId);

  let sql = {
    text: `INSERT INTO research_project_grant_faculty (research_project_grant_id, faculty_id) VALUES ($1, $2) returning id`,
    values: [consultantId, facultyId],
  };

  const researchgrant = await researchDbW.query(sql);

  const promises = [researchgrant];

  return Promise.all(promises)
    .then(([researchgrant]) => {
      return {
        status: "Done",
        message: "Faculty Record Inserted Successfully",
        externalFacultyId: facultyId,
        researchGrantId: researchgrant.rows[0].id,
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

module.exports.updateFaculyDetails = async (externalFacultyDetails) => {
  console.log("external faculty data ", JSON.stringify(externalFacultyDetails));

  const { facultyName, facultyDesignation, facultyAddr, empId, facultyId } =
    externalFacultyDetails;

  let sql = {
    text: `update faculties set employee_id=$1, faculty_name=$2, designation=$3, address=$4  where id=$5`,
    values: [empId, facultyName, facultyDesignation, facultyAddr, facultyId],
  };

  console.log("sql ====>>>>>", sql);
  const insertFacultyDetails = await researchDbW.query(sql);
  const promises = [insertFacultyDetails];
  return Promise.all(promises)
    .then(([insertFacultyDetails]) => {
      return {
        status: "Done",
        message: "Faculty Record Updated Successfully",
        rowCount: insertFacultyDetails.rowCount,
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

// module.exports.insertGrantFaculty = async (grantId) => {

//     let facultysql = {
//         text: `INSERT INTO faculties (faculty_type_id, employee_id, faculty_name, designation, address) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
//         values: [2, facultyEmp, facultyName, facultyDesignation, facultyAddr],
//       };
//     const facultyPromise = await researchDbW.query(facultysql);
//     const facultyId = facultyPromise.rows.id;
//     if(facultyId) {
//          let sql = {
//            text: `INSERT INTO research_project_grant_faculty (research_project_grant_id,faculty_id) VALUES ($1, $2)`,
//            values: [grantId, facultyId],
//          };
//     }

//   const insertFacultyDetails = await researchDbW.query(sql);
//   const promises = [insertFacultyDetails];
//   return Promise.all(promises)
//     .then(([insertFacultyDetails]) => {
//       return {
//         status: "Done",
//         message: "Faculty Record Inserted Successfully",
//         rowCount: insertFacultyDetails.rowCount,
//       };
//     })
//     .catch((error) => {
//       return {
//         status: "Failed",
//         message: error.message,
//         errorCode: error.code,
//       };
//     });
// };
