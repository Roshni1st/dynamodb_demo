const AWS = require("aws-sdk");

// Configure AWS SDK
AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KE,
});

// Create DynamoDB document client
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = docClient;
