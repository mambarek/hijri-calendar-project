require('dotenv').config();
const connect = require("mongodb");
const MongoClient = connect.MongoClient;
const mongo_host = process.env.MONGO_HOST;
const mongo_port = process.env.MONGO_PORT;
const mongoBaseUrl = `mongodb://${mongo_host}:${mongo_port}/`;

createDB = (dbName) => {
    const dbUrl = mongoBaseUrl + dbName;
    return MongoClient.connect(dbUrl, function (err, db) {
        if (err) throw err;
        console.log("-- Database created! " + dbName);
        db.close();
    });
};

exports.createDBCollection = (dbName, collection) => {
    return MongoClient.connect(mongoBaseUrl, function (err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.collection(collection).drop();
        dbo.createCollection(collection, function (err, res) {
            if (err) throw err;
            console.log("-- Collection created! " + collection);
            db.close();
        });
    });
};

exports.insertObject = (dbName, collection, myobj) => {
    return MongoClient.connect(mongoBaseUrl, function (err, db) {
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
    return MongoClient.connect(mongoBaseUrl, function (err, db) {
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
    return MongoClient.connect(mongoBaseUrl, function (err, db) {
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

    return MongoClient.connect(mongoBaseUrl, function (err, db) {
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

exports.queryObjectJson = (dbName, collection, query) => {

    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoBaseUrl, function (err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            dbo.collection(collection).find(query).toArray(function (err, result) {
                if (err) reject(err);
                console.log(" queryjson: query", query);
                console.log(" queryjson: result", result);
                resolve(result);
                db.close();
            });
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


