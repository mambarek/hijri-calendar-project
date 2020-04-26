$.jgrid.defaults.width = "100%";
$.jgrid.defaults.responsive = true;
$.jgrid.defaults.styleUI = "Bootstrap4";
$.jgrid.defaults.iconSet = "Octicons";
var cachedDayData;

// Set the unit values in milliseconds.
var msecPerMinute = 1000 * 60;
var msecPerHour = msecPerMinute * 60;
var msecPerDay = msecPerHour * 24;
var selectedMonth = "1";
var selectedAthan = "Makkah.mp3";
var athanPth = "assets/athan/";

function changeAthan(){
    selectedAthan = $("#athan-selection").val();

    var audio = $("#athanPlayer");
    audio.attr("src", athanPth + selectedAthan);
    audio[0].pause();
    audio[0].load();
    audio[0].play();
}
function changeMonth(){
    selectedMonth = $("#month-selection").val();
    fillGrid();
}

function getCurrentDateTimeFrom(timeString){
    var arr = timeString.split(":");
    var hours = arr[0];
    var minutes = arr[1];
    var now = new Date();
    return now.setHours(hours, minutes, 0);
}

function playAdhan(){
    var audio = $("#athanPlayer");
    audio.attr("src", athanPth + selectedAthan);
    audio[0].pause();
    audio[0].load();
    audio[0].play();
    $("#athanPlayer")[0].play();
}

function setTimerToDate(targetDate, selector){
    var interval = -1;
    var counter = setInterval(function (args) {
        // Get the difference in milliseconds.
        interval = targetDate - new Date();

        if(interval < 0) {
            clearInterval(counter);
            return;
        }

        var hours = Math.floor(interval / msecPerHour );
        interval = interval - (hours * msecPerHour );

        var minutes = Math.floor(interval / msecPerMinute );
        interval = interval - (minutes * msecPerMinute );

        var seconds = Math.floor(interval / 1000 );
        var min = minutes < 10 ? "0"+ minutes: minutes;
        var sec = seconds < 10 ? "0"+ seconds: seconds;
        $(selector).html(hours+":"+min+":"+sec);
        if(hours+":"+min+":"+sec == "0:00:00") {
            console.info("Yes ist gleich " + hours+":"+min+":"+sec);
            // wait one second and refresh tabel
            setTimeout(function() {
                // empty table
                $('#dayTable > tbody > tr').remove();
                // redraw it again
                fillDayTable(cachedDayData);
            }, 1000);

            playAdhan();
        }
    }, 1000);
}

function fillDayTable(data){

    var found = false;
    var fajrDate = getCurrentDateTimeFrom(data.data.timings.Fajr);
    var dhuhrDate = getCurrentDateTimeFrom(data.data.timings.Dhuhr);
    var asrDate = getCurrentDateTimeFrom(data.data.timings.Asr);
    var maghribDate = getCurrentDateTimeFrom(data.data.timings.Maghrib);
    var ishaDate = getCurrentDateTimeFrom(data.data.timings.Isha);
    var imsakDate = getCurrentDateTimeFrom(data.data.timings.Imsak);

    var table = $('#dayTable');
    var interval = fajrDate - new Date();
    if(interval > 0) {
        found = true;
        setTimerToDate(fajrDate,"#nextSalatCounter");
        table.append("<tr style='background: brown;color: white;'><td>Fajr</td><td>" + data.data.timings.Fajr + "</td></tr>");
    }
    else
        table.append("<tr><td>Fajr</td><td>" + data.data.timings.Fajr + "</td></tr>");


    interval = dhuhrDate - new Date();
    if(!found && interval > 0) {
        found = true;
        setTimerToDate(dhuhrDate,"#nextSalatCounter");
        table.append("<tr style='background: brown;color: white;'><td>Dhuhr</td><td>" + data.data.timings.Dhuhr + "</td></tr>");
    }
    else
        table.append("<tr><td>Dhuhr</td><td>" + data.data.timings.Dhuhr + "</td></tr>");

    interval = asrDate - new Date();
    if(!found && interval > 0) {
        found = true;
        setTimerToDate(asrDate,"#nextSalatCounter");
        table.append("<tr style='background: brown;color: white;'><td>Asr</td><td>" + data.data.timings.Asr + "</td></tr>");
    }
    else
        table.append("<tr><td>Asr</td><td>" + data.data.timings.Asr + "</td></tr>");

    interval = maghribDate - new Date();
    if(!found && interval > 0) {
        found = true;
        setTimerToDate(maghribDate,"#nextSalatCounter");
        table.append("<tr style='background: brown;color: white;'><td>Maghrib</td><td>" + data.data.timings.Maghrib + "</td></tr>");
    }
    else
        table.append("<tr><td>Maghrib</td><td>" + data.data.timings.Maghrib + "</td></tr>");

    interval = ishaDate - new Date();
    if(!found && interval > 0) {
        found = true;
        setTimerToDate(ishaDate,"#nextSalatCounter");
        table.append("<tr style='background: brown;color: white;'><td>Isha</td><td>" + data.data.timings.Isha + "</td></tr>");
    }
    else
        table.append("<tr><td>Isha</td><td>" + data.data.timings.Isha + "</td></tr>");

    interval = imsakDate - new Date();
    if(!found && interval > 0) {
        found = true;
        setTimerToDate(imsakDate,"#nextSalatCounter");
        table.append("<tr style='background: brown;color: white;'><td>Imsak</td><td>" + data.data.timings.Imsak + "</td></tr>");
    }
    else
        table.append("<tr><td>Imsak</td><td>" + data.data.timings.Imsak + "</td></tr>");
}


