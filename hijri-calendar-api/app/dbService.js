const connect = require("mongodb");
const MongoClient = connect.MongoClient;
//var mongoBaseUrl = "mongodb://localhost:27017/";
var mongoBaseUrl = "mongodb://mongo:27017/";

createDB = (dbName) => {
    const dbUrl = mongoBaseUrl + dbName;
    MongoClient.connect(dbUrl, function (err, db) {
        if (err) throw err;
        console.log("-- Database created! " + dbName);
        db.close();
    });
};

exports.createDBCollection = (dbName, collection) => {
    MongoClient.connect(mongoBaseUrl, function (err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.createCollection(collection, function (err, res) {
            if (err) throw err;
            console.log("-- Collection created! " + collection);
            db.close();
        });
    });
};

exports.insertObject = (dbName, collection, myobj) => {
    MongoClient.connect(mongoBaseUrl, function (err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.collection(collection).insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
};

exports.findOne = (dbName, collection) => {
    MongoClient.connect(mongoBaseUrl, function (err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.collection(collection).findOne({}, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
};

exports.findAll = (dbName, collection, response) => {
    MongoClient.connect(mongoBaseUrl, function (err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.collection(collection).find({}).toArray(function(err, result) {
            if (err) throw err;
            //console.log(result);
            response.json(result);
            db.close();
        });
    });
};

exports.queryObject = (dbName, collection, query, response) => {

    MongoClient.connect(mongoBaseUrl, function (err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.collection(collection).find(query).toArray(function (err, result) {
            if (err) throw err;
            //console.log(result);
            response.json(result);
            db.close();

        });
    });
};

exports.initDb = (dbName) => {
    MongoClient.connect(mongoBaseUrl, function (err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        if (!dbo)
            createDB(dbName);
        else
            console.log("Database exits! no database created!");
    });
};


