$(document).ready(function () {
    console.log("ready!");
    const apiKey = "8958a465fb84dd70a7e61cd199ace0f3";
    // const apiCall = "http://api.openweathermap.org/data/2.5/forecast?id=";//524901&APPID=";//{APIKEY}
    const apiCall = "http://api.openweathermap.org/data/2.5/weather?q=";
    // https://openweathermap.org/current#name
    // api.openweathermap.org/data/2.5/weather?q={city name}
    // api.openweathermap.org/data/2.5/weather?q={city name},{country code}

    $("#searchBtn").click(function (event) {
        event.preventDefault();
        var txt = $("#searchText").val();

        txt = txt.trim();
        if (txt !== "") {
            queryURL = apiCall + txt + "&APPID=" + apiKey;
            console.log(queryURL);
            $.ajax({
                url: queryURL,
                method: "GET"
            }).done(function (response) {
                console.log(response);
            }).fail(function (response) {
                console.log(response.responseJSON.message);
            });
        }

    });
});
