$(document).ready( function() {
    $.getJSON("https://prod.api.pvp.net/api/lol/euw/v1.3/summoner/by-name/barkelius?api_key=818fcfce-3cb5-49eb-a38d-8ee45d6e3e76", function(data){
        alert("hej: "+data);
    });
});