var dayUrl = 'http://api.aladhan.com/v1/timingsByCity?city=kaiserslautern&country=de&method=1';
xhrGet(dayUrl).then(function(data) {
    cachedDayData = data;
    var maghrib = data.data.timings.Maghrib.split(" ")[0];

    var maghribDate = getCurrentDateTimeFrom(maghrib);
    setTimerToDate(maghribDate,"#maghribCounter");
    fillDayTable(data);
    selectedMonth = data.data.date.hijri.month.number;
    $("#month-selection").val(selectedMonth);
});

function formatNowCell  (rowId, cellvalue, rawObject, cm, rdata){
    var now = new Date();
    var date = new Date(rawObject.date.readable);
    //if(rowObject.date.gregorian.day == now.getDate()) {
    //if(rdata.date.date.startsWith(now.getDate())) {
    //if(now.getTime() == date.getTime()) {
    if(now.getDate() == date.getDate() && now.getMonth() == date.getMonth() && now.getFullYear() == date.getFullYear()){
        //if(options.colModel.name == "Maghrib" ) {
        return 'class=\"nowCell\"';
    }

    return null;
}

function formatDayNowCell  (rowId, cellvalue, rawObject, cm, rdata){
    var now = new Date();
    var date = new Date(rawObject.date.readable);
    //if(rowObject.date.gregorian.day == now.getDate()) {
    //if(rdata.date.date.startsWith(now.getDate())) {
    //if(now.getTime() == date.getTime()) {
    if(now.getDate() == date.getDate() && now.getMonth() == date.getMonth() && now.getFullYear() == date.getFullYear()){
        //if(options.colModel.name == "Maghrib" ) {
        return 'class=\"nowCell\"';
    }

    return null;
}

function formatMaghribCell  (rowId, cellvalue, rawObject, cm, rdata){
    var now = new Date();
    var date = new Date(rawObject.date.readable);
    //if(rowObject.date.gregorian.day == now.getDate()) {
    if(now.getDate() == date.getDate() && now.getMonth() == date.getMonth() && now.getFullYear() == date.getFullYear()){
        //if(options.colModel.name == "Maghrib" ) {
        return 'class=\"testClass\"';
    }

    if(cm.name == "Maghrib" ) {
        return 'class=\"maghribCell\"';
    }

    return null;
}

function formatTime  (cellvalue, options, rowObject)
{
    var now = new Date();
    var value =  cellvalue.split(" ")[0];

    /*if(rowObject.date.gregorian.day == now.getDate()){
        if(options.colModel.name == "Maghrib" ) {
            return "<div style=\"height:2.7rem;padding-top: 10px;width:100%;background-color: #4eb305\"><span style=\"font-weight:600;color:green\">" + value + "</span></div>";
        }
        else
            return "<span style=\"color:red\">"+value+"</span>";
    }*/

    return value;
}

function dateFormatter (cellvalue, options, rowObject)
{
    var now = new Date();
    var value =  cellvalue;

    /*if(rowObject.date.gregorian.day == now.getDate())
        return "<span style=\"font-weight:700\">"+value+"</span>";*/

    return "<span>"+ cellvalue.day + " " + cellvalue.month.en + " " + cellvalue.year + "</span>";
}

function hijriFormatter (cellvalue, options, rowObject)
{
    return "<span dir=\"rtl\">"+cellvalue.weekday.ar + ", " + cellvalue.day + " " + cellvalue.month.ar + " " + cellvalue.year + "</span>";
}

