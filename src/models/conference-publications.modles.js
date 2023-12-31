const { autoriders_read_db, autoriders_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const autoDbR = dbPoolManager.get('autoDbR', autoriders_read_db);
const autoDbW = dbPoolManager.get('autoDbW', autoriders_write_db);

module.exports.fetchConferencePublication = async() => {
    let sql = {
        text : `SELECT * FROM  conference_publications ORDER BY id `
    }
    return autoDbR.query(sql);
}

module.exports.viewConferenceData = async(conferenceId) => {
    let sql = {
        text : `SELECT * FROM conference_publications WHERE id = $1`,
        values : [conferenceId]
    }
    return autoDbW.query(sql);
};

module.exports.insertConferencePublication = async(conferencePublications, conferenceProof, conferenceDocument) => {
    const {titleOfPaper,  nameAndPlace, procedingDetail, publisherCategory, isPresenter, authorType, publicationDetails, 
        volAndIssueNo, issnIsbnNo, doiWebLink, awardForPresentation} = conferencePublications;
        console.log('conferencePublications data in models' , conferencePublications);

    let sql = {
                text : `INSERT INTO conference_publications(title_of_paper,  name_and_place, proceedings_detail, publisher_category, is_presenter, author_type, publication_details, 
                       vol_and_issue_no, issn_isbn_no, doi_weblink, award_for_presentation,upload_files, upload_proof)
                       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id `,
                values : [titleOfPaper,  nameAndPlace, procedingDetail, publisherCategory, isPresenter, authorType, publicationDetails, 
                    volAndIssueNo, issnIsbnNo, doiWebLink, awardForPresentation, conferenceDocument, conferenceProof]

           }
           console.log('sql ==>', sql)
    return autoDbW.query(sql);
};

module.exports.DeleteConference = async({conferenceId}) => {
    console.log('conference Id in models ==>>', conferenceId)
    let sql = {
        text : `DELETE FROM conference_publications WHERE id =$1`,
        values : [conferenceId]
    }
    return autoDbW.query(sql);
}

module.exports.updateConferencePublication = async(upadtedConferenceData, conferenceId, conferenceDocument, conferenceProof) => {
    console.log('Id for Updation in models ==>>>', conferenceId);
    console.log('conferenceDocument in models ==>>', conferenceDocument[0].filename);
    const {titleOfPaper,  nameAndPlace, procedingDetail, publisherCategory, isPresenter, authorType, publicationDetails, 
        volAndIssueNo, issnIsbnNo, doiWebLink, awardForPresentation} = upadtedConferenceData;
        console.log('upadtedConferenceData in models  ==>>', upadtedConferenceData)
    let sql = {
        text : `UPDATE conference_publications SET  title_of_paper = $2, name_and_place = $3, proceedings_detail = $4, publisher_category =$5, is_presenter = $6,
                author_type = $7, publication_details = $8, vol_and_issue_no = $9, issn_isbn_no = $10, doi_weblink = $11, award_for_presentation = $12, upload_files = $13, upload_proof = $14 WHERE id = $1 `,
        values : [conferenceId, titleOfPaper,  nameAndPlace, procedingDetail, publisherCategory, isPresenter, authorType, publicationDetails, 
            volAndIssueNo, issnIsbnNo, doiWebLink, awardForPresentation, conferenceDocument[0].filename, conferenceProof[0].filename]          

    }
     return autoDbW.query(sql);

}

module.exports.viewConferencePublication = async(conferenceId) => {
    console.log('conference Id in models ', conferenceId);
    let sql = {
        text : `SELECT * FROM  conference_publications WHERE id = $1`,
        values : [conferenceId]
    }
    return autoDbR.query(sql);
}