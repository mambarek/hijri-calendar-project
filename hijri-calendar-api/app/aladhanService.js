const http = require('http');
const fetch = require('node-fetch');
const dbService = require("./dbService");

const url = "http://api.aladhan.com/v1/hijriCalendarByCity?city=Kaiserslautern&country=de&method=1&month=10&year=1441";

exports.importHijriCalendar = (calenderDb, collection, year) => {
    for(i=1; i <13; i++){
       // importHijri(calenderDb, collection, i.toString(), year);
       fetchHijri(calenderDb, collection, i.toString(), year);
    }
}


fetchHijri = (calenderDb, collection, month, year) => {
            console.log("-- importHijri for month: " + month + " " + year);
            let url = 'http://api.aladhan.com/v1/hijriCalendarByCity?city=Kaiserslautern&country=de&method=1&month='+ month + '&year=' + year;
            let settings = { method: "Get" };

            fetch(url, settings)
                .then(res => res.json())
                .then((json) => {
                    // do something with JSON
                    console.log("-- json data for month " + month);
                    console.log(json);
                    const newStructure = {};
                    newStructure['month'] = month;
                    newStructure['data'] = json.data;

                    dbService.insertObject(calenderDb, collection, newStructure);
                });

     }