function dayFormatter (cellvalue, options, rowObject){
    return cellvalue.weekday.en;
}
// formatCol = function (pos, rowInd, tv, rawObject, rowId, rdata)
function createGrid(data, rowsPerPage){
    $("#jqGrid").jqGrid({
        datatype: "local",
        data: data,
        colModel: [
            { label: 'Day', name: 'day', jsonmap: 'date.gregorian', formatter: dayFormatter,cellattr : formatDayNowCell,   width: 100, sortable: false},
            { label: 'Date', name: 'date', jsonmap: 'date.gregorian', formatter: dateFormatter, cellattr : formatNowCell, width: 150, sortable: false},
            { label: 'Hijri', name: 'hijri',jsonmap:'date.hijri', formatter: hijriFormatter, cellattr : formatNowCell, width: 200, sortable: false},
            { label: 'Fajr', name: 'Fajr', jsonmap: 'timings.Fajr', width: 80, formatter: formatTime, cellattr : formatNowCell , align: "center", sortable: false},
            { label: 'Sunrise', name: 'Sunrise', jsonmap: 'timings.Sunrise', width: 80, formatter: formatTime, cellattr : formatNowCell , align: "center", sortable: false },
            { label: 'Dhuhr', name: 'Dhuhr', jsonmap: 'timings.Dhuhr', width: 80, formatter: formatTime, cellattr : formatNowCell , align: "center", sortable: false},
            { label: 'Asr', name: 'Asr', jsonmap: 'timings.Asr', width: 80, formatter: formatTime, cellattr : formatNowCell , align: "center", sortable: false },
            { label: 'Sunset', name: 'Sunset', jsonmap: 'timings.Sunset', width: 80, formatter: formatTime, cellattr : formatNowCell , align: "center", sortable: false},
            { label: 'Maghrib', name: 'Maghrib', jsonmap: 'timings.Maghrib', width: 90, formatter: formatTime, cellattr  : formatMaghribCell , align: "center", sortable: false},
            { label: 'Isha', name: 'Isha', jsonmap: 'timings.Isha', width: 80, formatter: formatTime, cellattr : formatNowCell , align: "center", sortable: false},
            { label: 'Imsak', name: 'Imsak', jsonmap: 'timings.Imsak', width: 80, formatter: formatTime, cellattr : formatNowCell , align: "center", sortable: false},
            { label: 'Midnight', name: 'Midnight', jsonmap: 'timings.Midnight', width: 120, formatter: formatTime, cellattr : formatNowCell , align: "center", sortable: false}
        ],

        //altRows : true,
        rownumbers : true,
        //colMenu : true,
        menubar: true,
        //viewrecords : true,
        hoverrows : true,
        height: '100%',
        //width: '100',
        rowNum: rowsPerPage,
        records: 31,
        caption : 'Prayer time',
        sortable: false,
        //altRows: true, This does not work in boostrarap
        // altclass: '....'
        pager: "#jqGridPager",
        // set table stripped class in table style in bootsrap

    });
}

var rowsPerPage = 10;
var $grid = $('#jqGrid');
function fillGrid() {

    const todayHijri = HijriJS.today();
    var url = new URL(location.href);
    var method = url.searchParams.get("m");

    if(!method) method = 1;
    //var url = 'http://api.aladhan.com/v1/calendarByCity?city=Kaiserslautern&country=de&method=2&month=05&year=2019';
    var aladhanUrl = 'http://api.aladhan.com/v1/hijriCalendarByCity?city=Kaiserslautern&country=de&method=' + method +'&month=' +
        selectedMonth +'&year=' + todayHijri.year;

    xhrGet(aladhanUrl).then(function(data) {
        var items = data.data;
        var now = new Date();
        var nowIndex=0;
        for(var i=0; i< items.length; i++) {
            var item = items[i];
            var date = new Date(item.date.readable);
            //if (item.date.gregorian.date.startsWith(now.getDate())) {
            if(now.getDate() == date.getDate() && now.getMonth() == date.getMonth() &&
                now.getFullYear() == date.getFullYear()){
                nowIndex = i;
                break;
            }
        }

        $grid.jqGrid('setGridParam', {data: items});
        $grid[0].refreshIndex();
        // round it to next integer
        var selectedPage = Math.ceil(nowIndex / rowsPerPage);
        //set page
        $grid.jqGrid('setGridParam', {page: selectedPage});

        //refresh grid
        $grid.trigger( 'reloadGrid' );
    });
}
function firstLoad() {

    const todayHijri = HijriJS.today();
    var url = new URL(location.href);
    var method = url.searchParams.get("m");

    if(!method) method = 1;
    var aladhanUrl = 'http://api.aladhan.com/v1/hijriCalendarByCity?city=Kaiserslautern&country=de&method=' +
        method +'&month=' + todayHijri.month +'&year=' + todayHijri.year;

    xhrGet(aladhanUrl).then(function(data) {
        var items = data.data;
        var now = new Date();
        var nowIndex=0;
        for(var i=0; i< items.length; i++) {
            var item = items[i];
            var date = new Date(item.date.readable);
            //if (item.date.gregorian.date.startsWith(now.getDate())) {
            if(now.getDate() == date.getDate() && now.getMonth() == date.getMonth() &&
                now.getFullYear() == date.getFullYear()){
                nowIndex = i;
                break;
            }
        }

        createGrid(items, rowsPerPage);
        $grid[0].refreshIndex();
        // round it to next integer
        var selectedPage = Math.ceil(nowIndex / rowsPerPage);
        //set page
        $grid.jqGrid('setGridParam', {page: selectedPage});

        //refresh grid
        $grid.trigger( 'reloadGrid' );
    });
}
$(document).ready(function () {
    firstLoad();
    //createGrid([], rowsPerPage);
    //fillGrid();
});
