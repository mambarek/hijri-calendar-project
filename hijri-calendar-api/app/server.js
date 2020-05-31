
const express = require("express")
const cors = require('cors')
const bodyParser = require("body-parser")
const dbService = require("./dbService")
const adhanService = require("./aladhanService")

const calenderDb = "calender_db";
const collection = "hijri";
const api_version = "v2";

let app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/", (req, res) => res.send('Hello World!'));

app.listen(3005, () => {
    console.log('server started - 3005');
    dbService.initDb("mydb");

    dbService.initDb(calenderDb);
    dbService.createDBCollection(calenderDb, collection);

    adhanService.importHijriCalendar(calenderDb, collection);
});

app.get(`/calendar/hijri/${api_version}/`, (req, res) => {
    dbService.findAll(calenderDb, collection, res);
});

app.get(`/calendar/hijri/${api_version}/:month/:year`, (req, res) => {
    //dbService.queryObject(calenderDb, collection, {year: req.params.year}, res);

    dbService.queryObjectJson(calenderDb, collection, {year: Number(req.params.year)}).then(data => {
        //console.log("*** JSON Promise result: ", data);
        let monthData = data[0].data.filter(monthData => monthData.month === req.params.month)[0].data;
        console.log("*** JSON Promise result: ", monthData);
        res.json(monthData);
    });
});
