var express = require('express');
var router = express.Router();

var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();
var table = "Events";

var params = {
  TableName : table,
  KeySchema: [
      { AttributeName: "userId", KeyType: "HASH"},  //Partition key
      { AttributeName: "startTime", KeyType: "RANGE" }  //Sort key
  ],
  AttributeDefinitions: [
      { AttributeName: "userId", AttributeType: "N" },
      { AttributeName: "startTime", AttributeType: "S" }
  ],
  ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
  }
};

// dynamodb.createTable(params, function(err, data) {
//   if (err) {
//       console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
//   } else {
//       console.log("sCreated table. Table description JSON:", JSON.stringify(data, null, 2));
//   }
// });

// var params = {
//     TableName:table,
//     Item:{
//         "userId": -1,
//         "startTime": new Date().toString(),
//         "endTime": new Date().toString(),
//         "eventName": "A test event",
//         "info":{
//             "plot": "Nothing happens at all.",
//             "rating": 0
//         }
//     }
// };

// console.log("Adding a new item...");
// docClient.put(params, function(err, data) {
//     if (err) {
//         console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
//     } else {
//         console.log("Added item:", JSON.stringify(data, null, 2));
//     }
// });

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express3'
  });
});

module.exports = router;