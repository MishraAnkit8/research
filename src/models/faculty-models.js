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
  const { facultyName, facultyDsg, facultyAddr, facultyEmpId, grantId } =
    externalFacultyDetails;
  console.log(
    "externalFacultyDetails in faculty models ",
    JSON.stringify(externalFacultyDetails),
    facultyName,
    facultyDsg,
    facultyAddr,
    facultyEmpId
  );

  let facultysql = {
    text: `INSERT INTO faculties (faculty_type_id, employee_id, faculty_name, designation, address) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    values: [2, facultyEmpId, facultyName, facultyDsg, facultyAddr],
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

  console.log("json faculty ", JSON.stringify(externalFacultyDetails));

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

module.exports.fetchFaculty = async () => {
  let sql = {
    text: `select r.research_project_grant_id,f.id,f.faculty_name,f.designation,f.employee_id,f.address from research_project_grant_faculty r inner join faculties f on r.faculty_id = f.id
    where 
    r.active=true and f.active=true and f.faculty_type_id = 2 order by f.id`,
  };

  const facultyDetails = await researchDbW.query(sql);
  const promises = [facultyDetails];
  return Promise.all(promises)
    .then(([facultyDetails]) => {
      return {
        status: "Done",
        message: "Faculty Record Updated Successfully",
        rowCount: facultyDetails.rowCount,
        facultyData: facultyDetails.rows,
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

module.exports.facultyDataForPatent = async () => {
  let sql = {
    text: `	select p.patent_submission_grant_id,f.id,f.faculty_name,f.designation,f.employee_id,f.address from patent_submission_faculty p 
	inner join faculties f on p.faculty_id = f.id where  p.active=true and f.active=true and f.faculty_type_id = 2 order by f.id`,
  };

  const facultyDetails = await researchDbW.query(sql);
  const promises = [facultyDetails];
  return Promise.all(promises)
    .then(([facultyDetails]) => {
      return {
        status: "Done",
        message: "Faculty Record Updated Successfully",
        rowCount: facultyDetails.rowCount,
        facultyData: facultyDetails.rows,
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

module.exports.fetchFacultyConference = async () => {
  let sql = {
    text: `select 
    cf.id,
    f.id,
    f.faculty_name,
    f.designation,
    f.employee_id,
    f.address 
from 
    conference_faculty cf 
left join 
    faculties f on cf.faculty_id = f.id 
where  
    cf.active = true 
    and f.active = true 
    and f.faculty_type_id = 2 
order by 
    f.id;`,
  };

  const facultyDetails = await researchDbW.query(sql);
  const promises = [facultyDetails];
  return Promise.all(promises)
    .then(([facultyDetails]) => {
      return {
        status: "Done",
        message: "Faculty Record Updated Successfully",
        rowCount: facultyDetails.rowCount,
        facultyData: facultyDetails.rows,
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

module.exports.insertFacultyPatent = async (
  externalFacultyDetails,
  patentId
) => {
  const { facultyName, facultyDsg, facultyAddr, facultyEmpId, grantId } =
    externalFacultyDetails;
  console.log(
    "externalFacultyDetails in faculty models ",
    JSON.stringify(externalFacultyDetails),
    facultyName,
    facultyDsg,
    facultyAddr,
    facultyEmpId
  );

  let facultysql = {
    text: `INSERT INTO faculties (faculty_type_id, employee_id, faculty_name, designation, address) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    values: [2, facultyEmpId, facultyName, facultyDsg, facultyAddr],
  };

  const facultyPromise = await researchDbW.query(facultysql);
  const facultyId = facultyPromise.rows[0].id;
  console.log("facultyId =====>>>>>>>", facultyId);

  let sql = {
    text: `INSERT INTO patent_submission_faculty (patent_submission_grant_id, faculty_id) VALUES ($1, $2) returning id`,
    values: [patentId, facultyId],
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
