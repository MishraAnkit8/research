const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchConferencePublication = async(userName) => {
    let conferenceSql = {
        text : `SELECT * FROM  conference_presentation WHERE created_by = $1 and active=true ORDER BY id desc`,
        values : [userName]
    }

    let internalEmpSql = {
      text: `SELECT * FROM faculties where active=true AND faculty_type_id=1  ORDER BY id`,
    };
    
    let externalEmpSql = {
        text: `SELECT * FROM external_emp where active=true ORDER BY id`
    }

    console.log('externalEmpSql ===<>>>>', externalEmpSql);
    console.log('conferenceSql ===>>>', conferenceSql);
    console.log('internalEmpSql ===>>>', internalEmpSql)
    const conferencePromise = await researchDbR.query(conferenceSql);
    const internalEmpPromise = await researchDbR.query(internalEmpSql);
    const externalEmpPromise = await researchDbR.query(externalEmpSql);
    const promises = [conferencePromise, internalEmpPromise, externalEmpPromise]

   return Promise.all(promises).then(([conferencePromise, internalEmpPromise, externalEmpPromise]) => {
    return {
        conferenceDataList: conferencePromise.rows,
        internalEmpList: internalEmpPromise.rows,
        externalEmpList : externalEmpPromise.rows,
        rowCount : conferencePromise.rowCount
    };
   }) .catch((error) => {
    return{status : "Failed" , message : error.message , errorCode : error.code}
    }) 

}

// module.exports.viewConferenceData = async(conferenceId, userName) => {
//     let sql = {
//         text : `SELECT * FROM conference_presentation WHERE  id = $1 AND created_by = $2`,
//         values : [conferenceId, userName]
//     }
//     return researchDbW.query(sql);
// };

module.exports.insertConferencePublication = async (conferencePublications, conferenceDocument, conferenceProofFile, internalNamesString, externalNamesString, userName) => {
    const authorNameString = internalNamesString + externalNamesString;
    const { nmimsCampus, nmimsSchool, titleOfPaper, conferenceName, conferencePlace, procedingDetail, conferenceType, isPresenter, organizingBody,
        presentationAward, volAndIssueNo, issnIsbnNo, doiWebLinkId, sponsored, spentAmount, publicationDate, presentingAuthor } = conferencePublications;
    console.log('conferencePublications data in models', conferencePublications);
    const doiBookIdParsed = doiWebLinkId === "" ? null : parseInt(doiWebLinkId, 10);
    const conferenceProofFilesString = conferenceProofFile === "" ? null : conferenceProofFile;

    let conferenceSql = {
        text: `INSERT INTO conference_presentation(nmims_campus, nmims_school, title_of_paper, conference_name, conference_place, proceedings_detail, conference_type,
                        is_presenter, organizing_body, award_for_presentation, vol_and_issue_no, issn_isbn_no, doi_id,
                        sponsored, spent_amount, publication_date, presenting_authors, author_type, upload_proof, upload_files, created_by)
                       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING id `,
        values: [nmimsCampus, nmimsSchool, titleOfPaper, conferenceName, conferencePlace, procedingDetail, conferenceType, isPresenter, organizingBody,
            presentationAward, volAndIssueNo, issnIsbnNo, doiBookIdParsed, sponsored, spentAmount, publicationDate, presentingAuthor, authorNameString, conferenceDocument, conferenceProofFilesString, userName]

    };
    // let conferenceProofQuery = conferenceProofFile ? 
    let externalEmpSql = externalNamesString ? {
        text: `INSERT INTO external_emp(external_emp_name) VALUES ($1) RETURNING id`,
        values: [externalNamesString]
    } : null;
    console.log('externalEmpSql ===>>>>', externalEmpSql);
    console.log('conferenceSql ==>', conferenceSql);
    const conferenceTablePromise = researchDbW.query(conferenceSql)
        .then(conferenceTable => {
            return conferenceTable;
        })
        .catch(error => {
            console.log('Error code:', error.code);
            throw {
                status : 'Failed',
                message : error.constraint === 'conference_presentation_doi_id_key'? 'The DOI/Weblink of paper ID provided already exists. Please provide a unique DOI/Weblink of paper ID' : error.message,
                errorCode : error.code
            }
        });

    const externalEmpTablePromise = externalNamesString ? researchDbW.query(externalEmpSql) : Promise.resolve(null);

    return Promise.all([conferenceTablePromise, externalEmpTablePromise])
        .then(([conferenceTable, externalEmpTable]) => {
            return {
                status: 'Done',
                message: " Record Inserted Successfully",
                conferenceId: conferenceTable.rows[0].id,
                externalEmpId: externalEmpSql !== null ? externalEmpTable.rows[0].id : null,
                rowCount: conferenceTable.rowCount
            };
        })
        .catch(error => {
            console.log('error ===>>>', error);
            return error
        });
};



