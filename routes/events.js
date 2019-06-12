var express = require('express');
var cors = require('cors')
var router = express.Router();
var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

const corsOptions = {
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
router.get('/', cors(corsOptions), function (req, res) {
    var params = {
        TableName: "Events",
        KeyConditionExpression: "userId = :userId",
        // ExpressionAttributeNames:{
        //     "#yr": "year"
        // },
        ExpressionAttributeValues: {
            ":userId": parseInt(req.query.userId)
        }
    };
    docClient.query(params, function (err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            res.status(500).json(err);
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            res.status(200).json(data);
        }
    });
});

router.options("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
  });


router.post('/', cors(corsOptions), function (req, res) {
    const { userId, startTime, endTime, eventName } = req.body;
    const item = { userId, startTime, endTime, eventName };
    item.userId = parseInt(req.body.userId);
    const params = {
        TableName: "Events",
        Item: item
    };
    console.log(params.Item);
    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            res.status(500).json(err);
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            res.status(200).json(data);
        }
    });
});

module.exports = router;