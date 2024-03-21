const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchConferencePublication = async() => {
    let conferenceSql = {
        text : `SELECT * FROM  conference_presentation ORDER BY id `
    }

    let internalEmpSql = {
        text: `SELECT * FROM employee_table ORDER BY id`
    };
    
    let externalEmpSql = {
        text: `SELECT * FROM external_emp ORDER BY id`
    }

    console.log('externalEmpSql ===<>>>>', externalEmpSql);
    console.log('conferenceSql ===>>>', conferenceSql);
    console.log('internalEmpSql ===>>>', internalEmpSql)
    const conferencePromise = researchDbR.query(conferenceSql);
    const internalEmpPromise = researchDbR.query(internalEmpSql);
    const externalEmpPromise = researchDbR.query(externalEmpSql);

    const [conferencePublicationTable, internalEmpList, externalEmpList] = await Promise.all([conferencePromise, internalEmpPromise, externalEmpPromise]);

    return {
        conferenceDataList: conferencePublicationTable,
        internalEmpList: internalEmpList,
        externalEmpList : externalEmpList
    };
}

module.exports.viewConferenceData = async(conferenceId) => {
    let sql = {
        text : `SELECT * FROM conference_presentation WHERE id = $1`,
        values : [conferenceId]
    }
    return researchDbW.query(sql);
};

module.exports.insertConferencePublication = async(conferencePublications, conferenceDocument, conferenceProofFile, internalNamesString, externalNamesString) => {
    const authorNameString = internalNamesString + externalNamesString;
    const {nmimsCampus, nmimsSchool, titleOfPaper, conferenceName , conferencePlace, procedingDetail, conferenceType, isPresenter, organizingBody, 
        presentationAward, volAndIssueNo, issnIsbnNo, doiWebLinkId, sponsored, spentAmount, publicationDate} = conferencePublications;
        console.log('conferencePublications data in models' , conferencePublications);

    let conferenceSql = {
                text : `INSERT INTO conference_presentation( nmims_campus, nmims_school, title_of_paper, conference_name, conference_place, proceedings_detail, conference_type,
                        is_presenter,  organizing_body, award_for_presentation, vol_and_issue_no, issn_isbn_no, doi_id,
                        sponsored, spent_amount, publication_date, author_type, upload_proof, upload_files)
                       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING id `,
                values : [nmimsCampus, nmimsSchool, titleOfPaper, conferenceName , conferencePlace, procedingDetail, conferenceType, isPresenter, organizingBody, 
                    presentationAward, volAndIssueNo, issnIsbnNo, doiWebLinkId, sponsored, spentAmount, publicationDate, authorNameString,  conferenceDocument, conferenceProofFile]

           };
    // let conferenceProofQuery = conferenceProofFile ? 
    let externalEmpSql = externalNamesString ?  {
        text: `INSERT INTO external_emp(external_emp_name) VALUES ($1) RETURNING id`,
        values: [externalNamesString]
    } : null;
    console.log('externalEmpSql ===>>>>', externalEmpSql);
    console.log('conferenceSql ==>', conferenceSql);
    const conferenceTable = await researchDbW.query(conferenceSql);
    const externalEmpTable = await researchDbW.query(externalEmpSql);

    const promises = [conferenceTable, externalEmpTable];
    return Promise.all(promises).then(([conferenceTable, externalEmpTable]) => {
        return{status : 'Done' , message : " Record Inserted Successfully" , conferenceId : conferenceTable.rows[0].id, externalEmpId : externalEmpSql !== null ? externalEmpTable.rows[0].id : null,
        rowCount : conferenceTable.rowCount
            }
    })
    .catch((error) => {
        console.log('error ===>>>', error);
        return{status : 'Failed' , message : error.message , errorCode : error.ocde}
    })
};

