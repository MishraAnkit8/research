const { research_read_db, research_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const researchDbR = dbPoolManager.get('researchDbR', research_read_db);
const researchDbW = dbPoolManager.get('researchDbW', research_write_db);

module.exports.fetchConferencePublication = async() => {
    let sql = {
        text : `SELECT * FROM  conference_publications ORDER BY id `
    }
    return researchDbR.query(sql);
}

module.exports.viewConferenceData = async(conferenceId) => {
    let sql = {
        text : `SELECT * FROM conference_publications WHERE id = $1`,
        values : [conferenceId]
    }
    return researchDbW.query(sql);
};

module.exports.insertConferencePublication = async(conferencePublications, conferenceProofData, conferenceDocumentData) => {
    const {titleOfPaper,  nameAndPlace, procedingDetail, publisherCategory, isPresenter, authorType, publicationDetails, 
        volAndIssueNo, issnIsbnNo, doiWebLink, awardForPresentation} = conferencePublications;
        console.log('conferencePublications data in models' , conferencePublications);

    let sql = {
                text : `INSERT INTO conference_publications(title_of_paper,  name_and_place, proceedings_detail, publisher_category, is_presenter, author_type, publication_details, 
                       vol_and_issue_no, issn_isbn_no, doi_weblink, award_for_presentation,upload_files, upload_proof)
                       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id `,
                values : [titleOfPaper,  nameAndPlace, procedingDetail, publisherCategory, isPresenter, authorType, publicationDetails, 
                    volAndIssueNo, issnIsbnNo, doiWebLink, awardForPresentation, conferenceDocumentData, conferenceProofData]

           }
    console.log('sql ==>', sql)
    return researchDbW.query(sql);
};

module.exports.DeleteConference = async({conferenceId}) => {
    console.log('conference Id in models ==>>', conferenceId)
    let sql = {
        text : `DELETE FROM conference_publications WHERE id =$1`,
        values : [conferenceId]
    }
    return researchDbW.query(sql);
}

module.exports.updateConferencePublication = async(upadtedConferenceData, conferenceId, ConferenceFileToBeUpdate) => {
    console.log('Id for Updation in models ==>>>', conferenceId);
    const {titleOfPaper,  nameAndPlace, procedingDetail, publisherCategory, isPresenter, authorType, publicationDetails, 
        volAndIssueNo, issnIsbnNo, doiWebLink, awardForPresentation} = upadtedConferenceData;
    console.log('ConferenceFileToBeUpdate in models ===>>>', ConferenceFileToBeUpdate);
    
    const conferenceDocument = ConferenceFileToBeUpdate.confernceDocString ? ConferenceFileToBeUpdate.confernceDocString : null;
    console.log('conferenceDocument ==>> ::::', conferenceDocument)
    const conferenceProof = ConferenceFileToBeUpdate.conferenceProofString ? ConferenceFileToBeUpdate.conferenceProofString : null;

    const conferenceFilesarray = {conferenceDocument , conferenceProof}
    console.log('conferenceFiles  =>>', conferenceFilesarray)
 
    const conferenceFieldToBeUpdate = [
        { field: 'title_of_paper', value: titleOfPaper },
        { field: 'name_and_place', value: nameAndPlace },
        { field: 'proceedings_detail', value: procedingDetail },
        { field: 'publisher_category', value: publisherCategory },
        { field: 'is_presenter', value: isPresenter },
        { field: 'author_type', value: authorType },
        { field: 'publication_details', value: publicationDetails },
        { field: 'vol_and_issue_no', value: volAndIssueNo },
        { field: 'issn_isbn_no', value: issnIsbnNo },
        { field: 'upload_files', value: conferenceDocument },
        { field: 'award_for_presentation', value: awardForPresentation },
        { field: 'upload_proof', value: conferenceProof },
    ]

    console.log('conferenceFieldToBeUpdate ==>>', conferenceFieldToBeUpdate);
    const setStatements = conferenceFieldToBeUpdate
        .filter(fieldInfo => fieldInfo.value !== null)
        .map((fieldInfo, index) => {
            console.log('dataCondition ===>>>:::::', fieldInfo.value);
            console.log('index ==>>', index);
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