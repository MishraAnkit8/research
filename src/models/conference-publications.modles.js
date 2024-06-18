const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

module.exports.fetchConferencePublication = async (userName) => {
  let conferenceSql = {
    text: `
        SELECT
            cp.id AS conference_presentation_id,
            cp.nmims_campus,
            cp.nmims_school,
            cp.title_of_paper,
            cp.conference_name,
            cp.authors_name,
            cp.conference_place,
            cp.proceedings_detail,
            cp.conference_type,
            cp.is_presenter,
            cp.author_type,
            cp.presenting_authors,
            cp.organizing_body,
            cp.award_for_presentation,
            cp.vol_and_issue_no,
            cp.issn_isbn_no,
            cp.doi_id,
            cp.upload_files,
            cp.sponsored,
            cp.spent_amount,
            cp.publication_date,
            cp.upload_proof,
            cp.created_at AS conference_created_at,
            cp.updated_at AS conference_updated_at,
            string_agg(DISTINCT f.id::text, ', ') AS faculty_id
        FROM
            conference_presentation cp
        LEFT JOIN
            conference_faculty cf ON cp.id = cf.conference_id
        LEFT JOIN
            faculties f ON cf.faculty_id = f.id
        WHERE
            cp.active = true AND
            cp.created_by = $1 AND 
            cf.active=true AND 
            f.active=true
        GROUP BY
            cp.id, cp.nmims_campus, cp.nmims_school, cp.title_of_paper, cp.conference_name, 
            cp.conference_place, cp.proceedings_detail, cp.conference_type, cp.is_presenter, 
            cp.author_type, cp.presenting_authors, cp.organizing_body, cp.award_for_presentation, 
            cp.vol_and_issue_no, cp.issn_isbn_no, cp.doi_id, cp.upload_files, cp.sponsored, 
            cp.spent_amount, cp.publication_date, cp.upload_proof, cp.created_at, cp.updated_at
        ORDER BY
        cp.id desc
    `,
    values: [userName],
};



  let internalEmpSql = {
    text: `SELECT * FROM faculties where active=true AND faculty_type_id=1  ORDER BY id`,
  };



  // console.log("conferenceSql ===>>>", conferenceSql);
  // console.log("internalEmpSql ===>>>", internalEmpSql);

  const conferencePromise = await researchDbR.query(conferenceSql);
  const internalEmpPromise = await researchDbR.query(internalEmpSql);
  const promises = [conferencePromise, internalEmpPromise];

  return Promise.all(promises)
    .then(([conferencePromise, internalEmpPromise]) => {
      return {
        conferenceDataList: conferencePromise.rows,
        internalEmpList: internalEmpPromise.rows,
        rowCount: conferencePromise.rowCount,
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



module.exports.insertConferencePublication = async (
  conferencePublications,
  conferenceDocument,
  conferenceProofFile,
  facultyIdsContainer,
  externalFacultyData,
  userName
) => {
  const {
    nmimsCampus,
    nmimsSchool,
    titleOfPaper,
    conferenceName,
    conferencePlace,
    procedingDetail,
    conferenceType,
    isPresenter,
    organizingBody,
    // presentationAward,
    volAndIssueNo,
    issnIsbnNo,
    doiWebLinkId,
    sponsored,
    spentAmount,
    publicationDate,
    presentingAuthor,
    authorsName,
  } = conferencePublications;
  console.log(
    "conferencePublications data in models",
    conferencePublications,
    JSON.stringify(facultyIdsContainer)
  );

  console.log('externalFacultyData in models ====>>>>>>>>', externalFacultyData)
  // const doiBookIdParsed =
  //   doiWebLinkId === "" ? null : parseInt(doiWebLinkId, 10);
  const conferenceProofFilesString =
    conferenceProofFile === "" ? null : conferenceProofFile;

  let conferenceSql = {
    text: `INSERT INTO conference_presentation(nmims_campus, nmims_school, title_of_paper, conference_name, conference_place, proceedings_detail, conference_type,
                        is_presenter, organizing_body, vol_and_issue_no, issn_isbn_no, doi_id,
                        sponsored, spent_amount, publication_date, presenting_authors, authors_name, upload_proof, upload_files, created_by)
                       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING id `,
    values: [
      nmimsCampus,
      nmimsSchool,
      titleOfPaper,
      conferenceName,
      conferencePlace,
      procedingDetail,
      conferenceType,
      isPresenter,
      organizingBody,
      // presentationAward,
      volAndIssueNo,
      issnIsbnNo,
      doiWebLinkId,
      sponsored,
      spentAmount,
      publicationDate,
      presentingAuthor,
      authorsName,
      conferenceDocument,
      conferenceProofFilesString,
      userName,
    ],
  };

  console.log("conferenceSql ==>", conferenceSql);
  const conferenceTable = await researchDbW.query(conferenceSql);
  const conferenceId = conferenceTable.rows[0].id;
  const rowCount = conferenceTable.rowCount;

  // insert external faculties
  const insertexternalDetails = externalFacultyData ? externalFacultyData.map( async(detailsData) => {
    console.log('detailsData ======>>>>>>>>>', detailsData);
    const [facultyName, facultyDsg, institutionName, facultyAddr ] = detailsData

    let sql = {
      text: `INSERT INTO faculties (faculty_type_id, faculty_name, designation, institution_name, address, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      values: [2, facultyName, facultyDsg, institutionName, facultyAddr, userName]
    };

    console.log('sql external faculty data', sql);
    const externalResult = await researchDbW.query(sql);
    return externalResult.rows[0].id

  }) : null;

  const externalIds = await Promise.all(insertexternalDetails);
  console.log('externalIds =======>>>>>>>>', externalIds);
  facultyIdsContainer.push(...externalIds);
  // insert external conference  faculties
  const insertConferenceFaculty = facultyIdsContainer ? facultyIdsContainer.map(async(element) => {
    let sql = {
      text: `INSERT INTO conference_faculty (conference_id, faculty_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
      values: [conferenceId, element, userName, true]
    }
    console.log('SQL ======>>>>>>>>>', sql);
    const confacultySql = await researchDbW.query(sql);
    return confacultySql.rows[0].id

  }) : null;

  const extConFaculty = await Promise.all(insertConferenceFaculty);
  console.log('extConFaculty =====>>>>>', extConFaculty);
  // facultyIdsContainer.push(...extConFaculty);


// insert internal conference  faculties
//  const conferenceFacultiesIds = facultyIdsContainer ?    (facultyIdsContainer.map(async (element) => {
//       let confacultySql = {
//         text: `INSERT INTO conference_faculty (conference_id, faculty_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
//         values: [conferenceId, element, userName, true],
//       };
//       let conferenceFaculty = await researchDbW.query(confacultySql);
//       let conFacIds = conferenceFaculty.rows[0].id;
//       conferenceFacultiesIds.push(conFacIds);
//     })
//   ) : null;

  // const  conferencrFacultyIds = await Promise.all(conferenceFacultiesIds);
  // console.log('conferencrFacultyIds ====>>>>>>', conferencrFacultyIds);


  return {
    status: "Done",
    message: "Record Inserted Successfully",
    conferenceId,
    extConFaculty,
    rowCount,
  };
};

module.exports.DeleteConference = async ({ conferenceId }) => {
  console.log("conference Id in models ==>>", conferenceId);
  let sql = {
    // text : `DELETE FROM conference_presentation WHERE id =$1`,
    text: `update conference_presentation set active=false WHERE id =$1`,
    values: [conferenceId],
  };
  console.log("sql ===>>>", sql);
  const deletedRecord = await researchDbW.query(sql);
  const promises = [deletedRecord];
  return Promise.all(promises)
    .then(([deletedRecord]) => {
      return {
        status: "Done",
        message: "Record Deleted Successfully",
        rowCount: deletedRecord.rowCount,
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

module.exports.updateConferencePublication = async (
  upadtedConferenceData, conferenceId, confernceDocString, conferenceProofString,
  insertExternalData, externalFacultyDataUpdate, facultyIdsContainer, userName
) => {
  console.log("Id for Updation in models ==>>>", conferenceId);
  console.log('insertExternalData models ===>>>>>>>', insertExternalData);
  console.log('externalFacultyDataUpdate models ===>>>>>>>', externalFacultyDataUpdate);
  console.log('facultyIdsContainer models ===>>>>>>>', facultyIdsContainer);


  const {
    nmimsCampus,
    nmimsSchool,
    titleOfPaper,
    conferenceName,
    conferencePlace,
    procedingDetail,
    conferenceType,
    isPresenter,
    organizingBody,
    // presentationAward,
    volAndIssueNo,
    issnIsbnNo,
    doiWebLinkId,
    sponsored,
    spentAmount,
    publicationDate,
    presentingAuthor,
    authorsName,
  } = upadtedConferenceData;
  const conferenceFilesarray = { confernceDocString, conferenceProofString };
  console.log("conferenceFiles  =>>", conferenceFilesarray);
  
  const conferenceDocument = confernceDocString || null;
  const conferenceProofe = conferenceProofString || null;
  
  // Base query
  let sql = {
    text: `UPDATE conference_presentation SET 
              nmims_campus = $2, 
              nmims_school = $3, 
              title_of_paper = $4, 
              conference_name = $5, 
              conference_place = $6, 
              proceedings_detail = $7, 
              conference_type = $8,
              organizing_body = $9, 
              vol_and_issue_no = $10, 
              issn_isbn_no = $11, 
              doi_id = $12,
              sponsored = $13, 
              spent_amount = $14, 
              publication_date = $15, 
              presenting_authors = $16, 
              authors_name = $17, 
              updated_by = $18`,
    values: [
      conferenceId,
      nmimsCampus,
      nmimsSchool,
      titleOfPaper,
      conferenceName,
      conferencePlace,
      procedingDetail,
      conferenceType,
      organizingBody,
      volAndIssueNo,
      issnIsbnNo,
      doiWebLinkId,
      sponsored,
      spentAmount,
      publicationDate,
      presentingAuthor,
      authorsName,
      userName
    ]
  };
  
  let nextIndex = 19; 

if (conferenceProofe) {
  sql.text += `, upload_proof = $${nextIndex}`;
  sql.values.push(conferenceProofe);
  nextIndex++;
}

if (conferenceDocument) {
  sql.text += `, upload_files = $${nextIndex}`;
  sql.values.push(conferenceDocument);
}

sql.text += ` WHERE id = $1`;

console.log("SQL Query:", sql.text);
console.log("SQL Values:", sql.values);
  
  console.log("SQL Query:", sql.text);
  console.log("SQL Values:", sql.values);

    const insertExternalDetails = insertExternalData ? insertExternalData.map(async (detailsData) => {
      console.log('detailsData ======>>>>>>>>>', detailsData);
      const [facultyName, facultyDsg, institutionName, facultyAddr] = detailsData;
    
      let sql = {
        text: `INSERT INTO faculties (faculty_type_id, faculty_name, designation, institution_name, address, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        values: [2, facultyName, facultyDsg, institutionName, facultyAddr, userName]
      };
    
      console.log('sql external faculty data', sql);
      const externalResult = await researchDbW.query(sql);
      return externalResult.rows[0].id;
    }) : [];
    
    const insertedExternalIds = await Promise.all(insertExternalDetails);
    console.log('insertedExternalIds ====>>>>>>>', insertedExternalIds);

    
    const updateExternalDetails = externalFacultyDataUpdate ? externalFacultyDataUpdate.map(async (detailsData) => {
      console.log('detailsData ======>>>>>>>>>', detailsData);
      const [facultyName, facultyDsg, institutionName, facultyAddr, id] = detailsData;
    
      let sql = {
        text: `UPDATE faculties SET faculty_type_id = $1, faculty_name = $2, designation = $3, institution_name = $4,  address = $5 WHERE id = $6 AND updated_by = $7`,
        values: [2, facultyName, facultyDsg, institutionName, facultyAddr, id, userName]
      };
    
      console.log('sql external faculty data', sql);
      const externalResult = await researchDbW.query(sql);
      return externalResult.rowCount;
    }) : [];
    
    const insertExConFaculty = insertedExternalIds.length > 0 ? insertedExternalIds.map(async (element) => {
      let sql = {
        text: `INSERT INTO conference_faculty (conference_id, faculty_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
        values: [conferenceId, element, userName, true]
      };
      console.log('SQL ======>>>>>>>>>', sql);
      const confacultySql = await researchDbW.query(sql);
      return confacultySql.rows[0].id;
    }) : [];
    
    const insertExCon = insertExConFaculty.length > 0 ? await Promise.all(insertExConFaculty) : [];
    console.log('insertExCon ===>>>>>', insertExCon);
    
    const updateFaculty = updateExternalDetails.length > 0 ? await Promise.all(updateExternalDetails) : [];
    console.log('updateFaculty =====>>>>>>', updateFaculty);
    
    // Error handling
    if (insertExCon.length === 0 && updateFaculty.length === 0) {
      console.error('Error: No data was inserted or updated.');
    } else {
      console.log('Operations completed successfully.');
    }
  
  

  // const externalIds = await Promise.all(insertedExternalIds)

  const insertConferenceFaculty = facultyIdsContainer && Array.isArray(facultyIdsContainer) ? facultyIdsContainer.map(async (element) => {
    let sql = {
      text: `INSERT INTO conference_faculty (conference_id, faculty_id, created_by, active) VALUES ($1, $2, $3, $4) RETURNING id`,
      values: [conferenceId, element, userName, true]
    };
    console.log('SQL ======>>>>>>>>>', sql);
    const confacultySql = await researchDbW.query(sql);
    return confacultySql.rows[0].id;
  }) : [];
  
  const insertedExDetailsIds = insertConferenceFaculty.length > 0 ? await Promise.all(insertConferenceFaculty) : [];
  
  console.log('insertedExDetailsIds =====>>>>>>', insertedExDetailsIds);
  
  const conferenceTablePromise = researchDbW.query(sql)
    .then((conferenceTable) => {
      return conferenceTable;
    })
    .catch((error) => {
      console.log("Error code:", error.code);
      throw {
        status: "Failed",
        message:
          error.constraint === "conference_presentation_doi_id_key"
            ? "The DOI/Weblink of paper ID provided already exists. Please provide a unique DOI/Weblink of paper ID"
            : error.message,
        errorCode: error.code,
      };
    });
  
  return Promise.all([conferenceTablePromise])
    .then(([conferenceTable]) => {
      return {
        status: "Done",
        message: "Record Updated Successfully",
        rowCount: conferenceTable.rowCount,
      };
    })
    .catch((error) => {
      console.log("error ===>>>", error);
      return error;
    });
};

module.exports.viewConferencePublication = async (conferenceId, userName) => {
  console.log("conference Id in models ", conferenceId);
  let sql = {
    text: `SELECT nmims_campus, nmims_school, title_of_paper, conference_name, conference_place, proceedings_detail, conference_type,
        is_presenter, organizing_body, award_for_presentation, vol_and_issue_no, issn_isbn_no, doi_id,
        sponsored, spent_amount, publication_date, presenting_authors, author_type, authors_name, upload_proof, upload_files FROM  conference_presentation WHERE  id = $1 and active=true AND created_by = $2`,
    values: [conferenceId, userName],
  };

  let facultySql = {
    text: `select 
    cf.id,
    cf.conference_id,
    f.id,
    f.faculty_name,
    f.designation,
    f.institution_name,
    f.address 
from 
    conference_faculty cf 
left join 
    faculties f on cf.faculty_id = f.id 
where  
    cf.active = true 
    and f.active = true and cf.conference_id = $1
order by 
    f.id;
`,
    values: [conferenceId],
  };

  // return researchDbR.query(sql);
  console.log("sql ===>>>", sql);
  const conferencePresentation = await researchDbW.query(sql);
  const facultyDetails = await researchDbW.query(facultySql);
  const response =
    conferencePresentation.rowCount > 0
      ? {
          status: "Done",
          message: "Record Fetched Successfully",
          rowCount: conferencePresentation.rowCount,
          conferencePresentation: conferencePresentation.rows,
          facultyDetails: facultyDetails.rows,
        }
      : {
          status: "Failed",
          message:
            error?.message ?? "An error occurred during record fetching.",
          errorCode: error?.code,
        };

  return response;
};

module.exports.retriveExternalDetails = async(conferenceId, userName) => {
  console.log('conferenceId and userName in models ====>>>>>>', conferenceId, userName);
  
  let facultiesSql = {
    text: `
    SELECT
        
        f.faculty_name,
        f.designation,
        f.institution_name,
        f.address,
        f.id
    FROM
        faculties f
    LEFT JOIN
        conference_faculty cf ON f.id = cf.faculty_id
    LEFT JOIN
        conference_presentation cp ON cf.conference_id = cp.id
    WHERE
        f.active = true AND
        f.faculty_type_id = 2 AND
        cp.id = $1 AND f.created_by = $2
        AND cf.active=true AND cp.active=true
    `,
    values: [conferenceId, userName],
};

console.log('facultiesSql ====>>>>>>', facultiesSql);

const externalData = await researchDbW.query(facultiesSql);

const facultyPromises = [externalData];
return Promise.all(facultyPromises).then(([externalData]) => {
  return {
    status : "Done",
    message : "Retrived External Details",
    exetrnalData : externalData.rows,
    rowCount : externalData.rowCount,

  }
})
.catch((error) => {
  return {
    status: "Failed",
    message: error.message,
    errorCode: error.code,
  };
});

}

module.exports.deletedExternalDetails = async(externalId, userName) => {
  console.log('externalId in models  =====>>>>>>>', externalId);

  let externalSql = {
    text : `UPDATE faculties SET active=false WHERE id = $1 AND created_by = $2`,
    values : [externalId, userName]
  }

  const deleteExternalDetails = await researchDbW.query(externalSql);

  const promises = [deleteExternalDetails];
  return Promise.all(promises).then(([deleteExternalDetails]) => {
    return {
      status : "Done",
      message : "Deleted successfully",
      rowCount : deleteExternalDetails.rowCount
    }
  })
  .catch((error) => {
    return {
      status: "Failed",
      message: error.message,
      errorCode: error.code,
    };
  });
}

module.exports.deleteInternalFaculty = async(internalId, conferenceId) => {

  console.log('internalId in models ====>>>>>>', internalId);
  let sql = {
    text: `UPDATE  conference_faculty  SET active = false WHERE faculty_id = $1 And conference_id = $2`,
    values: [parseInt(internalId), parseInt(conferenceId)]
  }
  console.log('sql ====>>>>', sql);

  const externalFacultyDelete  = await researchDbW.query(sql);
  const  promises = [externalFacultyDelete];

  return Promise.all(promises).then(([externalFacultyDelete]) => {
    return {
      status : 'Done',
      message : 'Delete Successfully',
      rowCount : externalFacultyDelete.rowCount
    }
  })
  .catch((error) => {
    return {
      status: "Failed",
      message: error.message,
      errorCode: error.code,
    };
  });


}
