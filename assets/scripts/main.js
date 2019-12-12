$(document).ready(function () {
    console.log("ready!");
    const apiKey = "8958a465fb84dd70a7e61cd199ace0f3";
    const apiCall = "http://api.openweathermap.org/data/2.5/weather?q=";



    var weatherSearches = [];
    function loadWeatherSearches() {

        var value = localStorage.getItem("weatherSearches");
        if (value !== null) {
            console.log(value);
            var localWS = JSON.parse(value);
            if (localWS !== null) {
                weatherSearches = localWS;
            }
        }
    }
    loadWeatherSearches();
    console.log(weatherSearches);


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
    function renderButtons() {
        btnDiv.html("");
        weatherSearches.sort();
        weatherSearches.forEach(element => {
            var btn = $("<button>");
            btn.addClass("btn btn-info btn-block");
            btn.html(element);
            btnDiv.append(btn);
            btn.click(function (event) {
                // alert($(this).html());
                var city = $(this).html();
                getWeather(city);
            });
        });
    }
    renderButtons();
    var weatherEl = $("#col2");

    function showWeatherData(response) {
        weatherEl.html(JSON.stringify(response));
    }

    function getWeather(txt) {
        if (txt !== "") {
            queryURL = apiCall + txt + "&APPID=" + apiKey;
            console.log(queryURL);
            $.ajax({
                url: queryURL,
                method: "GET"
            }).done(function (response) {
                console.log(response);
                showWeatherData(response);
                if (!weatherSearches.includes(txt)) {
                    weatherSearches.push(txt);
                    localStorage.setItem("weatherSearches", JSON.stringify(weatherSearches));
                    renderButtons();
                }

            }).fail(function (response) {
                console.log(response.responseJSON.message);
                $("#searchMsg").html(response.responseJSON.message);
            });
        }
    }

    $("#searchBtn").click(function (event) {
        event.preventDefault();
        var txt = $("#searchText").val();

        txt = txt.trim();

        getWeather(txt);


    });
});
