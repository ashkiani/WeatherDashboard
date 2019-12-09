$(document).ready(function () {
    console.log("ready!");
    var apiKey = "8958a465fb84dd70a7e61cd199ace0f3";
    var queryURL; //= "https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC";
    const apiCall = "http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=";//{APIKEY}
    queryURL=apiCall + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
    });

});
// var queryURL = "https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC";

// $.ajax({
//     url: queryURL,
//     method: "GET"
// }).then(function (response) {
//     console.log(response);
// });
