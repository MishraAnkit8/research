const {
  research_read_db,
  research_write_db,
} = require("../../config/db-configs");
const dbPoolManager = require("../../config/db-pool-manager");
const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

const insertDbModels = require('./insert-update-records.models')

module.exports.fetchIPRData = async (userName) => {
  let iPRSql = {
    text: `
            SELECT
                ipr.id AS ipr_id,
                ipr.created_by AS created_by,
                ipr.updated_by AS updated_by,
                ipr.patent_title,
                ipr.patent_application_number,
                ipr.applicant_name,
                ipr.patent_filed_date,
                ipr.patent_grant_date,
                ipr.patent_published_date,
                ipr.patent_publication_number,
                ipr.patent_grant_number,
                ipr.nmims_campus,
                ipr.nmims_school,
                ipr.supporting_documents,
                ipr.institutional_affiliation,
                string_agg(DISTINCT it.name, ', ') AS invention_types,
                string_agg(DISTINCT it.id::text, ', ') AS invention_types_id,
                string_agg(DISTINCT ps.name, ', ') AS patent_stage_statuses,
                string_agg(DISTINCT ps.id::text, ', ') AS patent_stage_id,
                string_agg(DISTINCT sdg.id::text, ', ') AS sdg_id,
                string_agg(DISTINCT intr.id::text, ', ') AS faculty_id
            FROM
                IPR ipr
            LEFT JOIN
                ipr_invention_type iit ON ipr.id = iit.ipr_id
            LEFT JOIN
                invention_type it ON iit.invention_type_id = it.id
            LEFT JOIN
                ipr_status_type ist ON ipr.id = ist.ipr_id
            LEFT JOIN
                pantent_stage_status ps ON ist.ipr_status_id = ps.id
            LEFT JOIN
              ipr_sdg_goals isdg ON ipr.id = isdg.ipr_id
            LEFT JOIN
                sdg_goals sdg ON isdg.sdg_goals_id = sdg.id
            LEFT JOIN
              ipr_faculty iprf ON ipr.id = iprf.ipr_id
            LEFT JOIN
                  faculties intr ON iprf.faculty_id = intr.id
            
            WHERE
                ipr.created_by = $1 and ipr.active=true and iit.active=true and it.active=true and 
                ist.active=true and isdg.active=true and sdg.active=true and ps.active=true and
                iprf.active=true and  intr.active=true
            GROUP BY
                ipr.id,
                ipr.patent_title,
                ipr.patent_application_number,
                ipr.applicant_name,
                ipr.patent_filed_date,
                ipr.patent_published_date,
                ipr.patent_publication_number,
                ipr.patent_grant_number,
                ipr.nmims_campus,
                ipr.nmims_school,
                ipr.supporting_documents,
                ipr.institutional_affiliation
            ORDER BY
                ipr.id desc
        `,
    values: [userName],
  };

  let internalEmpSql = {
    text: `select *  FROM faculties WHERE faculty_type_id = 1 and active=true`,
  };

  let inventionTypeSql = {
    text: `select *  FROM invention_type where active=true ORDER BY id `,
  };

  let patentStageSql = {
    text: `select *  FROM pantent_stage_status where active=true ORDER BY id`,
  };

  let supportingoDcumentsSql = {
    text: `select *  FROM supporting_documents where active=true ORDER BY id`,
  };

  let nmimsSchoolSql = {
    text: `select *  FROM nmims_school where active=true ORDER BY id`,
  };

  let nmimsCampusSql = {
    text: `select *  FROM nmims_campus where active=true ORDER BY id`,
  };

  let iprFacultySql = {
    text: `select *  FROM ipr_faculty where active=true  ORDER BY id`,
  };

  let iprInventionTypeSql = {
    text: `select *  FROM ipr_invention_type where active=true ORDER BY id`,
  };

  let iprPatentStageSql = {
    text: `select *  FROM ipr_status_type where active=true ORDER BY id`,
  };

  let iprDocumnetsSql = {
    text: `select *  FROM ipr_supporting_documents where active=true ORDER BY id`,
  };

  let iprNmimsSchoolSql = {
    text: `select *  FROM ipr_nmims_school where active=true ORDER BY id`,
  };

  let iprNmimsCampusSql = {
    text: `select *  FROM ipr_nmims_campus where active=true ORDER BY id`,
  };

  let sdgGoalSql = {
    text: `select *  FROM sdg_goals where active=true  ORDER BY id`
};

  console.log("iPRSql ===>>>", iPRSql);
  console.log("internalEmpSql ===>>>", internalEmpSql);
  const iprPromise = await researchDbR.query(iPRSql);
  const internalEmpPromise = await researchDbR.query(internalEmpSql);
  const inventionTypePromises = await researchDbR.query(inventionTypeSql);
  const statusPromises = await researchDbR.query(patentStageSql);
  const nmimsSchool = await researchDbR.query(nmimsSchoolSql);
  const nmimsCampus = await researchDbR.query(nmimsCampusSql);
  const iprDocuments = await researchDbR.query(supportingoDcumentsSql);
  const iprCampus = await researchDbR.query(iprNmimsCampusSql);
  const iprSchool = await researchDbR.query(iprNmimsSchoolSql);
  const iprdocuments = await researchDbR.query(iprDocumnetsSql);
  const iprSatatus = await researchDbR.query(iprPatentStageSql);
  const iprInvetiontype = await researchDbR.query(iprInventionTypeSql);
  const iprFaculty = await researchDbR.query(iprFacultySql);
  const patentSdgGoalData = await researchDbR.query(sdgGoalSql);
  const promises = [
    iprPromise,
    internalEmpPromise,
    inventionTypePromises,
    statusPromises,
    nmimsSchool,
    nmimsCampus,
    iprDocuments,
    iprCampus,
    iprSchool,
    iprdocuments,
    iprSatatus,
    iprInvetiontype,
    iprFaculty,
    patentSdgGoalData
  ];

  return Promise.all(promises)
    .then(
      ([
        iprPromise,
        internalEmpPromise,
        inventionTypePromises,
        statusPromises,
        nmimsSchool,
        nmimsCampus,
        iprDocuments,
        iprCampus,
        iprSchool,
        iprdocuments,
        iprSatatus,
        iprInvetiontype,
        iprFaculty,
        patentSdgGoalData,
      ]) => {
        return {
          status: "Done",
          message: "Record Fetched Successfully",
          rowCount: iprPromise.rowCount,
          iprData: iprPromise.rows,
          internalEmpList: internalEmpPromise.rows,
          inventionTypData: inventionTypePromises.rows,
          patentStatus: statusPromises.rows,
          nmimsSchoolList: nmimsSchool.rows,
          nmimsCampusList: nmimsCampus.rows,
          supportingdocumnets: iprDocuments.rows,
          iprCampus: iprCampus.rows,
          iprSchool: iprSchool.rows,
          iprdocuments: iprdocuments.rows,
          iprSatatus: iprSatatus.rows,
          iprInvetiontype: iprInvetiontype.rows,
          iprFaculty: iprFaculty.rows,
          patentSdgGoalData : patentSdgGoalData.rows,
        };
      }
    )
    .catch((error) => {
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
};

module.exports.InsetIPRDataModels = async (
  IprData, iprFilesNamesArray, sdgGoalsIdArray, inventionIdsArray, patentStatus, facultyIdsContainer, externalFacultyData, userName
) => {
  console.log("iprFilesString in models ====>>>>", iprFilesNamesArray);
  console.log("patentStatus ===>>>>>", patentStatus);
  const { nmimsCampus, nmimsSchool, titleOfInvention, applicationNum, applicantName, patentFiledDate, patentPublishedDate, patentGrantDate, patentPublishedNumber, patentGrantedNo, instituteAffiliation } = IprData;


  const iprFieldValues = [nmimsCampus, nmimsSchool, titleOfInvention, applicationNum, applicantName, patentFiledDate,
    patentPublishedDate, patentGrantDate, patentPublishedNumber, patentGrantedNo, instituteAffiliation, iprFilesNamesArray, userName];

  const iprDbField = ['nmims_campus', 'nmims_school', 'patent_title', 'patent_application_number', 'applicant_name', 'patent_filed_date', 'patent_published_date', 'patent_grant_date', 'patent_publication_number', 'patent_grant_number', 'institutional_affiliation', 'supporting_documents', 'created_by']

  const insertIprData = await insertDbModels.insertRecordIntoMainDb('IPR', iprDbField, iprFieldValues, userName);

  console.log('insertIprData ===>>>>>>', insertIprData);
  const iprId = insertIprData.insertedId;
  console.log('iprId ===>>>>>', iprId)

  // insert into external faculty
  const facultyfield = ['faculty_type_id', 'faculty_name', 'designation', 'institution_name', 'address', 'created_by'];
  const insertIntoFacultyTable = await insertDbModels.insertExternalFacultyRecord('faculties', facultyfield, externalFacultyData, userName);

  console.log('insertIntoFacultyTable =====>>>>>', insertIntoFacultyTable);
  const externalId = insertIntoFacultyTable.externalId;
  console.log('externalId ===>>>>>', externalId);

  // push external faculty ids into facultyIdsContainer
  facultyIdsContainer.push(...externalId);
  console.log('facultyIdsContainer in patent models ===>>>>>>', facultyIdsContainer);

   //insert into patent faculties table 
   const iprFacultyField = ['ipr_id', 'faculty_id', 'created_by'];

   const insertIPRFaculty = await insertDbModels.insertIntoRelationalDb('ipr_faculty', iprFacultyField, iprId, facultyIdsContainer, userName);
   console.log('insertIPRFaculty ===>>>>>>', insertIPRFaculty);

     //insert into patent_submission_sdg_goals
    const iprSdgGoalsFields = ['ipr_id', 'sdg_goals_id', 'created_by'];
    const iprSdgGoals = await insertDbModels.insertIntoRelationalDb('ipr_sdg_goals', iprSdgGoalsFields, iprId, sdgGoalsIdArray, userName);

    console.log('iprSdgGoals ====>>>>>', iprSdgGoals);

    //insert into patent_submission_invention_type
    const inventionFields = ['ipr_id', 'invention_type_id', 'created_by'];
    const iprInvention = await insertDbModels.insertIntoRelationalDb('ipr_invention_type', inventionFields, iprId, inventionIdsArray, userName);
    console.log('iprInvention ====>>>>>>>>', iprInvention);
  
    //insert into patent_submission_stage_status
    const iprStatusField = ['ipr_id', 'ipr_status_id', 'created_by'];
    const iprStatus = await insertDbModels.insertIntoRelationalDb('ipr_status_type', iprStatusField, iprId, patentStatus, userName);
    console.log('iprStatus ===>>>>>>', iprStatus);

      // Check if all insertions are successful
  if (
    insertIprData.status === 'Done' &&
    insertIntoFacultyTable.status === 'Done' &&
    insertIPRFaculty.status === 'Done' &&
    iprSdgGoals.status === 'Done' &&
    iprInvention.status === 'Done' &&
    iprStatus.status === 'Done'
  ) {
    return {
      status: 'Done',
      message: 'All records inserted successfully'
    };
  } else {
    return {
      status: 'Failed',
      message: 'Failed to insert'
    };
  }
};
 


module.exports.deleteIPRData = async (iprId) => {
  console.log("iprId in models ===>>>>", iprId);

  // Delete records from child tables  patent_submission_invention_type
  const deleteIprInventiontypeSql = {
    // text: 'DELETE FROM ipr_invention_type WHERE ipr_id = $1',
    text: "update ipr_invention_type set active=false WHERE ipr_id = $1",
    values: [iprId],
  };
  console.log("deleteIprInventiontypeSql ==>>>>", deleteIprInventiontypeSql);

  // Delete records from child tables  ipr faculty
  const deleteIprFacultySql = {
    // text: 'DELETE FROM ipr_faculty WHERE ipr_id = $1',
    text: "update ipr_faculty set active=false WHERE ipr_id = $1",
    values: [iprId],
  };
  console.log("deleteIprFacultySql ==>>>>", deleteIprFacultySql);

  // Delete records from child tables  patent_submission_stage_status
  const deleteIprStatusSql = {
    // text: 'DELETE FROM ipr_status_type WHERE ipr_id = $1',
    text: "update ipr_status_type set active=false WHERE ipr_id = $1",
    values: [iprId],
  };
  console.log("deleteIprStatusSql ==>>>>", deleteIprStatusSql);

  // Delete records from child tables  iprSchool
  const deleteIprSchoolSql = {
    // text: 'DELETE FROM ipr_nmims_school WHERE ipr_id = $1',
    text: "update ipr_nmims_school set active=false WHERE ipr_id = $1",
    values: [iprId],
  };
  console.log("deleteIprSchoolSql ==>>>>", deleteIprSchoolSql);

  // Delete records from child tables  iprSchool
  const deleteIprCampusSql = {
    // text: 'DELETE FROM ipr_nmims_campus WHERE ipr_id = $1',
    text: "update ipr_nmims_campus set active=false WHERE ipr_id = $1",
    values: [iprId],
  };
  console.log("deleteIprCampusSql ==>>>>", deleteIprCampusSql);

  // Delete records from child tables  iprSchool
  const deleteIprDocumnetsSql = {
    // text: 'DELETE FROM ipr_supporting_documents WHERE ipr_id = $1',
    text: "update ipr_supporting_documents set active=false WHERE ipr_id = $1",
    values: [iprId],
  };
  console.log("deleteIprDocumnetsSql ==>>>>", deleteIprDocumnetsSql);

  const deleteIprInventionstype = await researchDbW.query(
    deleteIprInventiontypeSql
  );
  const deleteIprFaculty = await researchDbW.query(deleteIprFacultySql);
  const deleteIprSchool = await researchDbW.query(deleteIprSchoolSql);
  const deleteIprCampus = await researchDbW.query(deleteIprCampusSql);
  const deleteIprDocuments = await researchDbW.query(deleteIprDocumnetsSql);
  const deleteIprStatus = await researchDbW.query(deleteIprStatusSql);

  let deletePromises = [
    deleteIprInventionstype,
    deleteIprFaculty,
    deleteIprSchool,
    deleteIprCampus,
    deleteIprDocuments,
    deleteIprStatus,
  ];

  return Promise.all(deletePromises)
    .then((result) => {
      console.log("result ===>>>", result);
      //once if child record are deleted then delete record from parent table means IPR table
      return researchDbW.query({
        // text : `DELETE FROM IPR WHERE id = $1`,
        text: "update IPR set active=false WHERE id = $1",
        values: [iprId],
      });
    })
    .then((finalResponce) => {
      return {
        status: "Done",
        message: "Record deleted successfully",
        iprFacultyRowCount: deleteIprFaculty.rowCount,
        iprStatusRowCount: deleteIprStatus.rowCount,
        iprInventiontypeRowCount: deleteIprInventionstype.rowCount,
        iprSchoolRowCount: deleteIprSchool.rowCount,
        irpCampusRowCount: deleteIprCampus.rowCount,
        iprDocumnetsRowCount: deleteIprDocuments.rowCount,
        iprRowCount: finalResponce.rowCount,
      };
    });
};

module.exports.updateIPRRecordData = async (
  iprId, updatedIPRData, iprFilesNamesArray, sdgGoalsIdArray, inventionIdsArray, patentStatus,
  externalFacultyData, updateExternalDetailsArray, facultyIdsContainer, userName
) => {
  console.log("Data for updating IPR:", updatedIPRData);
  console.log("IPR Files Names Array:", iprFilesNamesArray);

  const { nmimsCampus, nmimsSchool, titleOfInvention, applicationNum, applicantName, patentFiledDate,
    patentPublishedDate, patentGrantDate, patentPublishedNumber, patentGrantedNo, instituteAffiliation 
  } = updatedIPRData; 

  try {
   

    let updateIprData;
    if (iprFilesNamesArray) {
      const iprFieldValues = [nmimsCampus, nmimsSchool, titleOfInvention, applicationNum, applicantName, patentFiledDate,
        patentPublishedDate, patentGrantDate, patentPublishedNumber, patentGrantedNo, instituteAffiliation, iprFilesNamesArray, userName , iprId];
      const iprField = ['nmims_campus', 'nmims_school', 'patent_title', 'patent_application_number', 'applicant_name', 'patent_filed_date', 'patent_published_date', 'patent_grant_date', 'patent_publication_number', 'patent_grant_number', 'institutional_affiliation', 'supporting_documents', 'created_by']

      updateIprData = await insertDbModels.updateFieldWithFiles('IPR', iprField, iprFieldValues, userName);
      console.log('updateIprData ===>>>>', updateIprData);
    } else {
      const iprFieldValues = [nmimsCampus, nmimsSchool, titleOfInvention, applicationNum, applicantName, patentFiledDate,
        patentPublishedDate, patentGrantDate, patentPublishedNumber, patentGrantedNo, instituteAffiliation, userName , iprId];
      const iprField = ['nmims_campus', 'nmims_school', 'patent_title', 'patent_application_number', 'applicant_name', 'patent_filed_date', 'patent_published_date', 'patent_grant_date', 'patent_publication_number', 'patent_grant_number', 'institutional_affiliation', 'created_by']

      updateIprData = await insertDbModels.updateFieldWithOutFiles('IPR', iprField, iprFieldValues, userName);
      console.log('updateIprData ===>>>>', updateIprData);
    }

    // Insert into external faculty
    const facultyField = ['faculty_type_id', 'faculty_name', 'designation', 'institution_name', 'address', 'created_by'];
    const insertIntoFacultyTable = await insertDbModels.insertExternalFacultyRecord('faculties', facultyField, externalFacultyData, userName);
    const externalIds = insertIntoFacultyTable.externalId;

    // Append into faculty container
    facultyIdsContainer.push(...externalIds);

    // Update external faculty details
    const updateFacultyField = ['faculty_name', 'designation', 'institution_name', 'address'];
    const updateExternalFacultyData = await insertDbModels.updateExternalFacultyDetails('faculties', updateFacultyField, updateExternalDetailsArray, userName);
    console.log('updateExternalFacultyData ====>>>>>>', updateExternalFacultyData);

    // Update patent faculty tables
    console.log('facultyIdsContainer in IPR models ===>>>>>>', facultyIdsContainer);

    // Insert into patent ipr_faculty table
    const iprFacultyField = ['ipr_id', 'faculty_id', 'created_by'];
    const updateIPRFaculty = await insertDbModels.insertOrUpdateRelationalDb('ipr_faculty', iprFacultyField, iprId, facultyIdsContainer, userName);
    console.log('updateIPRFaculty ===>>>>>>', updateIPRFaculty);

    // Insert into ipr_sdg_goals
    const iprSdgGoalsFields = ['ipr_id', 'sdg_goals_id', 'created_by'];
    const updateIPRSdgGoals = await insertDbModels.insertOrUpdateRelationalDb('ipr_sdg_goals', iprSdgGoalsFields, iprId, sdgGoalsIdArray, userName);
    console.log('updateIPRSdgGoals ====>>>>>', updateIPRSdgGoals);

    // Insert into ipr_invention_type
    const inventionFields = ['ipr_id', 'invention_type_id', 'created_by'];
    const updateIPRInvention = await insertDbModels.insertOrUpdateRelationalDb('ipr_invention_type', inventionFields, iprId, inventionIdsArray, userName);
    console.log('updateIPRInvention ====>>>>>>>>', updateIPRInvention);

    // Insert into ipr_status_type
    const iprStatusField = ['ipr_id', 'ipr_status_id', 'created_by'];
    const updateIPRStatus = await insertDbModels.updateStatus('ipr_status_type', iprStatusField, iprId, patentStatus, userName);
    console.log('updateIPRStatus ===>>>>>>', updateIPRStatus);

    // Check if all updates are done
    if (
      updateIprData &&
      updateExternalFacultyData &&
      updateIPRSdgGoals &&
      updateIPRInvention &&
      updateIPRStatus &&
      updateIPRFaculty
    ) {
      return {
        status: 'Done',
        message: 'All Records updated',
      };
    } else {
      throw new Error('Some updates failed');
    }
  } catch (error) {
    console.error('Error updating patent submission data:', error);

    return {
      status: 'error',
      message: 'Failed to update records',
      errorCode: error.message,
    };
  }

};


module.exports.iprRecordToBeViewed = async (iprId, userName) => {
  let iprSql = {
    text: `SELECT
    ipr.id AS ipr_id,
    ipr.created_by AS created_by,
    ipr.updated_by AS updated_by,
    ipr.patent_title,
    ipr.patent_application_number,
    ipr.applicant_name,
    ipr.patent_filed_date,
    ipr.patent_grant_date,
    ipr.patent_published_date,
    ipr.patent_publication_number,
    ipr.patent_grant_number,
    ipr.nmims_campus,
    ipr.nmims_school,
    ipr.supporting_documents,
    ipr.institutional_affiliation,
    string_agg(DISTINCT it.name, ', ') AS invention_types,
    string_agg(DISTINCT it.id::text, ', ') AS invention_types_id,
    string_agg(DISTINCT ps.name, ', ') AS patent_stage_statuses,
    string_agg(DISTINCT ps.id::text, ', ') AS patent_stage_id,
    string_agg(DISTINCT sdg.id::text, ', ') AS sdg_id,
    string_agg(DISTINCT intr.id::text, ', ') AS faculty_id
FROM
    IPR ipr
LEFT JOIN
    ipr_invention_type iit ON ipr.id = iit.ipr_id
LEFT JOIN
    invention_type it ON iit.invention_type_id = it.id
LEFT JOIN
    ipr_status_type ist ON ipr.id = ist.ipr_id
LEFT JOIN
    pantent_stage_status ps ON ist.ipr_status_id = ps.id
LEFT JOIN
  ipr_sdg_goals isdg ON ipr.id = isdg.ipr_id
LEFT JOIN
    sdg_goals sdg ON isdg.sdg_goals_id = sdg.id
LEFT JOIN
  ipr_faculty iprf ON ipr.id = iprf.ipr_id
LEFT JOIN
      faculties intr ON iprf.faculty_id = intr.id

WHERE
     ipr.id = $1 and ipr.created_by = $2 and ipr.active=true and iit.active=true and it.active=true and 
    ist.active=true and isdg.active=true and sdg.active=true and ps.active=true and
    iprf.active=true and  intr.active=true
GROUP BY
    ipr.id,
    ipr.patent_title,
    ipr.patent_application_number,
    ipr.applicant_name,
    ipr.patent_filed_date,
    ipr.patent_published_date,
    ipr.patent_publication_number,
    ipr.patent_grant_number,
    ipr.nmims_campus,
    ipr.nmims_school,
    ipr.supporting_documents,
    ipr.institutional_affiliation`,

    values: [iprId, userName],
  };

  const iprFacultySql = {
    text: `SELECT
                f.faculty_name,
                f.designation,
                f.institution_name,
                f.address,
                ft.name AS faculty_type
            FROM
                ipr_faculty ipf
            JOIN
                faculties f ON ipf.faculty_id = f.id
            JOIN
                faculty_types ft ON f.faculty_type_id = ft.id
            WHERE
                ipf.ipr_id = $1 and ipf.active=true and f.active=true and ft.active=true `,

    values: [iprId],
  };

  const iprSchoolSql = {
    text: `SELECT 
                    ns.school_name,
                    ns.id
                FROM 
                    ipr_nmims_school ins 
                JOIN 
                    nmims_school ns ON ins.school_id =  ns.id
                WHERE 
                    ins.ipr_id = $1 and ins.active=true and ns.active=true `,
    values: [iprId],
  };

  const iprCampusSql = {
    text: `SELECT 
                    nc.campus_name,
                    nc.id
                FROM
                    ipr_nmims_campus inc 
                JOIN 
                    nmims_campus nc ON inc.campus_id = nc.id
                WHERE
                    inc.ipr_id = $1 and inc.active=true and nc.active=true`,
    values: [iprId],
  };

  const iprInvetionSql = {
    text: `SELECT 
                    it.name,
                    it.id
                FROM
                ipr_invention_type iit 
                JOIN 
                invention_type it ON iit.invention_type_id = it.id
                WHERE
                    iit.ipr_id = $1`,
    values: [iprId],
  };

  const iprStatusSql = {
    text: `SELECT 
                    ps.name,
                    ps.id
                FROM
                    ipr_status_type ipt 
                JOIN 
                    pantent_stage_status ps ON ipt.ipr_status_id = ps.id
                WHERE
                    ipt.ipr_id = $1 and ipt.active=true and ps.active=true `,
    values: [iprId],
  };

  const iprDocuments = {
    text: `SELECT 
                    sd.documents_name,
                    sd.id
                FROM
                    ipr_supporting_documents isd 
                JOIN 
                    supporting_documents sd ON isd.supporting_documents_id = sd.id
                WHERE
                    isd.ipr_id = $1 and isd.active=true and sd.active=true `,
    values: [iprId],
  };

  let sdgGoalSql = {
    text: `SELECT sg.id, sg.name
        FROM ipr_sdg_goals iprsg
        JOIN sdg_goals sg ON iprsg.sdg_goals_id = sg.id
        WHERE iprsg.ipr_id = $1 and iprsg.active=true and sg.active=true`,
    values : [iprId]
};
  console.log("iprDocuments ===>>>>>>", iprDocuments);
  console.log("iprStatusSql ===>>>>>", iprStatusSql);
  console.log("iprInvetionSql ===>>>>", iprInvetionSql);
  console.log("iprCampusSql ===>>>>", iprCampusSql);
  console.log("iprSchoolSql ==>>>", iprSchoolSql);
  console.log("iprFacultySql ===>>>>>", iprFacultySql);

  console.log("iprSql ===>>>>", iprSql);
  const viewIPRRecord = await researchDbW.query(iprSql);
  const facultyData = await researchDbW.query(iprFacultySql);
  const iprNmimsSchoolList = await researchDbW.query(iprSchoolSql);
  const iprNmimsCampusList = await researchDbW.query(iprCampusSql);
  const iprInventionList = await researchDbW.query(iprInvetionSql);
  const iprStatusList = await researchDbW.query(iprStatusSql);
  const iprDocumentsList = await researchDbW.query(iprDocuments);
  const sdgGoals = await researchDbW.query(sdgGoalSql)
  const promises = [
    viewIPRRecord,
    facultyData,
    iprNmimsSchoolList,
    iprNmimsCampusList,
    iprInventionList,
    iprStatusList,
    iprDocumentsList,
    sdgGoals,
  ];
  return Promise.all(promises)
    .then(([viewIPRRecord]) => {
      return {
        status: "Done",
        message: "Record Viewed Successfully",
        rowCount: viewIPRRecord.rowCount,
        IPRData: viewIPRRecord.rows[0],
        facultyData: facultyData.rows,
        iprNmimsSchoolList: iprNmimsSchoolList.rows,
        iprNmimsCampusList: iprNmimsCampusList.rows,
        iprInventionList: iprInventionList.rows,
        iprStatusList: iprStatusList.rows,
        iprDocumentsList: iprDocumentsList.rows,
        sdgGoals : sdgGoals.rows,
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


module.exports.retriveExternalDetails = async(iprId, userName) => {
  console.log('iprId and userName in models ====>>>>>>', iprId, userName);
  
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
    ipr_faculty ipf ON f.id = ipf.faculty_id
    LEFT JOIN
    IPR  ipr ON ipf.ipr_id = ipr.id
    WHERE
        f.active = true AND
        f.faculty_type_id = 2 AND
        ipr.id = $1 AND f.created_by = $2
    `,
    values: [iprId, userName]
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

module.exports.deletedPatentExternalDetails = async(externalId, userName) => {
  console.log('externalId in models  =====>>>>>>>', externalId);

  let externalSql = {
    text : `UPDATE ipr_faculty SET active=false WHERE faculty_id = $1 AND created_by = $2`,
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


module.exports.deleteInternalFaculty = async(internalId, iprId, userName) => {
  console.log("internalId in models ====>>>>>>", internalId);

  const internalNmimsDetails = internalId.map(async(internalId) => {
    let sql = {
      text: `UPDATE  ipr_faculty  SET active = false WHERE faculty_id = $1 And ipr_id = $2`,
      values: [internalId, iprId],
    };
    console.log("sql ===>>>>>>>>>", sql);
    return await researchDbW.query(sql)

  })
 
  return Promise.all(internalNmimsDetails).then((result) => {
    return {
      status : "Done",
      message : "Record Deleted successfully",
      result : result
    } 
  }).catch((error) => {
    return {
      status: "Failed",
      message: error.message,
      errorCode: error.code,
    };
  });

}

//nmims school
module.exports.deleteIprSdgGoals = async (internalId, iprId, userName) => {
  console.log("internalId in models ====>>>>>>", internalId);

  const iprSdgGoals = internalId.map(async (id) => {
    let sql = {
      text: `UPDATE ipr_sdg_goals SET active = false WHERE sdg_goals_id = $1 And ipr_id = $2`,
      values: [id, iprId],
    };

    console.log('sql sdg goals ====>>>>>', sql);
    return await researchDbW.query(sql);
  });

  return await Promise.all(iprSdgGoals)
    .then((result) => {
      return {
        status: "Done",
        message: "Record Deleted successfully",
        result: result,
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

//nmims campus
module.exports.deleteIprPatentStatus = async(internalId, iprId, userName) => {

  console.log("internalId in models ====>>>>>>", internalId);
  const iprPatentStatus = internalId.map(async(internalId) => {
    let sql = {
      text: `UPDATE  ipr_status_type  SET active = false WHERE ipr_status_id = $1 And ipr_id = $2`,
      values: [internalId, iprId],
    };
    console.log("sql ===>>>>>>>>>", sql);
    return await researchDbW.query(sql);

  })
  
  return Promise.all(iprPatentStatus).then((result) => {
    return {
      status : "Done",
      message : "Record Deleted successfully",
      result : result
    } 
  }).catch((error) => {
    return {
      status: "Failed",
      message: error.message,
      errorCode: error.code,
    };
  });

}
//nmims policy cadre
module.exports.deletIprInventionType = async(internalId, iprId, userName) => {
  console.log('internalId in models ====>>>>>>', internalId);

  const iprInventionType = internalId.map(async(internalId) => {
    let sql = {
      text: `UPDATE  ipr_invention_type  SET active = false WHERE invention_type_id = $1 And ipr_id = $2`,
      values: [internalId, iprId]
    };

    console.log('sql ===>>>>>>', sql);
    return await researchDbW.query(sql);
  })

  return Promise.all(iprInventionType).then((result) => {
      return {
        status : "Done",
        message : "Record Deleted successfully",
        result : result
      } 
    }).catch((error) => {
      return {
        status: "Failed",
        message: error.message,
        errorCode: error.code,
      };
    });
} 
