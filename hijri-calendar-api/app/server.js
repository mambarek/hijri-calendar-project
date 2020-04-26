
const express = require("express");
const bodyParser = require("body-parser");
const dbService = require("./dbService");
const adhanService = require("./aladhanService");

const calenderDb = "calender_db";
const collection = "hijri";

let app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get("/", (req, res) => res.send('Hello World!'));

app.listen(3005, () => {
    console.log('server started - 3005');
    dbService.initDb("mydb");

    dbService.initDb(calenderDb);
    dbService.createDBCollection(calenderDb, collection);

    adhanService.importHijriCalendar(calenderDb, collection, 1441);
});

app.get("/calendar/hijri/v1/", (req, res) => {
    dbService.findAll(calenderDb, collection, res);
});

app.get("/calendar/hijri/v1/:month", (req, res) => {
    console.log({month: req.params.month});
    dbService.queryObject(calenderDb, collection, {month: req.params.month}, res);
});
