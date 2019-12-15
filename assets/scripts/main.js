$(document).ready(function () {
    console.log("ready!");
    const apiKey = "8958a465fb84dd70a7e61cd199ace0f3";
    const apiCall = "https://api.openweathermap.org/data/2.5/";
    var weatherSearches = [];
    var lastSearch;
    var currentWeatherHeaderEl = $("#currentWeatherHeader");
    var currentWeatherTempEl = $("#currentWeatherTemp");
    var currentWeatherHumEl = $("#currentWeatherHum");
    var currentWeatherWindEl = $("#currentWeatherWind");
    var currentWeatherUVEl = $("#currentWeatherUV");
    var forecastWeatherDivEl = $("#forecastWeatherDiv");

    // this function loads the weatherSearches and lastSearch variables
    function loadWeatherSearches() {
        var value = localStorage.getItem("weatherSearches");
        if (value !== null) {
            console.log(value);
            var localWS = JSON.parse(value);
            if (localWS !== null) {
                weatherSearches = localWS;
            }
        }
        var value = localStorage.getItem("lastWeatherSearch");
        if (value !== null) {
            console.log(value);
            lastSearch = value;
        }
    }
    loadWeatherSearches();
    console.log(weatherSearches);

    //if there's a Last Search use it and show the weather for that location, otherwise see if we can find the current location
    if (lastSearch != null) {
        console.log("last search: " + lastSearch);
        //remove the double quotes 
        var lastSearchNoQuotes = lastSearch.replace(/['"]+/g, '');
        console.log(lastSearchNoQuotes);
        getWeather(lastSearchNoQuotes);
    }
    else {
        //if there's no Last Search in the storage, and if we can get the current location then show the weather for the current location.
        navigator.geolocation.getCurrentPosition(function (location) {
            console.log(location);
            console.log(location.coords.latitude);
            console.log(location.coords.longitude);
            getWeatherByCoords(location.coords.longitude, location.coords.latitude);
            console.log(location.coords.accuracy);
        });
    }

    //The code below will load an Auto Complete list from city.list.json but I commented it out since it was very slow.
    // var cities = [];
    // var i = 0;
    // data.forEach(element => {

    //     var n = element.name.charCodeAt(0);
    //     if ((n >= 65 && n < 91) || (n >= 97 && n < 123)) {
    //         var txt = element.name + "," + element.country;
    //         if (!cities.includes(txt)) {
    //             cities.push(txt);
    //         }

    //     }
    // });
    // console.log(data[9313]);
    // cities.sort();
    // console.log(cities);
    // console.log(cities[0]);
    // console.log(cities.length);
    // console.log(cities[cities.length - 1]);

    // var col2 = $("#col2");
    // col2.html("");
    // var dataList = $("<datalist>");
    // dataList.attr("id", "cities");
    // cities.forEach(element => {
    //     var opt = $("<option>");
    //     opt.attr("value", element);
    //     opt.appendTo(dataList);
    // });
    // col2.append(dataList);
    // var txt = $("<input>");
    // txt.attr("type", "text");
    // txt.attr("list", "cities");
    // col2.append(txt);

    var btnDiv = $("#recentSearches");
    //this function clears the Search buttons area and re load it per updated weatherSearches
    function renderButtons() {
        btnDiv.html("");
        weatherSearches.sort();
        weatherSearches.forEach(element => {
            var btn = $("<button>");
            btn.addClass("btn btn-info mx-3 btn-block");
            btn.html(element);
            btnDiv.append(btn);
            btn.click(function (event) {
                var city = $(this).html();
                console.log("Button Click: " + city);
                getWeather(city);
            });
        });
    }
    renderButtons();

    //this function retrieves UV data for the current response/location
    function getUV(response) {
        //http://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}
        queryURL = apiCall + "uvi?APPID=" + apiKey + "&lat=" + response.coord.lat + "&lon=" + response.coord.lon;
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function (response) {
            console.log(response);
            currentWeatherUVEl.html("UV : " + response.value);
        }).fail(function (response) {
            currentWeatherUVEl.html("UV : Failed to retrieve UV");
        });

    }

    //Clears the current weather section
    function clearWeatherData() {
        currentWeatherHeaderEl.html("City/Date : Loading...");
        currentWeatherTempEl.html("Temperature : ");
        currentWeatherHumEl.html("Humidity : ");
        currentWeatherWindEl.html("Humidity : ");
        currentWeatherUVEl.html("UV : ");
    }

    //Creates the url for the icon that is returned in the response
    function getImagePath(response) {
        return "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
    }

    function renderCard(response, headerEl, TempEl, HumEl, WindEl, headerHtml) {
        headerEl.html(headerHtml);
        var imgPath = getImagePath(response);
        headerEl.append('<img id="currentImg" src="' + imgPath + '" height="42" width="42" />')
        TempEl.html("Temperature : " + response.main.temp + " F");
        HumEl.html("Humidity : " + response.main.humidity + " %");
        WindEl.html("Humidity : " + response.wind.speed + " mph");
    }

    function showWeatherData(response) {
        renderCard(response, currentWeatherHeaderEl, currentWeatherTempEl, currentWeatherHumEl, currentWeatherWindEl, response.name + " (" + moment().format("dddd, MMMM Do YYYY, h:mm a") + ")");
        getUV(response);
    }
    // weather?lat=35&lon=139&appid
    function getWeatherByCoords(lon, lat) {
        clearWeatherData();
        // &units=imperial
        queryURL = apiCall + "weather?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&APPID=" + apiKey;
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function (response) {
            console.log(response);
            showWeatherData(response);
            getForecast(response.id);

        }).fail(function (response) {
            console.log(response.responseJSON.message);
            $("#searchMsg").html(response.responseJSON.message);
        });
    }

    function getWeather(txt) {
        if (txt !== "") {
            clearWeatherData();
            // &units=imperial
            queryURL = apiCall + "weather?q=" + txt + "&units=imperial" + "&APPID=" + apiKey;
            console.log(queryURL);
            $.ajax({
                url: queryURL,
                method: "GET"
            }).done(function (response) {
                console.log(response);
                showWeatherData(response);
                lastSearch = txt;
                localStorage.setItem("lastWeatherSearch", JSON.stringify(lastSearch));
                if (!weatherSearches.includes(txt)) {
                    weatherSearches.push(txt);
                    localStorage.setItem("weatherSearches", JSON.stringify(weatherSearches));
                    renderButtons();
                }
                getForecast(response.id);

            }).fail(function (response) {
                console.log(response.responseJSON.message);
                $("#searchMsg").html(response.responseJSON.message);
            });
        }
    }

    function getForeCastForData(date, response) {
        var forecastList = [];
        response.list.forEach(function (element) {
            // Create a new JavaScript Date object based on the timestamp
            // multiplied by 1000 so that the argument is in milliseconds, not seconds.
            var dt = new Date(element.dt * 1000);
            if (date == moment(dt).format("DD-MM-YYYY")) {
                forecastList.push(element);
            }
        });
        var forecastMid = forecastList[Math.floor(forecastList.length / 2)];
        return forecastMid;
    }


    function showWeatherForecast(response) {
        forecastWeatherDivEl.html("");
        var forecastDate = [];
        var today = moment();
        for (var i = 0; i < 5; i++) {
            // console.log(i);
            var dt = today.add(1, 'd');
            var dtString = today.format("DD-MM-YYYY");
            console.log(dtString);
            var forecastData = getForeCastForData(dtString, response);
            console.log(forecastData);
            var col = $("<div>");
            col.addClass("col");
            col.appendTo(forecastWeatherDivEl);
            // col.html("test");
            var card = $("<div>");
            card.addClass("card text-white bg-primary my-3")
            card.appendTo(col);
            // card.html("test");
            var headerEl = $("<div>");
            headerEl.addClass("card-header");
            headerEl.html(dtString);
            headerEl.appendTo(card);

            var cardBody = $("<div>");
            cardBody.addClass("card-body");
            cardBody.appendTo(card);
            var tempEl = $("<p>");
            tempEl.html("Temp:");
            tempEl.addClass("card-text");
            tempEl.appendTo(cardBody);
            var humEl = $("<p>");

            humEl.html("Humidity:");
            humEl.addClass("card-text");
            humEl.appendTo(cardBody);
            var windEl = $("<p>");
            windEl.html("Wind Speed:");
            windEl.addClass("card-text");
            windEl.appendTo(cardBody);
            console.log(forecastData);
            renderCard(forecastData, headerEl, tempEl, humEl, windEl, dtString);

        }
    }

    // api.openweathermap.org/data/2.5/forecast?id={city ID}
    function getForecast(cityID) {
        // clearForecastData();
        // &units=imperial
        queryURL = apiCall + "forecast?id=" + cityID + "&units=imperial" + "&APPID=" + apiKey;
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function (response) {
            console.log("Forecast");

            console.log(response);

            showWeatherForecast(response);

        }).fail(function (response) {
            console.log(response.responseJSON.message);
            // $("#searchMsg").html(response.responseJSON.message);
        });
    }

    $("#searchBtn").click(function (event) {
        event.preventDefault();
        var txt = $("#searchText").val();
        txt = txt.trim();
        getWeather(txt);

    });
});
