const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchConferencePublication = async() => {
    let conferenceSql = {
        text : `SELECT * FROM  conference_publications ORDER BY id `
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
        text : `SELECT * FROM conference_publications WHERE id = $1`,
        values : [conferenceId]
    }
    return researchDbW.query(sql);
};

module.exports.insertConferencePublication = async(conferencePublications, conferenceDocument, conferenceProofFile, internalNamesString, externalNamesString) => {
    const authorNameString = internalNamesString + externalNamesString;
    const {titleOfPaper,  nameAndPlace, procedingDetail, publisherCategory, isPresenter, publicationDetails, 
        volAndIssueNo, issnIsbnNo, doiWebLink, awardForPresentation} = conferencePublications;
        console.log('conferencePublications data in models' , conferencePublications);

    let conferenceSql = {
                text : `INSERT INTO conference_publications(title_of_paper,  name_and_place, proceedings_detail, publisher_category, is_presenter, author_type, publication_details, 
                       vol_and_issue_no, issn_isbn_no, doi_weblink, award_for_presentation,upload_files, upload_proof)
                       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id `,
                values : [titleOfPaper,  nameAndPlace, procedingDetail, publisherCategory, isPresenter, authorNameString, publicationDetails, 
                    volAndIssueNo, issnIsbnNo, doiWebLink, awardForPresentation, conferenceDocument, conferenceProofFile]

           };
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
        text : `DELETE FROM conference_publications WHERE id =$1`,
        values : [conferenceId]
    }
    return researchDbW.query(sql);
}

module.exports.updateConferencePublication = async( upadtedConferenceData, conferenceId, confernceDocString,
    conferenceProofString, internalNamesString, externalNamesString, existingNameString) => {
    console.log('Id for Updation in models ==>>>', conferenceId);
    const authorNameString = internalNamesString + externalNamesString + existingNameString;

    const {titleOfPaper,  nameAndPlace, procedingDetail, publisherCategory, isPresenter, authorType, publicationDetails, 
        volAndIssueNo, issnIsbnNo, doiWebLink, awardForPresentation} = upadtedConferenceData;
    // console.log('ConferenceFileToBeUpdate in models ===>>>', ConferenceFileToBeUpdate);
    
    // const conferenceDocument = ConferenceFileToBeUpdate.confernceDocString ? ConferenceFileToBeUpdate.confernceDocString : null;
    // console.log('conferenceDocument ==>> ::::', conferenceDocument)
    // const conferenceProof = ConferenceFileToBeUpdate.conferenceProofString ? ConferenceFileToBeUpdate.conferenceProofString : null;

    const conferenceFilesarray = {confernceDocString , conferenceProofString}
    console.log('conferenceFiles  =>>', conferenceFilesarray)
 
    const conferenceFieldToBeUpdate = [
        { field: 'title_of_paper', value: titleOfPaper },
        { field: 'name_and_place', value: nameAndPlace },
        { field: 'proceedings_detail', value: procedingDetail },
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
            console.log('fieldInfo.field ====>>>>>', fieldInfo.field);
            console.log('condition == ==>>>::::', true);
            return { statement: `${fieldInfo.field} = $${index + 2}`, dataCondition: `${fieldInfo.value}` };
        });

    console.log('setStatements ==>>>', setStatements);

    const updateDocument = conferenceFieldToBeUpdate.map(fieldInfo => {
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

    console.log('updateDocument ====::::>>>', updateDocument)
    
    const updateConferenceData = [
        conferenceId,
        ...updateDocument,
    ];

    console.log('updateConferenceData ==>>>', updateConferenceData);

    const setStatementString = setStatements.map((item, index) => {
        if (item.dataCondition !== 'null') {
        return `${item.statement}`;
        } else {
        return '';
        }
    }).filter(Boolean).join(', ');
    
    console.log('setStatementString ==>>>', setStatementString);
    
    const sql = {
        text: `UPDATE conference_publications SET ${setStatementString} WHERE id = $1`,
        values: updateConferenceData,
    };

    console.log('sql ==>>', sql);
    return researchDbW.query(sql);

}

module.exports.viewConferencePublication = async(conferenceId) => {
    console.log('conference Id in models ', conferenceId);
    let sql = {
        text : `SELECT * FROM  conference_publications WHERE id = $1`,
        values : [conferenceId]
    }
    return researchDbR.query(sql);
}