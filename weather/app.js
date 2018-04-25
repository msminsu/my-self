$(document).ready(function(){

});

//var APPID = 'f2b96127a49521eba64d077a84281b3d0c870dca';
var APPID = '2a994cb19c2972098dc279333f81182c';
var tokenID = '41da8ebfbc9cc68442af347291689e8cbeb5a9b1';
var temp;
var loc;
var icon;
var humidity;
var wind;
var direction;
var output = $('.output');


function updateByZip(zip){
    var url = 'https://api.openweathermap.org/data/2.5/weather?'+
        'zip='+ zip +
        '&APPID='+APPID;

    var url1 = 'https://api.waqi.info/search/?'+
        'token='+ tokenID +
        '&keyword='+zip;

    var url2 = 'https://api.waqi.info/feed/geo:37.566535;126.9779692/?'+
        'token='+ tokenID;

    sendRequest(url);

}


function updateByGeo(lat,lon){
    var url = 'https://api.openweathermap.org/data/2.5/weather?'+
        'lat='+ lat +'&lon='+ lon +
        '&APPID='+APPID;
    sendRequest(url);
}

function sendRequest(url) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
            var data = JSON.parse(xmlhttp.responseText);

            /*
            var result = data;
            result.data.forEach(function(data,i){
               console.log(data.station.name);
                colorize(data.aqi);
                /!*tr.append($("<td>").html(colorize(station.aqi)));
                tr.append($("<td>").html(station.time.stime));
                tr.on("click",function(){
                    showStation(station,stationInfo);
                });*!/

                console.log(data.station.geo[0]+';'+data.station.geo[1] );

                //if (i==0) showStation(station,stationInfo);
            });*/

//           console.log(result);
            var weather = {};
            weather.icon = data.weather[0].id;
            weather.humidity = data.main.humidity;
            weather.wind = data.wind.speed;
            weather.direction = degreesToDirection(data.wind.deg);
            weather.loc = data.name;
            weather.temp = K2C(data.main.temp);
            update(weather);
        }
    };



    xmlhttp.open("GET", url , true);
    xmlhttp.send();

}

function degreesToDirection(degrees){
    var range = 360/16;
    var low = 360 - range/2;
    var high = (low + range) % 360;
    var angles = ["N", "NNE", "ENE", "E", "ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    for( i in angles){
        if(degrees >= low && degrees < high ) {
            return angles[i];
            low = (low + range) % 360;
            high = (high + range) % 360;
        }
    }
    return "N";
}

function K2C(k){
    return Math.round(k - 273.15);
}

function K2F(k){
    return Math.round(k*(9/5)-459.67);
}


function colorize(aqi, specie ) {

    specie = specie||"aqi"
    console.log(["pm25","pm10","no2","so2","co","o3","aqi"].indexOf(specie));
    if (["pm25","pm10","no2","so2","co","o3","aqi"].indexOf(specie)<0) return aqi;

    var spectrum = [
        {a:0,  b:"#cccccc",f:"#ffffff"},
        {a:50, b:"#009966",f:"#ffffff"},
        {a:100,b:"#ffde33",f:"#000000"},
        {a:150,b:"#ff9933",f:"#000000"},
        {a:200,b:"#cc0033",f:"#ffffff"},
        {a:300,b:"#660099",f:"#ffffff"},
        {a:500,b:"#7e0023",f:"#ffffff"}
    ];


    var i = 0;
    for (i=0;i<spectrum.length-2;i++) {
        if (aqi=="-"||aqi<=spectrum[i].a) break;
    };
    return $("<div/>")
        .html(aqi)
        .css("font-size","120%")
        .css("min-width","30px")
        .css("text-align","center")
        .css("background-color",spectrum[i].b)
        .css("color",spectrum[i].f)

}


function update(weather){
    wind.innerHTML = weather.wind;
    direction.innerHTML = weather.direction;
    humidity.innerHTML = weather.humidity;
    loc.innerHTML = weather.loc;
    temp.innerHTML = weather.temp;
    icon.src = 'imgs/codes/' + weather.icon +'.png';

}


function showPosition(position){
    console.log(position);
    updateByGeo(position.coords.latitude, position.coords.longitude);

}

window.onload = function(){

    temp = document.getElementById('temperature');
    loc = document.getElementById('location');
    icon = document.getElementById('icon');
    humidity = document.getElementById('humidity');
    wind = document.getElementById('wind');
    direction = document.getElementById('direction');

   /* var weather = {};

    weather.wind = 3.5;
    weather.direction = "N";
    weather.humidity = 35;
    weather.loc = "Boston";
    weather.temp = '45';
    weather.icon = 200;

    update(weather);*/


    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(showPosition);

    }else{
       var zip = window.prompt('위치값을 입력하세요');
       updateByZip(zip);
   }

};