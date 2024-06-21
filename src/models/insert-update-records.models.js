const {
    research_read_db,
    research_write_db,
  } = require("../../config/db-configs");
  const dbPoolManager = require("../../config/db-pool-manager");
  const moment = require("moment");

const researchDbR = dbPoolManager.get("researchDbR", research_read_db);
const researchDbW = dbPoolManager.get("researchDbW", research_write_db);

module.exports.insertRecordIntoDbByUsingFunction = async (tableName, insertField, valuesData, userName) => {
  console.log('inside insertRecordIntoDb tableName folder ====>>>>>>', tableName);
  console.log('inside insertRecordIntoDb insertField folder ====>>>>>>', insertField);
  console.log('inside insertRecordIntoDb valuesData folder ====>>>>>>', valuesData);
  console.log('inside insertRecordIntoDb userName folder ====>>>>>>', userName);

  // Add the new fields
  const additionalFields = ['created_at', 'updated_at', 'active'];
  const currentTimestamp = moment().toISOString();
  const activeValue = true;

  const allFieldsToBeInsert = [...insertField, ...additionalFields];
  const allValuesToBeInsert = [
    ...valuesData,
    currentTimestamp,
    currentTimestamp,
    activeValue 
  ];

  // Construct the SQL query to call the PostgreSQL function
  const sqlQuery = {
    text: 'SELECT insert_single_value($1, $2, $3)',
    values: [
      tableName,
      allFieldsToBeInsert.join(', '),
      allValuesToBeInsert,
    ],
  };

  console.log('sqlQuery ====>>>>>>', sqlQuery);

  try {
    const result = await researchDbW.query(sqlQuery);

    const insertedId = result.rows[0].insert_single_value;
    console.log('Inserted Record ID ====>>>>>>', insertedId);

    return {
      status: 'Done',
      message: 'Record Inserted Successfully',
      insertedId: insertedId,
    };
  } catch (error) {
    console.error('Error inserting record ====>>>>>>', error);

    if (error.code === '23505') { 
      return {
        status: 'Failed',
        message: 'Unique constraint violation. Duplicate record exists.',
        errorCode: error.code,
      };
    }

    return {
      status: 'Failed',
      message: error.message,
      errorCode: error.code,
    };
  }
};

module.exports.insertRecordIntoMainDb = async (tableName, insertField, valuesData, userName) => {
  console.log('inside insertRecordIntoDb tableName folder ====>>>>>>', tableName);
  console.log('inside insertRecordIntoDb insertField folder ====>>>>>>', insertField);
  console.log('inside insertRecordIntoDb valuesData folder ====>>>>>>', valuesData);
  console.log('inside insertRecordIntoDb userName folder ====>>>>>>', userName);

  // Add the new fields
  const additionalFields = ['created_at', 'updated_at', 'active'];
  const currentTimestamp = new Date().toISOString();
  const activeValue = true;

  const allFieldsToBeInsert = [...insertField, ...additionalFields];

  const placeholders = allFieldsToBeInsert.map((_, index) => `$${index + 1}`).join(', ');
  console.log('placeholders ===>>>>', placeholders);

  const allValuesToBeInsert = [
    ...valuesData,
    currentTimestamp,
    currentTimestamp,
    activeValue 
  ];

  const sqlQuery = {
    text: `INSERT INTO ${tableName} (${allFieldsToBeInsert.join(', ')}) VALUES (${placeholders}) RETURNING id`,
    values: allValuesToBeInsert,
  };

  console.log('sqlQuery ====>>>>>>', sqlQuery);

  try {
    const result = await researchDbW.query(sqlQuery);

    const insertedId = result.rows[0].id;
    console.log('Inserted Record ID ====>>>>>>', insertedId);

    return {
      status: 'Done',
      message: 'Record Inserted Successfully',
      insertedId: insertedId,
    };
  } catch (error) {
    console.error('Error inserting record ====>>>>>>', error);

    if (error.code === '23505') { 
      return {
        status: 'Failed',
        message: 'Unique constraint violation. Duplicate record exists.',
        errorCode: error.code,
      };
    }

    return {
      status: 'Failed',
      message: error.message,
      errorCode: error.code,
    };
  }
};
  

