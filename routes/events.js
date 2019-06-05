var express = require('express');
var router = express.Router();
var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

router.get('/', function (req, res) {
    var params = {
        TableName : "Events",
        KeyConditionExpression: "userId = :userId",
        // ExpressionAttributeNames:{
        //     "#yr": "year"
        // },
        ExpressionAttributeValues: {
            ":userId": parseInt(req.query.userId)
        }
    };
    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            res.status(500).send(JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            res.status(200).send(JSON.stringify(data, null, 2));
        }
    });
});

router.post('/', function (req, res) {
    const { userId, startTime, endTime, eventName } = req.body;
    const item = { userId, startTime, endTime, eventName };
    item.userId = parseInt(req.body.userId);
    const params = {
        TableName: "Events",
        Item: item
    };
    console.log(params.Item);
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            res.status(500).send(JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            res.status(200).send(JSON.stringify(data));
        }
    });
});

module.exports = router;