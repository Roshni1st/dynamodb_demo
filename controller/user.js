require("dotenv").config();
const {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const dynamodbClient = new DynamoDBClient({ region: process.env.REGION });

// Create a new user
exports.createUser = async (req, res) => {
  const body = req.body;

  const params = {
    TableName: "users",
    Item: marshall(body),
  };

  const putItemCommand = new PutItemCommand(params);

  try {
    await dynamodbClient.send(putItemCommand);
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error("Unable to add user. Error:", error);
    res.status(500).json({ error: "Unable to add user" });
  }
};
//get all users
exports.getAllUsers = async (req, res) => {
  const params = {
    TableName: "users",
  };

  const scanCommand = new ScanCommand(params);

  try {
    const { Items } = await dynamodbClient.send(scanCommand);
    res.json(Items.map((item) => unmarshall(item)));
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Unable to fetch users" });
  }
};
// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const user_id = req.params.id;

    const params = {
      TableName: "users",
      Key: {
        user_id: { S: user_id },
      },
    };

    const getItemCommand = new GetItemCommand(params);

    const { Item } = await dynamodbClient.send(getItemCommand);
    if (Item) {
      res.json(unmarshall(Item));
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error); // Add error logging
    res.status(500).json({ error: "Unable to read user" });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  const user_id = req.params.id;
  const body = req.body;

  let updateExpression = "SET ";
  const expressionAttributeValues = {};

  Object.keys(body).forEach((key, index) => {
    updateExpression += `${key} = :${key}`;

    expressionAttributeValues[`:${key}`] = body[key];

    if (index < Object.keys(body).length - 1) {
      updateExpression += ", ";
    }
  });

  // Construct the params object for the UpdateItemCommand
  const params = {
    TableName: "users",
    Key: marshall({ user_id }, { removeUndefinedValues: true }),
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: marshall(expressionAttributeValues, {
      removeUndefinedValues: true,
    }),
    ReturnValues: "ALL_NEW",
  };

  const updateItemCommand = new UpdateItemCommand(params);

  try {
    const { Attributes } = await dynamodbClient.send(updateItemCommand);
    console.log("Update user succeeded:", Attributes);
    res.json({
      message: "User updated successfully",
      user: unmarshall(Attributes),
    });
  } catch (error) {
    console.error("Unable to update user. Error:", error);
    res.status(500).json({ error: "Unable to update user" });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const user_id = req.params.id;

  const params = {
    TableName: "users",
    Key: marshall({ user_id }),
  };

  const deleteItemCommand = new DeleteItemCommand(params);

  try {
    await dynamodbClient.send(deleteItemCommand);
    console.log("Delete user succeeded:", user_id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Unable to delete user. Error:", error);
    res.status(500).json({ error: "Unable to delete user" });
  }
};