module.exports.insertExternalFacultyRecord = async (tableName, insertField, arrayData, userName) => {
    console.log('inside insertRecordIntoDb tableName ====>>>>>>', tableName);
    console.log('inside insertRecordIntoDb insertField ====>>>>>>', insertField);
    console.log('inside insertRecordIntoDb valuesData ====>>>>>>', arrayData);
    console.log('inside insertRecordIntoDb userName ====>>>>>>', userName);
  
    // Add the new fields
    const additionalFields = ['created_at', 'updated_at', 'active'];
    const currentTimestamp = new Date().toISOString(); 
    const activeValue = true;
  
    const allInsertFields = [...insertField, ...additionalFields];
  
    const placeholders = allInsertFields.map((_, index) => `$${index + 1}`).join(', ');
  
    try {
      const insertedIds = [];
  
      for (let valuesData of arrayData) {
        const facultyTypeId = 2;
        const completeValues = [
          facultyTypeId, 
          ...valuesData, 
          userName, 
          currentTimestamp, 
          currentTimestamp, 
          activeValue
        ];
  
        const sqlQuery = {
          text: `INSERT INTO ${tableName} (${allInsertFields.join(', ')}) VALUES (${placeholders}) RETURNING id`,
          values: completeValues,
        };
  
        console.log('sqlQuery ====>>>>>>', sqlQuery);
  
        const result = await researchDbW.query(sqlQuery);
  
        const supportId = result.rows[0].id;
        console.log('Inserted Record ID ====>>>>>>', supportId);
  
        insertedIds.push(supportId);
      }
  
      return {
        status: 'Done',
        message: 'Records Inserted Successfully',
        externalId: insertedIds,
      };
    } catch (error) {
      console.error('Error inserting records ====>>>>>>', error);
  
      return {
        status: 'Failed',
        message: error.message,
        errorCode: error.code,
      };
    }
  };
  

  module.exports.insertIntoRelationalDb = async (tableName, fieldsName, mainId, idContainerArray, userName) => {
    console.log('inside insertIntoRelationalDb tableName ====>>>>>>', tableName);
    console.log('inside insertIntoRelationalDb fieldsName ====>>>>>>', fieldsName);
    console.log('inside insertIntoRelationalDb idContainerArray ====>>>>>>', idContainerArray);
    console.log('inside insertIntoRelationalDb userName ====>>>>>>', userName);
    console.log('inside insertIntoRelationalDb mainId ====>>>>>>', mainId);
  
    try {
      const insertedIds = [];
  
      for (let id of idContainerArray) {
        const fields = [...fieldsName, 'created_at', 'updated_at', 'active'];
        const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
  
        const currentTimestamp = new Date().toISOString();
        const activeValue = true;
  
        const completeValues = [
          mainId,
          id,
          userName,
          currentTimestamp,
          currentTimestamp,
          activeValue
        ];
  
        const sqlQuery = {
          text: `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${placeholders}) RETURNING id`,
          values: completeValues,
        };
  
        console.log('sqlQuery ====>>>>>>', sqlQuery);
  
        const result = await researchDbW.query(sqlQuery);
  
        const insertedId = result.rows[0].id;
        console.log('Inserted Record ID ====>>>>>>', insertedId);
  
        insertedIds.push(insertedId);
      }
  
      return {
        status: 'Done',
        message: 'Records Inserted Successfully',
        insertedIds: insertedIds,
      };
    } catch (error) {
      console.error('Error inserting records ====>>>>>>', error);
  
      return {
        status: 'Failed',
        message: error.message,
        errorCode: error.code,
      };
    }
};


module.exports.updateFieldWithOutFiles = async (tableName, updateField, valuesData, userName) => {
    console.log('inside updateFieldWithOutFiles tableName folder ====>>>>>>', tableName);
    console.log('inside updateFieldWithOutFiles updateField folder ====>>>>>>', updateField);
    console.log('inside updateFieldWithOutFiles valuesData folder ====>>>>>>', valuesData);
    console.log('inside updateFieldWithOutFiles userName folder ====>>>>>>', userName);

    const setFields = updateField.map((field, index) => `${field} = $${index + 1}`).join(', ');

    // Append the userName to valuesData

    const sqlQuery = {
        text: `UPDATE ${tableName} SET ${setFields}, updated_at = NOW(), active = true WHERE id = $${valuesData.length} RETURNING id`,
        values: valuesData
    };

    console.log('sqlQuery ====>>>>>>', sqlQuery);

    try {
        const result = await researchDbW.query(sqlQuery);
        const updatedId = result.rows[0].id;
        console.log('Updated Record ID ====>>>>>>', updatedId);

        return {
            status: 'Done',
            message: 'Record Updated Successfully',
            updatedId: updatedId
        };
    } catch (error) {
        console.error('Error updating record ====>>>>>>', error);
        if (error.code === '23505') { 
          return {
            status: 'Failed',
            message: 'Unique constraint violation. Duplicate record exists.',
            errorCode: error.code,
          }
         }

        return {
            status: 'Failed',
            message: error.message,
            errorCode: error.code
        };
    }
};


