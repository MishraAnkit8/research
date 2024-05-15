const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

module.exports.fetchResearchConsultancy = async (userName) => {
  let researchProjectSql = {
    text: `SELECT * FROM research_project_grant where active=true ORDER BY id`,
  };

  console.log("researchProjectSql ====>>>>", researchProjectSql);

  let reseachSql = {
    // text: `SELECT
    //     r.id AS project_id,
    //     r.title_of_project,
    //     r.grant_proposal_category,
    //     r.type_of_research_grant,
    //     r.thrust_area_of_research,
    //     r.name_of_funding_agency,
    //     r.funding_amount,
    //     r.status_of_research_project,
    //     r.submission_date,
    //     r.created_by AS created_by,
    //     r.updated_by AS updated_by,
    //     r.supporting_documents,
    //     r.projectDuration,
    //     r.scheme,
    //     r.amountRecieved,
    //     r.paymentDate,
    //     f.id AS faculty_id,
    //     f.employee_id,
    //     f.faculty_name,
    //     f.designation,
    //     f.address,
    //     ft.name AS faculty_type,
    //     string_agg(DISTINCT ns.school_name, ', ') AS associated_schools,
    //     string_agg(DISTINCT ns.id::text, ', ') AS school_id,
    //     string_agg(DISTINCT nc.campus_name, ', ') AS associated_campuses,
    //     string_agg(DISTINCT nc.id::text, ', ') AS campus_id
    // FROM
    //     research_project_grant AS r
    // INNER JOIN
    //     research_project_grant_faculty AS rf ON r.id = rf.research_project_grant_id
    // LEFT JOIN
    //     faculties AS f ON rf.faculty_id = f.id
    // LEFT JOIN
    //     faculty_types AS ft ON f.faculty_type_id = ft.id
    // LEFT JOIN
    //     research_project_grant_school rs on  rs.research_project_grant_id = r.id
    // LEFT JOIN
    //     nmims_school ns on rs.school_id = ns.id
    // LEFT JOIN
    //      research_project_grant_campus rc on  rc.research_project_grant_id = r.id
    // LEFT JOIN
    //     nmims_campus nc on rc.campus_id = nc.id
    // WHERE
    //    created_by = $1 and r.active=true and rf.active=true and f.active=true and ft.active=true
    //    and rs.active=true and ns.active=true and rc.active=true and nc.active=true
    // GROUP BY
    //     r.id ,
    //     r.title_of_project,
    //     r.grant_proposal_category,
    //     r.type_of_research_grant,
    //     r.thrust_area_of_research,
    //     r.name_of_funding_agency,
    //     r.funding_amount,
    //     r.status_of_research_project,
    //     r.submission_date,
    //     r.created_by ,
    //     r.updated_by ,
    //     r.supporting_documents,
    //     r.projectDuration,
    //     r.scheme,
    //     r.amountRecieved,
    //     r.paymentDate,
    //     f.id AS faculty_id,
    //     f.employee_id,
    //     f.faculty_name,
    //     f.designation,
    //     f.address,
    //     ft.name
    // ORDER BY  r.id desc
    //     `,
    text: `SELECT 
        r.id AS project_id,
        r.title_of_project,
        r.grant_proposal_category,
        r.type_of_research_grant,
        r.thrust_area_of_research,
        r.name_of_funding_agency,
        r.funding_amount,
        r.status_of_research_project,
        r.submission_date,
        r.created_by AS created_by,
        r.updated_by AS updated_by,
        r.supporting_documents,
        r.projectDuration,
        r.scheme,
        r.amountRecieved,
        r.paymentDate,
        f.id AS faculty_id,
        f.employee_id,
        f.faculty_name,
        f.designation,
        f.address,
        ft.name AS faculty_type,
        string_agg(DISTINCT ns.school_name, ', ') AS associated_schools,
        string_agg(DISTINCT ns.id::text, ', ') AS school_id,
        string_agg(DISTINCT nc.campus_name, ', ') AS associated_campuses,
        string_agg(DISTINCT nc.id::text, ', ') AS campus_id
    FROM 
        research_project_grant AS r
    INNER JOIN 
        research_project_grant_faculty AS rf ON r.id = rf.research_project_grant_id
    LEFT JOIN 
        faculties AS f ON rf.faculty_id = f.id
    LEFT JOIN 
        faculty_types AS ft ON f.faculty_type_id = ft.id
    LEFT JOIN 
        research_project_grant_school rs on  rs.research_project_grant_id = r.id
    LEFT JOIN 
        nmims_school ns on rs.school_id = ns.id
    LEFT JOIN
         research_project_grant_campus rc on  rc.research_project_grant_id = r.id
    LEFT JOIN 
        nmims_campus nc on rc.campus_id = nc.id             
    WHERE
       created_by = $1 and r.active=true and rf.active=true and f.active=true and ft.active=true 
       and rs.active=true and ns.active=true and rc.active=true and nc.active=true 
    GROUP BY
        r.id ,
        r.title_of_project,
        r.grant_proposal_category,
        r.type_of_research_grant,
        r.thrust_area_of_research,
        r.name_of_funding_agency,
        r.funding_amount,
        r.status_of_research_project,
        r.submission_date,
        r.created_by ,
        r.updated_by ,
        r.supporting_documents,
        r.projectDuration,
        r.scheme,
        r.amountRecieved,
        r.paymentDate,
        f.id,
        f.employee_id,
        f.faculty_name,
        f.designation,
        f.address,
        ft.name   
    ORDER BY  r.id desc
`,
    values: [userName],
  };

  let internalFacultySql = {
    text: `select *  FROM faculties WHERE faculty_type_id = 1 and active=true`,
  };

  let researchGrantInternalsql = {
    text: `SELECT rpgf.id AS research_project_grant_faculty_id, 
        rpgf.research_project_grant_id, 
        rpgf.faculty_id 
        FROM research_project_grant_faculty rpgf
        JOIN faculties f ON rpgf.faculty_id = f.id
        JOIN faculty_types ft ON f.faculty_type_id = ft.id
        WHERE ft.name = 'Internal' and rpgf.active=true and f.active=true and ft.active=true 
        ORDER BY rpgf.id`,
  };

  let researchGrantExternalsql = {
    text: `SELECT rpgf.id AS research_project_grant_faculty_id, 
        rpgf.research_project_grant_id, 
        rpgf.faculty_id 
        FROM research_project_grant_faculty rpgf
        JOIN faculties f ON rpgf.faculty_id = f.id
        JOIN faculty_types ft ON f.faculty_type_id = ft.id
        WHERE ft.name = 'External' and rpgf.active=true and f.active=true and ft.active=true 
        ORDER BY rpgf.id`,
  };

  let researchGrantsql = {
    text: `select id, research_project_grant_id, faculty_id from research_project_grant_faculty where active=true order by id`,
  };

  let grantSql = {
    text: `select r.research_project_grant_id,f.id,f.faculty_name,f.designation,f.employee_id,f.address from research_project_grant_faculty r inner join faculties f on r.faculty_id = f.id
            where 
            r.active=true and f.active=true and f.faculty_type_id = 2`,
  };

  let nmimsSchoolSql = {
    text: `select *  FROM nmims_school where active=true  ORDER BY id`,
  };

  let nmimsCampusSql = {
    text: `select *  FROM nmims_campus where active=true   ORDER BY id`,
  };

  console.log("grantSql ===>>>>", grantSql);

  console.log("researchGrantsql ====>>>>>", researchGrantsql);

  const researchPojectGrantFacultyData = await researchDbR.query(reseachSql);
  const reseachGrantIdsContainer = await researchDbR.query(researchGrantsql);
  const researchData = await researchDbR.query(researchProjectSql);
  const researchInternalIds = await researchDbR.query(researchGrantInternalsql);
  const researchGrantExternalIds = await researchDbR.query(
    researchGrantExternalsql
  );
  const facultTableData = await researchDbR.query(internalFacultySql);
  const externalDataDetails = await researchDbR.query(grantSql);
  const nmimsSchoolList = await researchDbR.query(nmimsSchoolSql);
  const nmimsCampusList = await researchDbR.query(nmimsCampusSql);

  const promises = [
    researchData,
    researchPojectGrantFacultyData,
    facultTableData,
    reseachGrantIdsContainer,
    researchInternalIds,
    researchGrantExternalIds,
    externalDataDetails,
    nmimsSchoolList,
    nmimsCampusList,
  ];
  return Promise.all(promises)
    .then(([researchData]) => {
      return {
        status: "Done",
        message: "Record Fetched Successfully",
        rowCount: researchData.rowCount,
        researchData: researchData.rows,
        facultTableData: facultTableData.rows,
        researchPojectGrantFacultyData: researchPojectGrantFacultyData.rows,
        reseachGrantIdsContainer: reseachGrantIdsContainer.rows,
        researchInternalIds: researchInternalIds.rows,
        researchGrantExternalIds: researchGrantExternalIds.rows,
        externalDataDetails: externalDataDetails.rows,
        nmimsSchoolList: nmimsSchoolList.rows,
        nmimsCampusList: nmimsCampusList.rows,
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

module.exports.fetchInternal = async () => {
  let internalFacultySql = {
    text: `SELECT rpgf.id AS research_project_grant_faculty_id, 
    rpgf.research_project_grant_id, 
    rpgf.faculty_id 
    FROM research_project_grant_faculty rpgf
    JOIN faculties f ON rpgf.faculty_id = f.id
    JOIN faculty_types ft ON f.faculty_type_id = ft.id
    WHERE ft.name = 'Internal' and rpgf.active=true and f.active=true and ft.active=true 
    ORDER BY rpgf.id`,
  };

  const internalFaculty = await researchDbR.query(internalFacultySql);

  const promises = [internalFaculty];
  return Promise.all(promises)
    .then(([researchData]) => {
      return {
        status: "Done",
        message: "Record Fetched Successfully",
        rowCount: researchData.rowCount,
        internalFaculty: internalFaculty.rows,
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

module.exports.insertResearhcProjectConstancyData = async (
  schoolIdsArray,
  campusIdsArray,
  researchCunsultancyData,
  consultancyDataFiles,
  FacultydataArray,
  userName
) => {
  console.log(
    "researchCunsultancyData inside models ===>>>",
    researchCunsultancyData
  );

  const {
    grantProposalCategory,
    typeOfGrant,
    titleOfProject,
    thurstAreaOfResearch,
    fundingAgency,
    fundingAmount,
    statusOfResearchProject,
    submissionGrantDate,
    scheme,
    durationDate,
    amountReceived,
    annualPaymentDate,
  } = researchCunsultancyData;

  let researchSql = {
    text: `INSERT INTO research_project_grant (grant_proposal_category, type_of_research_grant, title_of_project, thrust_area_of_research, name_of_funding_agency, funding_amount, status_of_research_project, submission_date, supporting_documents, created_by,scheme,projectDuration,amountRecieved,paymentDate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id`,
    values: [
      grantProposalCategory,
      typeOfGrant,
      titleOfProject,
      thurstAreaOfResearch,
      fundingAgency,
      fundingAmount,
      statusOfResearchProject,
      submissionGrantDate,
      consultancyDataFiles,
      userName,
      scheme,
      durationDate,
      amountReceived,
      annualPaymentDate,
    ],
  };

  let promises = [];

  const researchProjectTable = await researchDbW.query(researchSql);
  const consultantId = researchProjectTable.rows[0].id;

  const insertFacultyPromises = FacultydataArray.map((faculty_id) => {
    // return researchProjectTable.then((result) => {
    const researchGrantFacultySql = {
      text: `INSERT INTO research_project_grant_faculty (research_project_grant_id, faculty_id) VALUES ($1, $2) RETURNING id`,
      values: [consultantId, faculty_id],
    };

    console.log("researchGrantFacultySql ===>>>>>", researchGrantFacultySql);
    return researchDbW.query(researchGrantFacultySql);
    // });
  });

  promises.push(researchProjectTable);

  const insertGrantSchool = schoolIdsArray.map((element) => {
    const grantSchoolSql = {
      text: `INSERT INTO research_project_grant_school (research_project_grant_id, school_id) VALUES ($1, $2) RETURNING id`,
      values: [consultantId, element],
    };

    // console.log('journalSchoolSql ===>>>>>>', journalSchoolSql);
    return researchDbW.query(grantSchoolSql);
  });

  const insertGrantCampus = campusIdsArray.map((element) => {
    const grantCampusSql = {
      text: `INSERT INTO research_project_grant_campus (research_project_grant_id, campus_id) VALUES ($1, $2) RETURNING id`,
      values: [consultantId, element],
    };
    // console.log('journalCampusSql ===>>>>>>', journalCampusSql);
    return researchDbW.query(grantCampusSql);
  });

  return Promise.all([
    researchProjectTable,
    ...insertFacultyPromises,
    ...insertGrantSchool,
    ...insertGrantCampus,
  ])
    .then(([researchData, ...results]) => {
      const consultantId = researchData.rows[0].id;
      const rowCount = researchData.rowCount;
      const insertFacultyIds = results
        .slice(0, FacultydataArray.length)
        .map((result) => result.rows[0].id);

      return {
        status: "Done",
        message: "Record Inserted Successfully",
        consultantId: consultantId,
        researchGrantFacultyIds: insertFacultyIds,
        rowCount: rowCount,
      };
    })
    .catch((error) => {
      console.log("error ====>>>>", error);
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
};

module.exports.updateResearchConsultantData = async (
  consultantId,
  updatedResearchGrant,
  updatedConsultantFilesData,
  FacultydataArray,
  userName,
  updateSchoolIdsArray,
  updateCampusIdsArray
) => {
  console.log("data in models ===>>>>", updatedResearchGrant);
  const supportingDocuments = updatedConsultantFilesData
    ? updatedConsultantFilesData
    : null;
  console.log("supportingDocuments ====>>>>", supportingDocuments);

  const {
    grantProposalCategory,
    typeOfGrant,
    titleOfProject,
    thurstAreaOfResearch,
    fundingAgency,
    fundingAmount,
    statusOfResearchProject,
    submissionGrantDate,
    durationDate,
    scheme,
    paymentDate,
    amountRecieved,
  } = updatedResearchGrant;

  let baseQuery = `UPDATE research_project_grant SET  grant_proposal_category = $2, type_of_research_grant = $3, title_of_project = $4, thrust_area_of_research = $5, name_of_funding_agency = $6, funding_amount = $7, status_of_research_project = $8, submission_date = $9,
  projectDuration=$10, scheme=$11, paymentDate=$12, amountRecieved=$13, updated_by = $14`;
  let documentsQuery = supportingDocuments
    ? `, supporting_documents = $15`
    : "";
  console.log("documentsQuery ====>>>>", documentsQuery);
  let queryText = baseQuery + documentsQuery + ` WHERE id = $1`;
  console.log("queryText ===>>>>", queryText);

  let values = [
    consultantId,
    grantProposalCategory,
    typeOfGrant,
    titleOfProject,
    thurstAreaOfResearch,
    fundingAgency,
    fundingAmount,
    statusOfResearchProject,
    submissionGrantDate,
    durationDate,
    scheme,
    paymentDate,
    amountRecieved,
    userName,
    ...(supportingDocuments ? [supportingDocuments] : []),
  ];

  console.log("values ===>>>>", values);

  let sql = {
    text: queryText,
    values: values,
  };
  console.log("sql ====>>>>>>>", sql);

  let promises = [];

  // Iterate over each name and execute INSERT query
  const insertFacultyPromises = FacultydataArray.map(async (faculty_id) => {
    const existingRecord = await researchDbW.query({
      text: `SELECT id FROM research_project_grant_faculty WHERE research_project_grant_id = $1 and active=true AND faculty_id = $2`,
      values: [consultantId, faculty_id],
    });

    return existingRecord.rows.length === 0
      ? researchDbW.query({
          text: `INSERT INTO research_project_grant_faculty (research_project_grant_id, faculty_id) VALUES ($1, $2) RETURNING id`,
          values: [consultantId, faculty_id],
        })
      : Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] });
  });

  const insertGrantSchool = updateSchoolIdsArray
    ? updateSchoolIdsArray.map(async (schoolId) => {
        const existingRecord = await researchDbW.query({
          text: `SELECT id FROM research_project_grant_school WHERE research_project_grant_id = $1 AND school_id = $2 and active = true`,
          values: [consultantId, schoolId],
        });

        return existingRecord.rows.length === 0
          ? researchDbW.query({
              text: `INSERT INTO research_project_grant_school (research_project_grant_id, school_id) VALUES ($1, $2) RETURNING id`,
              values: [consultantId, schoolId],
            })
          : Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] });
      })
    : [];

  const insertGrantCampus = updateCampusIdsArray
    ? updateCampusIdsArray.map(async (campusId) => {
        const existingRecord = await researchDbW.query({
          text: `SELECT id FROM research_project_grant_campus WHERE research_project_grant_id = $1 AND campus_id = $2 and active = true`,
          values: [consultantId, campusId],
        });

        return existingRecord.rows.length === 0
          ? researchDbW.query({
              text: `INSERT INTO research_project_grant_campus (research_project_grant_id, campus_id) VALUES ($1, $2) RETURNING id`,
              values: [consultantId, campusId],
            })
          : Promise.resolve({ rows: [{ id: existingRecord.rows[0].id }] });
      })
    : [];

  const researchProjectTable = await researchDbW.query(sql);
  const results = await Promise.all([
    researchProjectTable,
    ...insertFacultyPromises,
    ...insertGrantSchool,
    ...insertGrantCampus,
  ]);

  const rowCount = researchProjectTable.rowCount;
  const insertFacultyIds = results
    .slice(1, 1 + FacultydataArray.length)
    .map((result) => result.rows[0].id);

  return {
    status: "Done",
    message: "Record Updated Successfully",
    consultantId: consultantId,
    researchGrantsIds: insertFacultyIds,
    rowCount: rowCount,
  };
};

module.exports.deleteResearchConsultantData = async (consultantId) => {
  console.log("id in model ==>>", consultantId);

  const deleteFacultyAssignments = researchDbW.query({
    // text: 'DELETE FROM research_project_grant_faculty WHERE research_project_grant_id = $1',
    text: "update research_project_grant_faculty set active=false WHERE research_project_grant_id = $1",
    values: [consultantId],
  });

  const deleteResearchGrant = deleteFacultyAssignments
    .then(() =>
      researchDbW.query({
        // text: 'DELETE FROM research_project_grant WHERE id = $1',
        text: "update research_project_grant set active=false WHERE id = $1",
        values: [consultantId],
      })
    )
    .catch((error) => {
      throw error;
    });

  return Promise.all([deleteFacultyAssignments, deleteResearchGrant])
    .then(([deleteResearchGrantFaculty, deleteResearchGrant]) => {
      return {
        status: "Done",
        message: "Record Deleted Successfully",
        rowCount: deleteResearchGrant.rowCount,
        grantFacultyRowCount: deleteResearchGrantFaculty.rowCount,
      };
    })
    .catch((error) => {
      console.error("Error:", error.message);
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
};

module.exports.viewResearchConsultancy = async (consultantId, userName) => {
  console.log("consultantId in models ==>>", consultantId);
  let sql = {
    text: `SELECT
            rg.*,
            f.faculty_name,
            f.designation,
            f.address,
            f.employee_id
        FROM
            research_project_grant rg
        LEFT JOIN
            research_project_grant_faculty rgf ON rg.id = rgf.research_project_grant_id
        LEFT JOIN
            faculties f ON rgf.faculty_id = f.id 
        WHERE
            rg.id = $1 AND created_by = $2 and rg.active=true and rgf.active=true and f.active=true
        `,
    values: [consultantId, userName],
  };
  console.log("sql ==>>", sql);
  const researchProjectData = await researchDbR.query(sql);
  return Promise.all([researchProjectData])
    .then(([researchProjectData]) => {
      return {
        status: "Done",
        message: "Record Fecthed Successfully",
        researchData: researchProjectData.rows,
        rowCount: researchProjectData.rowCount,
      };
    })
    .catch((error) => {
      console.error("Error:", error.message);
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
};
