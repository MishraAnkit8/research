const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

const insertDbModels = require('./insert-update-records.models');

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
  conferencePublications, conferenceDocument, conferenceProofFile, 
  facultyIdsContainer, externalFacultyData, userName
) => {

  const {
    nmimsCampus, nmimsSchool, titleOfPaper, conferenceName, conferencePlace, procedingDetail, conferenceType, isPresenter, organizingBody, volAndIssueNo,
    issnIsbnNo, doiWebLinkId, sponsored, spentAmount, publicationDate, presentingAuthor, authorsName
  } = conferencePublications;

  const conferenceValues = [nmimsCampus, nmimsSchool, titleOfPaper, conferenceName, conferencePlace, procedingDetail, conferenceType, isPresenter, organizingBody, volAndIssueNo,
    issnIsbnNo, doiWebLinkId, sponsored, spentAmount, publicationDate, presentingAuthor, authorsName, conferenceDocument, conferenceProofFile, userName];

  const conferenceField = ['nmims_campus', 'nmims_school', 'title_of_paper', 'conference_name', 'conference_place', 'proceedings_detail', 'conference_type',
    'is_presenter', 'organizing_body', 'vol_and_issue_no', 'issn_isbn_no', 'doi_id',
    'sponsored', 'spent_amount', 'publication_date', 'presenting_authors', 'authors_name', 'upload_files',  'upload_proof', 'created_by'];

  try {
    const insertConferencePresentation = await insertDbModels.insertRecordIntoMainDb('conference_presentation', conferenceField, conferenceValues, userName);
    console.log('insertConferencePresentation ===>>>>', insertConferencePresentation);

    if (insertConferencePresentation.status !== 'Done') {
      const message = insertConferencePresentation.errorCode === '23505' ? "This WebLink / DOI No. is already used with another form" : insertConferencePresentation.message;
      return {
        status: 'Failed',
        message: message,
        errorCode: insertConferencePresentation.errorCode
      };
    }

    const conferenceId = insertConferencePresentation.insertedId;
    console.log('conferenceId ===>>>>>', conferenceId);

    // Insert into external faculty
    const facultyField = ['faculty_type_id', 'faculty_name', 'designation', 'institution_name', 'address', 'created_by'];
    const insertIntoFacultyTable = await insertDbModels.insertExternalFacultyRecord('faculties', facultyField, externalFacultyData, userName);
    console.log('insertIntoFacultyTable =====>>>>>', insertIntoFacultyTable);

    if (insertIntoFacultyTable.status !== 'Done') {
      return {
        status: 'Failed',
        message: insertIntoFacultyTable.message,
        errorCode: insertIntoFacultyTable.errorCode
      };
    }

    const externalId = insertIntoFacultyTable.externalId;
    console.log('externalId ===>>>>>', externalId);

    // Push external faculty ids into facultyIdsContainer
    facultyIdsContainer.push(...externalId);
    console.log('facultyIdsContainer in patent models ===>>>>>>', facultyIdsContainer);

    // Insert into conference_faculty table 
    const conferenceFacultyField = ['conference_id', 'faculty_id', 'created_by'];
    const insertConferenceFaculty = await insertDbModels.insertIntoRelationalDb('conference_faculty', conferenceFacultyField, conferenceId, facultyIdsContainer, userName);
    console.log('insertConferenceFaculty ===>>>>>>', insertConferenceFaculty);

    if (insertConferenceFaculty.status !== 'Done') {
      return {
        status: 'Failed',
        message: insertConferenceFaculty.message,
        errorCode: insertConferenceFaculty.errorCode
      };
    }

    return {
      status: 'Done',
      message: 'Record Inserted Successfully'
    };

  } catch (error) {
    console.error('Error in insertConferencePublication ====>>>>>>', error);
    return {
      status: 'Failed',
      message: 'Failed to insert new record',
      errorCode: error.code
    };
  }
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
  updatedConferenceData, conferenceId, conferenceDocString, conferenceProofString,
  insertExternalData, externalFacultyDataUpdate, facultyIdsContainer, userName
) => {
  console.log("Id for Updation in models ==>>>", conferenceId);
  console.log('insertExternalData models ===>>>>>>>', insertExternalData);
  console.log('externalFacultyDataUpdate models ===>>>>>>>', externalFacultyDataUpdate);
  console.log('facultyIdsContainer models ===>>>>>>>', facultyIdsContainer);

  const {
    nmimsCampus, nmimsSchool, titleOfPaper, conferenceName, conferencePlace, procedingDetail, conferenceType, isPresenter, organizingBody, volAndIssueNo,
    issnIsbnNo, doiWebLinkId, sponsored, spentAmount, publicationDate, presentingAuthor, authorsName
  } = updatedConferenceData;

  const conferenceValues = [nmimsCampus, nmimsSchool, titleOfPaper, conferenceName, conferencePlace, procedingDetail, conferenceType, isPresenter, organizingBody, volAndIssueNo,
    issnIsbnNo, doiWebLinkId, sponsored, spentAmount, publicationDate, presentingAuthor, authorsName, conferenceDocString, conferenceProofString, userName, conferenceId];

  const conferenceField = ['nmims_campus', 'nmims_school', 'title_of_paper', 'conference_name', 'conference_place', 'proceedings_detail', 'conference_type',
    'is_presenter', 'organizing_body', 'vol_and_issue_no', 'issn_isbn_no', 'doi_id',
    'sponsored', 'spent_amount', 'publication_date', 'presenting_authors', 'authors_name', 'upload_files', 'upload_proof', 'updated_by'];

  let updateConference;
  try {
    updateConference = await insertDbModels.updateFieldWithSomeFilesOrNotFiles('conference_presentation', conferenceField, conferenceValues, userName);
    console.log('updateConference ====>>>>>>>', updateConference);

    if (updateConference.status !== 'Done') {
      throw new Error('Error updating conference_presentation');
    }

    // Update external faculty details
    const updateFacultyField = ['faculty_name', 'designation', 'institution_name', 'address'];
    const updateExternalFacultyData = await insertDbModels.updateExternalFacultyDetails('faculties', updateFacultyField, externalFacultyDataUpdate, userName);
    console.log('updateExternalFacultyData ====>>>>>>', updateExternalFacultyData);

    if(updateExternalFacultyData.status !== 'Done'){
      throw new Error('Error updating into faculties');
    }

    // Insert into external faculty
    const facultyField = ['faculty_type_id', 'faculty_name', 'designation', 'institution_name', 'address', 'created_by'];
    const insertIntoFacultyTable = await insertDbModels.insertExternalFacultyRecord('faculties', facultyField, insertExternalData, userName);
    console.log('insertIntoFacultyTable =====>>>>>', insertIntoFacultyTable);

    if (insertIntoFacultyTable.status !== 'Done') {
      throw new Error('Error inserting into faculties');
    }

    const externalId = insertIntoFacultyTable.externalId;
    console.log('externalId ===>>>>>', externalId);

    // Push external faculty ids into facultyIdsContainer
    facultyIdsContainer.push(...externalId);
    console.log('facultyIdsContainer in patent models ===>>>>>>', facultyIdsContainer);

    // Insert into conference_faculty table
    const conferenceFacultyField = ['conference_id', 'faculty_id', 'created_by'];
    const insertConferenceFaculty = await insertDbModels.insertOrUpdateRelationalDb('conference_faculty', conferenceFacultyField, conferenceId, facultyIdsContainer, userName);
    console.log('insertConferenceFaculty ===>>>>>>', insertConferenceFaculty);

    if (insertConferenceFaculty.status !== 'Done') {
      throw new Error('Error inserting into conference_faculty');
    }

    return {
      status: 'Done',
      message: 'Record Updated Successfully'
    };

  } catch (error) {
    console.error('Error in updateConferencePublication ====>>>>>>', error);

    let errorMessage;
    switch (error.message) {
      case 'Error updating conference_presentation':
        errorMessage = updateConference.errorCode === '23505' ? "This WebLink / DOI No. is already used with another form" : updateConference.message;
        return {
          status: 'Failed',
          message: errorMessage,
          errorCode: updateConference.errorCode
        };
      case 'Error inserting into faculties':
        return {
          status: 'Failed',
          message: insertIntoFacultyTable.message,
          errorCode: insertIntoFacultyTable.errorCode
        };
      case 'Error inserting into conference_faculty':
        return {
          status: 'Failed',
          message: insertConferenceFaculty.message,
          errorCode: insertConferenceFaculty.errorCode
        };
      default:
        return {
          status: 'Failed',
          message: error.message,
        };
    }
  }
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
    text : `UPDATE conference_faculty SET active=false WHERE faculty_id = $1 AND created_by = $2`,
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