module.exports.updateFieldWithFiles = async (tableName, updateField, valuesData, userName) => {
    console.log('inside updateFieldWithFiles tableName folder ====>>>>>>', tableName);
    console.log('inside updateFieldWithFiles updateField folder ====>>>>>>', updateField);
    console.log('inside updateFieldWithFiles valuesData folder ====>>>>>>', valuesData);
    console.log('inside updateFieldWithFiles userName folder ====>>>>>>', userName);

    const setFields = updateField.map((field, index) => `${field} = $${index + 1}`).join(', ');

    // Append the userName to valuesData

    const sqlQuery = {
        text: `UPDATE ${tableName} SET ${setFields}, updated_at = NOW(), active = true WHERE id = $${valuesData.length} RETURNING id`,
        values: valuesData
    };

    console.log('sqlQuery ====>>>>>>', sqlQuery);

    try {
        const result = await researchDbW.query(sqlQuery);
        const updatedId = result.rows[0].id;
        console.log('Updated Record ID ====>>>>>>', updatedId);

        return {
            status: 'Done',
            message: 'Record Updated Successfully',
            updatedId: updatedId
        };
    } catch (error) {
        console.error('Error updating record ====>>>>>>', error);
        if (error.code === '23505') { 
          return {
            status: 'Failed',
            message: 'Unique constraint violation. Duplicate record exists.',
            errorCode: error.code,
          };
        }

        return {
            status: 'Failed',
            message: error.message,
            errorCode: error.code
        };
    }

} 


module.exports.updateExternalFacultyDetails = async (tableName, updateField, arrayData, userName) => {
    console.log('inside updateExternalFacultyDetails tableName ====>>>>>>', tableName);
    console.log('inside updateExternalFacultyDetails insertField ====>>>>>>', updateField);
    console.log('inside updateExternalFacultyDetails valuesData ====>>>>>>', arrayData);
    console.log('inside updateExternalFacultyDetails userName ====>>>>>>', userName);

    // Generate the setFields string once for consistency
    const setFields = updateField.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const updateQueryTemplate = `UPDATE ${tableName} SET ${setFields}, updated_by = $${updateField.length + 2},  updated_at = NOW() WHERE id = $${updateField.length + 1}`;

    const updateQueries = arrayData.map((faculty, index) => {
        const sqlQuery = {
            text: updateQueryTemplate,
            values: [...faculty, userName]
        };
        console.log(`SQL Query for faculty ${index + 1}:`, sqlQuery);
        return researchDbR.query(sqlQuery);
    });

    console.log('updateQueries ===>>>', updateQueries);

    try {
        const results = await Promise.all(updateQueries);
        const updatedRowCount = results.reduce((sum, result) => sum + result.rowCount, 0);
        console.log('results ==>>>>', results);
        return {
            status: 'Done',
            message: 'Faculty Records Updated Successfully',
            updatedRowCount: updatedRowCount
        };
    } catch (error) {
        console.error('Error updating faculty records ====>>>>>>', error);
        return {
            status: 'Failed',
            message: error.message,
            errorCode: error.code
        };
    }
}; 

module.exports.updateFieldWithSomeFilesOrNotFiles = async (tableName, updateField, valuesData, userName) => {
  console.log('inside updateFieldWithSomeFilesOrNotFiles tableName ====>>>>>>', tableName);
  console.log('inside updateFieldWithSomeFilesOrNotFiles updateField ====>>>>>>', updateField);
  console.log('inside updateFieldWithSomeFilesOrNotFiles valuesData ====>>>>>>', valuesData);
  console.log('inside updateFieldWithSomeFilesOrNotFiles userName ====>>>>>>', userName);

  // Dynamically create the setFields string and corresponding values array
  let setFields = [];
  let values = [];
  updateField.forEach((field, index) => {
    if (valuesData[index] !== null && valuesData[index] !== undefined && valuesData[index] !== '') {
      setFields.push(`${field} = $${values.length + 1}`);
      values.push(valuesData[index]);
    }
  });

  // Append additional fields
  setFields.push(`updated_at = NOW()`);
  setFields.push(`active = true`);


  // Append ID to the values array
  values.push(valuesData[valuesData.length - 1]);

  const sqlQuery = {
    text: `UPDATE ${tableName} SET ${setFields.join(', ')} WHERE id = $${values.length} RETURNING id`,
    values: values,
  };

  console.log('sqlQuery ====>>>>>>', sqlQuery);

  try {
    const result = await researchDbW.query(sqlQuery);
    const updatedId = result.rows[0].id;
    console.log('Updated Record ID ====>>>>>>', updatedId);

    return {
      status: 'Done',
      message: 'Record Updated Successfully',
      updatedId: updatedId,
    };
  } catch (error) {
    console.error('Error updating record ====>>>>>>', error);
    if (error.code === '23505') { 
      return {
        status: 'Failed',
        message: 'Unique constraint violation. Duplicate record exists.',
        errorCode: error.code,
      };
    }

    return {
      status: 'Failed',
      message: error.message,
      errorCode: error.code,
    };
  }
};


