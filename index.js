const DynamoDB = require("aws-sdk/clients/dynamodb"); 
const documentClient = new DynamoDB.DocumentClient({region: 'us-east-1'})

// @route /dev/notes
// @method POST 
// @desc Create a note 
// @access Public 

module.exports.createNote = async (event, context, callback) => {
  let data = JSON.parse(event.body);
  try {
    // create a new item in a table if it doesn't exist 
    const params = {
      TableName: "notes",
      Item: {
        notesId: data.id,
        title: data.title,
        body: data.body
      },
      ConditionExpression: "attribute_not_exists(notesId)"
    }
    await documentClient.put(params).promise(); 
    callback(null, {
      statusCode: 201,
      body: JSON.stringify(data)
    })
  } catch (error) {
    callback(null, {statusCode: 500, body: JSON.stringify(error.message)})
  }
};

// @route /dev/notes/:id
// @desc Update a note 
// @access Public 
module.exports.updateNote = async (event) => {
  let notesId = event.pathParameters.id; 
  return {
    statusCode: 201, 
    body: JSON.stringify(`The note with id: ${notesId} has been updated`)
  }
}

// @route /dev/notes/:id
// @desc Update a note 
// @access Public 
module.exports.deleteNote = async (event) => {
  let notesId = event.pathParameters.id; 
  return {
    statusCode: 200,
    body: JSON.stringify(`The note with id: ${notesId} has been deleted`)
  }
}

// @route /dev/notes
// @desc Get all notes
// @access Public 
module.exports.getAllNotes = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify("All notes are returned")
  }
}