module.exports.DeleteConference = async({conferenceId}) => {
    console.log('conference Id in models ==>>', conferenceId)
    let sql = {
        text : `DELETE FROM conference_presentation WHERE id =$1`,
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
    conferenceProofString, internalNamesString, externalNamesString, existingNameString) => {
    console.log('Id for Updation in models ==>>>', conferenceId);
    const authorNameString = internalNamesString + externalNamesString + existingNameString;

    const {titleOfPaper,  nameAndPlace, procedingDetail, publisherCategory, isPresenter, authorType, publicationDetails, 
        volAndIssueNo, issnIsbnNo, doiWebLink, awardForPresentation} = upadtedConferenceData;
    const conferenceFilesarray = {confernceDocString , conferenceProofString}
    console.log('conferenceFiles  =>>', conferenceFilesarray)
 
    const conferenceFieldToBeUpdate = [
        { field: 'title_of_paper', value: titleOfPaper },
        { field: 'name_and_place', value: nameAndPlace },
        { field: 'proceedings_detail', value: procedingDetail },
        {field: 'doi_weblink' ,value : doiWebLink},
        { field: 'publisher_category', value: publisherCategory },
        { field: 'is_presenter', value: isPresenter },
        { field: 'author_type', value: authorNameString },
        { field: 'publication_details', value: publicationDetails },
        { field: 'vol_and_issue_no', value: volAndIssueNo },
        { field: 'issn_isbn_no', value: issnIsbnNo },
        { field: 'upload_files', value: confernceDocString },
        { field: 'award_for_presentation', value: awardForPresentation },
        { field: 'upload_proof', value: conferenceProofString },
    ]

    console.log('conferenceFieldToBeUpdate ==>>', conferenceFieldToBeUpdate);
    const setStatements = conferenceFieldToBeUpdate
        .filter(fieldInfo => fieldInfo.value !== null)
        .map((fieldInfo, index) => {
            console.log('dataCondition ===>>>:::::', fieldInfo.value);
            console.log('index ==>>', index);
            console.log(`fieldInfo.field ===>>>> ::::: ${fieldInfo.field} = $${index + 2}`)
            console.log('condition == ==>>>::::', true);
            return { statement: `${fieldInfo.field} = $${index + 2}`, dataCondition: `${fieldInfo.value}` };
        });

    console.log('setStatements ==>>>', setStatements);

    const updatedConferenceData = conferenceFieldToBeUpdate.map(fieldInfo => {
        const condition = fieldInfo.value;
        if(condition){
            console.log('condition ==>>::::', condition)
            console.log(`Condition for ${fieldInfo.field}: ${condition}`);
        }
        else{
            return null
        }
        
        const value =  fieldInfo.value ;
        if(value){
            console.log(`Value for ${fieldInfo.field}: ${value}`);
            return value;
        }
    }).filter(value => value !== null);

    console.log('updatedConferenceData ====::::>>>', updatedConferenceData)
    
    const updatedConferenceValues = [
        conferenceId,
        ...updatedConferenceData,
    ];

    console.log('updatedConferenceValues ==>>>', updatedConferenceValues);

    const setStatementString = setStatements.map((item, index) => {
        if (item.dataCondition !== 'null') {
        return `${item.statement}`;
        } else {
        return '';
        }
    }).filter(Boolean).join(', ');
    
    console.log('setStatementString ==>>>', setStatementString);
    
    const conferenceSql = {
        text: `UPDATE conference_presentation SET ${setStatementString} WHERE id = $1`,
        values: updatedConferenceValues,
    };
    console.log('conferenceSql ==>>', conferenceSql);
    console.log('externalNamesString ===>>>>', externalNamesString)
    const externalEmpSql = externalNamesString ? {
        text: `INSERT INTO external_emp(external_emp_name) VALUES ($1) RETURNING id`,
        values: [externalNamesString]
    } : null;
    const conferenceTable = await researchDbW.query(conferenceSql);
    const externalEmpTable = externalEmpSql ? await researchDbW.query(externalEmpSql) : null;
    const promises = [conferenceTable, externalEmpTable];
    return Promise.all(promises).then(([conferenceTable, externalEmpTable]) => {
        console.log('conferenceTable ===>>>', conferenceTable);
        console.log('externalEmpTable ===>>>>', externalEmpTable)
        return {status : 'Done' , message : "Record Updated Successfully" , externalEmpId : externalEmpSql !== null ? externalEmpTable.rows[0].id : null, conferenceTable : conferenceTable}
    })
    .catch((error) => {
        console.log('error ===>>>', conferenceTable);
        console.log('err.message ===>>>', err.message)
        return{status : "Failed", message : error.message, errorCode : error.code}
    })
}

module.exports.viewConferencePublication = async(conferenceId) => {
    console.log('conference Id in models ', conferenceId);
    let sql = {
        text : `SELECT * FROM  conference_presentation WHERE id = $1`,
        values : [conferenceId]
    }
    return researchDbR.query(sql);
}