module.exports.updateStatus = async (tableName, fieldsName, mainId, idContainerArray, userName) => {
    console.log('inside updateStatus tableName ====>>>>>>', tableName);
    console.log('inside updateStatus fieldsName ====>>>>>>', fieldsName);
    console.log('inside updateStatus idContainerArray ====>>>>>>', idContainerArray);
    console.log('inside updateStatus userName ====>>>>>>', userName);
    console.log('inside updateStatus mainId ====>>>>>>', mainId);

    if (!idContainerArray || idContainerArray.length === 0) {
        console.log('No status IDs to update.');
        return {
            status: 'success',
            message: 'No updates needed',
        };
    }

    try {
        const newStatusId = idContainerArray[0];
        console.log('newStatusId ===>>>>>>', newStatusId);

        // Check if the record exists
        const existingRecord = await researchDbW.query({
            text: `SELECT ${fieldsName[0]} FROM ${tableName} WHERE ${fieldsName[0]} = $1`,
            values: [mainId],
        });

        let results;
        if (existingRecord.rows.length > 0) {
            // Update the record if it exists
            results = await researchDbW.query({
                text: `
                    UPDATE ${tableName}
                    SET ${fieldsName[1]} = $1, ${fieldsName[2]} = $2
                    WHERE ${fieldsName[0]} = $3
                    RETURNING *
                `,
                values: [newStatusId, userName, mainId],
            });
        } else {
            return {
                status: 'error',
                message: 'Record not found',
            };
        }

        console.log('Update successful:', results.rows);

        return {
            status: 'success',
            message: 'Record updated successfully',
            data: results.rows,
        };
    } catch (error) {
        console.error('Error updating relational table:', error);

        return {
            status: 'error',
            message: 'Failed to update record',
            error: error.message,
        };
    }
};
 


module.exports.insertOrUpdateRelationalDb = async (tableName, fieldsName, mainId, idContainerArray, userName) => {
  console.log('inside insertOrUpdateRelationalDb mainId ====>>>>>>', mainId);

  try {
    const currentTimestamp = moment().toISOString();

    for (const id of idContainerArray) {
      const existingRecord = await researchDbW.query({
        text: `SELECT id, active FROM ${tableName} WHERE ${fieldsName[0]} = $1 AND ${fieldsName[1]} = $2`,
        values: [mainId, id],
      });

      console.log('existingRecord.rows ===>>>>>', existingRecord.rows);

      if (existingRecord.rows.length === 0) {
        // No record found, insert new record
        const sqlQuery = {
          text: `INSERT INTO ${tableName} (${fieldsName[0]}, ${fieldsName[1]}, ${fieldsName[2]}, created_at, updated_at, active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
          values: [mainId, id, userName, currentTimestamp, currentTimestamp, true],
        };
        console.log('sqlQuery ====>>>>>>', sqlQuery);

        const result = await researchDbW.query(sqlQuery);
        console.log('Inserted record ID:', result.rows[0].id);
      } else {
        const record = existingRecord.rows[0];

        if (record.active) {
          // Record exists and is active, no need to insert
          console.log(`Record with ID ${record.id} is already active. No update needed.`);
        } else {
          // Record exists but is not active, update it
          const sqlQuery = {
            text: `UPDATE ${tableName} SET ${fieldsName[2]} = $1, updated_at = $2, active = $3 WHERE id = $4`,
            values: [userName, currentTimestamp, true, record.id],
          };
          console.log('sqlQuery ====>>>>>>', sqlQuery);

          const result = await researchDbW.query(sqlQuery);
          console.log('Updated record ID:', record.id);
        }
      }
    }

    return {
      status: 'Done',
      message: 'Records inserted or updated successfully',
    };
  } catch (error) {
    console.error('Error inserting or updating records ====>>>>>>', error);

    return {
      status: 'error',
      message: 'Failed to insert or update records',
      error: error.message,
    };
  }
};






  
  








  
  
  
  