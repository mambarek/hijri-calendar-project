const http = require('http');
const dbService = require("./dbService");

const url = "http://api.aladhan.com/v1/hijriCalendarByCity?city=Kaiserslautern&country=de&method=1&month=10&year=1441";

exports.importHijriCalendar = (calenderDb, collection, year) => {
    for(i=1; i <13; i++){
        importHijri(calenderDb, collection, i.toString(), year);
    }
}

importHijri = (calenderDb, collection, month, year) => {

    const options = {
          hostname: 'api.aladhan.com',
          port: 80,
          path: '/v1/hijriCalendarByCity?city=Kaiserslautern&country=de&method=1&month='+ month + '&year=' + year,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
      }

    const req = http.request(options, res => {
      console.log(`statusCode: ${res.statusCode}`)

      let body = "";

      res.on("data", (chunk) => {
          body += chunk;
      });

      res.on('end', () => {
        //process.stdout.write(d)
        let data = JSON.parse(body);
        console.log("------  found data --------")
        //console.log(data)
        const newStructure = {};
        newStructure['month'] = month;
        newStructure['data'] = data.data;

        dbService.insertObject(calenderDb, collection, newStructure);
      }).on('error', error => {
              console.error(error)
            });
    })
}
