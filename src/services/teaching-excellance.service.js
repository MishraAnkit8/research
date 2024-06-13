const teachingExecellanceModel = require('../models/teaching-excellance.model');


module.exports.fetchTeachingExecellanceData = async(userName) => {
    const teachingExecellanceData = await teachingExecellanceModel.fetchTeachingExecellance(userName);
    return teachingExecellanceData;
}

module.exports.insertTeachingExecellance = async(teachingExecellance, files, userName) => {
    console.log('files in service ===>', files);
    // var pedagogyInnovationFileString = '';
    // var fdpProgramFileString = '';
    // var workShopFileString = '';
    // var invitingFacultyFileString = '';
    // var programOrientationFileString = '';
    // store keys means string as an array
    let arrayNameStringKeys = [
      'pedagogyInnovationFileString',
      'fdpProgramFileString',
      'workShopFileString',
      'invitingFacultyFileString',
      'programOrientationFileString'
    ];

    // store values means string as an array
    let fileArrayStringValues = [];

    const pedagogyInnovationFilesData = files.pedagogyInnovationFile;
    const fdpProgramFilesData = files.fdpProgramFile;
    const workShopFilesData = files.workShopFile;
    const invitingFacultyFilesData = files.invitingFacultyFile;
    const programOrientationFilesData = files.programOrientationFile;

    // files data array
    let filesDataArray = [
      pedagogyInnovationFilesData,
      fdpProgramFilesData,
      workShopFilesData,
      invitingFacultyFilesData,
      programOrientationFilesData
    ]
    console.log('filesDataArray in service ==>>>', filesDataArray)

    if(filesDataArray.length > 0){
      for(let file = 0; file <= filesDataArray.length - 1; file++){
        console.log('filesDataArray ==>>', filesDataArray[file])
          var fileStringName = '';
          console.log('fileArrayStringValues ===>>>', fileArrayStringValues[file]);
          for(let i = 0; i <= filesDataArray[file].length - 1; i++){
              if(filesDataArray[file][i].filename){
                console.log('filesDataArray[file][i].filename ==>>', filesDataArray[file][i].filename)
                fileStringName += filesDataArray[file][i].filename + ',';
                console.log('fileStringName ===>>>', fileStringName);
              }
          }

        fileArrayStringValues.push(fileStringName)
      }
    }
    //store file array nmae as key and valiue as file string
    let teachingFilesArrayData = {};
    for(let i = 0; i <= fileArrayStringValues.length - 1; i++){
      const key = arrayNameStringKeys[i];
      const value = fileArrayStringValues[i];
      teachingFilesArrayData[key] = value
    }

    console.log('arrayNameStringKeys  ===>>>', arrayNameStringKeys);
    console.log('fileArrayStringValues ===>>>', fileArrayStringValues);
    console.log('teachingFilesArrayData ===>>', teachingFilesArrayData);

    const teachingExecellanceData = await teachingExecellanceModel.insertTeachingExecellanceData(teachingExecellance, teachingFilesArrayData, userName);
    console.log('teachingExecellanceData ====>>>>>>>', teachingExecellanceData);
    if(teachingExecellanceData){
        return {
            status : 'done',
            teachingId : teachingExecellanceData.teachingId,
            teachingFilesArrayData,
            rowCount : teachingExecellanceData.rowCount,
            teachingExecellance : teachingExecellance

        }
    }
}

module.exports.updatedTeachingExecellance = async(teachingId, updatedTeachingExecellance, files, userName) => {
    console.log('files for updat in services ==>>>', files);
    let teachingDocumentToBeUpdate = {};
    console.log('length of files ==>>>', Object.keys(files).length);

    if (Object.keys(files).length > 0) {
      let arrayNameStringKeys = [
        'pedagogyInnovationFileString',
        'fdpProgramFileString',
        'workShopFileString',
        'invitingFacultyFileString',
        'programOrientationFileString'
      ];

      // Store values as an array
      let fileArrayStringValues = [];

      const pedagogyInnovationFilesData = files.pedagogyInnovationFile || [];
      const fdpProgramFilesData = files.fdpProgramFile || [];
      const workShopFilesData = files.workShopFile || [];
      const invitingFacultyFilesData = files.invitingFacultyFile || [];
      const programOrientationFilesData = files.programOrientationFile || [];

      // Files data array
      let filesDataArray = [
        pedagogyInnovationFilesData,
        fdpProgramFilesData,
        workShopFilesData,
        invitingFacultyFilesData,
        programOrientationFilesData
      ];

      console.log("filesDataArray in service ==>>>", filesDataArray);

      // If values are present, push string value in fileArrayStringValues
      for (let file = 0; file < filesDataArray.length; file++) {
        let fileStringName = "";
        console.log("filesDataArray ==>>", filesDataArray[file]);

        if (filesDataArray[file].length > 0) {
          for (let i = 0; i < filesDataArray[file].length; i++) {
            if (filesDataArray[file][i].filename) {
              console.log("filesDataArray[file][i].filename ==>>", filesDataArray[file][i].filename);
              fileStringName += filesDataArray[file][i].filename + ",";
              console.log("fileStringName ===>>>", fileStringName);
            }
          }
          // Remove trailing comma
          fileStringName = fileStringName.slice(0, -1);
        }
        fileArrayStringValues.push(fileStringName);
      }

      // Store file array name as key and value as file string
      for (let i = 0; i < fileArrayStringValues.length; i++) {
        const key = arrayNameStringKeys[i];
        const value = fileArrayStringValues[i];
        teachingDocumentToBeUpdate[key] = value;
      }

      console.log('updated arrayNameStringKeys ===>>>', arrayNameStringKeys);
      console.log('updated fileArrayStringValues ===>>>', fileArrayStringValues);
      console.log('updated teachingFilesArrayData ===>>', teachingDocumentToBeUpdate);
    }
    const updatedTeachingExecellanceData = await teachingExecellanceModel.updateTeachingExecellance(teachingId, updatedTeachingExecellance, teachingDocumentToBeUpdate, userName);
    console.log('updated data in services ==>>>::::', updatedTeachingExecellanceData);
    if(updatedTeachingExecellanceData && updatedTeachingExecellanceData.rowCount === 1){
        return {
            status : 'done',
            massage : ' updated successfully',
            teachingDocumentToBeUpdate
        }
    }    

}

module.exports.deleteTeachingExecellance = async (teachingId) => {
    console.log('Id in Service ==>', teachingId);
    const teachingExecellance = await teachingExecellanceModel.deleteTeachingExecellance(teachingId);
    if(teachingExecellance.rowCount === 1 && teachingExecellance){
        return{
            status : 'done',
            massage : 'deleted successfully'
        }
    }
}

module.exports.viewTeachingExecellance = async(teachingId) => {
    const teachingExecellanceViewData = await teachingExecellanceModel.teachingExecellanceView(teachingId);
    console.log('teachingExecellanceViewData' , teachingExecellanceViewData.rows[0]);
    if(teachingExecellanceViewData && teachingExecellanceViewData.rowCount === 1){
        return teachingExecellanceViewData.rows[0]
    }
}