module.exports.DeleteConference = async({conferenceId}) => {
    console.log('conference Id in models ==>>', conferenceId)
    let sql = {
        // text : `DELETE FROM conference_presentation WHERE id =$1`,
        text : `update conference_presentation set active=false WHERE id =$1`,
        values : [conferenceId]
    }
    console.log('sql ===>>>', sql)
    const deletedRecord = await researchDbW.query(sql);
    const promises = [deletedRecord];
    return Promise.all(promises).then(([deletedRecord]) => {
        return  { status : "Done" , message : "Record Deleted Successfully", rowCount : deletedRecord.rowCount}
    })
    .catch((error) => {
        return{status : "Failed" , message : error.message , errorCode : error.code}
    })
}

module.exports.updateConferencePublication = async( upadtedConferenceData, conferenceId, confernceDocString,
    conferenceProofString, internalNamesString, externalNamesString, existingNameString, userName) => {
    console.log('Id for Updation in models ==>>>', conferenceId);
    const authorNameString = internalNamesString + externalNamesString + existingNameString;

    const {nmimsCampus, nmimsSchool, titleOfPaper, conferenceName, conferencePlace, procedingDetail, conferenceType, isPresenter, organizingBody,
        presentationAward, volAndIssueNo, issnIsbnNo, doiWebLinkId, sponsored, spentAmount, publicationDate, presentingAuthor} = upadtedConferenceData;
    const conferenceFilesarray = {confernceDocString , conferenceProofString}
    console.log('conferenceFiles  =>>', conferenceFilesarray);

    const doiBookIdParsed = doiWebLinkId === "" ? null : parseInt(doiWebLinkId, 10);
    const conferenceDocument = confernceDocString || null;
    const conferenceProofe  = conferenceProofString || null
    let sql  =  { 
        text :`UPDATE conference_presentation SET nmims_campus = $2, nmims_school = $3, title_of_paper = $4, conference_name = $5, conference_place = $6, proceedings_detail = $7, conference_type = $8,
            is_presenter = $9, organizing_body = $10, award_for_presentation = $11, vol_and_issue_no = $12, issn_isbn_no = $13, doi_id = $14,
            sponsored = $15, spent_amount = $16, publication_date = $17, presenting_authors = $18, author_type = $19, upload_proof = $20, upload_files = $21,  updated_by = $22 WHERE id = $1`,
        values : [conferenceId, nmimsCampus, nmimsSchool, titleOfPaper, conferenceName, conferencePlace, procedingDetail, conferenceType, isPresenter, organizingBody,
            presentationAward, volAndIssueNo, issnIsbnNo, doiBookIdParsed, sponsored, spentAmount, publicationDate, presentingAuthor, authorNameString, conferenceProofe, conferenceDocument, userName]
    }

    // const conferenceFieldToBeUpdate = [
    //     { field: 'nmims_campus', value: nmimsCampus },
    //     { field: 'nmims_school', value: nmimsSchool },
    //     { field: 'title_of_paper', value: titleOfPaper },
    //     { field: 'conference_name', value: conferenceName },
    //     { field: 'conference_place', value: conferencePlace },
    //     {field: 'proceedings_detail' ,value : procedingDetail},
    //     { field: 'conference_type', value: conferenceType },
    //     { field: 'is_presenter', value: isPresenter },
    //     { field: 'organizing_body', value: organizingBody },
    //     { field: 'award_for_presentation', value: presentationAward },
    //     { field: 'vol_and_issue_no', value: volAndIssueNo },
    //     { field: 'issn_isbn_no', value: issnIsbnNo },
    //     { field: 'doi_id', value: doiWebLinkId },
    //     { field: 'sponsored', value: sponsored },
    //     { field: 'spent_amount', value: spentAmount },
    //     { field: 'publication_date', value: publicationDate },
    //     { field: 'presenting_authors', value: presentingAuthor },
    //     { field: 'author_type', value: authorNameString },
    //     { field: 'upload_proof', value: conferenceProofString },
    //     { field: 'upload_files', value: confernceDocString },
    // ]

    // console.log('conferenceFieldToBeUpdate ==>>', conferenceFieldToBeUpdate);
    // const setStatements = conferenceFieldToBeUpdate
    //     .filter(fieldInfo => fieldInfo.value !== null)
    //     .map((fieldInfo, index) => {
    //         console.log('dataCondition ===>>>:::::', fieldInfo.value);
    //         console.log('index ==>>', index);
    //         console.log(`fieldInfo.field ===>>>> ::::: ${fieldInfo.field} = $${index + 2}`)
    //         console.log('condition == ==>>>::::', true);
    //         return { statement: `${fieldInfo.field} = $${index + 2}`, dataCondition: `${fieldInfo.value}` };
    //     });

    // console.log('setStatements ==>>>', setStatements);

    // const updatedConferenceData = conferenceFieldToBeUpdate.map(fieldInfo => {
    //     const condition = fieldInfo.value;
    //     if(condition){
    //         console.log('condition ==>>::::', condition)
    //         console.log(`Condition for ${fieldInfo.field}: ${condition}`);
    //     }
    //     else{
    //         return null
    //     }
        
    //     const value =  fieldInfo.value ;
    //     if(value){
    //         console.log(`Value for ${fieldInfo.field}: ${value}`);
    //         return value;
    //     }
    // }).filter(value => value !== null);

    // console.log('updatedConferenceData ====::::>>>', updatedConferenceData)
    
    // const updatedConferenceValues = [
    //     conferenceId,
    //     ...updatedConferenceData,
    // ];

    // console.log('updatedConferenceValues ==>>>', updatedConferenceValues);

    // const setStatementString = setStatements.map((item, index) => {
    //     if (item.dataCondition !== 'null') {
    //     return `${item.statement}`;
    //     } else {
    //     return '';
    //     }
    // }).filter(Boolean).join(', ');
    
    // console.log('setStatementString ==>>>', setStatementString);
    
    // const conferenceSql = {
    //     text: `UPDATE conference_presentation SET ${setStatementString} WHERE id = $1`,
    //     values: updatedConferenceValues,
    // };
    // console.log('conferenceSql ==>>', conferenceSql);
    
    console.log('externalNamesString ===>>>>', externalNamesString)
    const externalEmpSql = externalNamesString ? {
        text: `INSERT INTO external_emp(external_emp_name) VALUES ($1) RETURNING id`,
        values: [externalNamesString]
    } : null;


    const conferenceTablePromise = researchDbW.query(sql)
        .then(conferenceTable => {
            return conferenceTable;
        })
        .catch(error => {
            console.log('Error code:', error.code);
            throw {
                status : 'Failed',
                message : error.constraint === 'conference_presentation_doi_id_key'? 'The DOI/Weblink of paper ID provided already exists. Please provide a unique DOI/Weblink of paper ID' : error.message,
                errorCode : error.code
            }
        });

    const externalEmpTablePromise = externalNamesString ? researchDbW.query(externalEmpSql) : Promise.resolve(null);

    return Promise.all([conferenceTablePromise, externalEmpTablePromise])
        .then(([conferenceTable, externalEmpTable]) => {
            return {
                status: 'Done',
                message: " Record Updated Successfully",
                externalEmpId: externalEmpSql !== null ? externalEmpTable.rows[0].id : null,
                rowCount: conferenceTable.rowCount
            };
        })
        .catch(error => {
            console.log('error ===>>>', error);
            return error
        });
}

module.exports.viewConferencePublication = async(conferenceId, userName) => {
    console.log('conference Id in models ', conferenceId);
    let sql = {
        text : `SELECT nmims_campus, nmims_school, title_of_paper, conference_name, conference_place, proceedings_detail, conference_type,
        is_presenter, organizing_body, award_for_presentation, vol_and_issue_no, issn_isbn_no, doi_id,
        sponsored, spent_amount, publication_date, presenting_authors, author_type, upload_proof, upload_files FROM  conference_presentation WHERE  id = $1 and active=true AND created_by = $2`,
        values : [conferenceId, userName]
    }
    // return researchDbR.query(sql);
    console.log('sql ===>>>', sql)
    const conferencePresentation = await researchDbW.query(sql);
    const response = conferencePresentation.rowCount > 0 
        ? {
            status: "Done",
            message: "Record Fetched Successfully",
            rowCount: conferencePresentation.rowCount,
            conferencePresentation : conferencePresentation.rows
        }
        : {
            status: "Failed",
            message: error?.message ?? "An error occurred during record fetching.",
            errorCode: error?.code
        };
    
    return response;
}