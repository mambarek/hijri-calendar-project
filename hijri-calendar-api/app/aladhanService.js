const http = require('http');
const fetch = require('node-fetch');
const dbService = require("./dbService");

//const url = "http://api.aladhan.com/v1/hijriCalendarByCity?city=Kaiserslautern&country=de&method=1&month=10&year=1441";
const adhanServiceurl = ${ADHAN_API_URL};

exports.importHijriCalendar = async (calenderDb, collection) => {
    for(year=${HIJRI_YEAR_RANGE_BEGIN}; year < ${HIJRI_YEAR_RANGE_END}; year++){
       var promise = importHijriYear(calenderDb, collection, year);

       promise.then(yearData => {
       console.log("Imported year data", yearData);
       dbService.insertObject(calenderDb, collection, yearData);
       });
    }
}

importHijriYear = async (calenderDb, collection, year) => {
    var yearData = {"year": year, "data": []};

    return new Promise((resolve, reject) => {

        let resolvedPromisesCount = 0;
        for(let month=1; month < 13; month++){
              fetchHijriMonth(calenderDb, collection, month.toString(), year)
              .then(monthData => {
                    resolvedPromisesCount++;
                    console.log("monthData month for " + monthData.month, monthData);
                    yearData.data.push(monthData);
                    if(resolvedPromisesCount == 12) {
                        console.log("--- Promise resoled");
                        resolve(yearData);
                     }
              });

        }
    });
}

fetchHijriMonth = (calenderDb, collection, month, year) => {
            console.log("-- importHijri for month: " + month + " " + year);
            let url = adhanServiceurl + '&month='+ month + '&year=' + year;
            let settings = { method: "Get" };

            return new Promise((resolve, reject) => {
            /*
                        let res = await fetch(url, settings);
                        let json = await res.json();
                        let newStructure = {"month": month, "data": json.data};
                        yearData.data.push(newStructure);
                        console.log("-- json data for month " + newStructure);
*/
                        fetch(url, settings)
                                .then(res => res.json())
                                .then((json) => {
                                    // do something with JSON
                                    console.log("-- json data for month " + month);
                                    //console.log(json);
                                    const newStructure = {"month": month, "data": json.data};
                                    console.log("newstructur month for: " + month, newStructure);

                                    resolve(newStructure);
                                });
            })


/*
            fetch(url, settings)
                .then(res => res.json())
                .then((json) => {
                    // do something with JSON
                    console.log("-- json data for month " + month);
                    //console.log(json);
                    const newStructure = {"month": month, "data": json.data};
                    console.log("newstructur month", newStructure);
                    yearData.data.push(newStructure);
                });
*/
     }
