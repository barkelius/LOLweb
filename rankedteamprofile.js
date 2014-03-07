
$(function getRankedTeamInfo() {
    $.ajax({
        url: 'http://prod.api.pvp.net/api/lol/euw/v1.2/summoner/by-name/Barkelius?api_key=818fcfce-3cb5-49eb-a38d-8ee45d6e3e76',
        dataType: 'json',
        success: function(data) {
            var id = data.id;
            document.getElementById('summonerIdToShowMe').innerHTML = id;
            $.ajax({
                url: 'https://prod.api.pvp.net/api/lol/euw/v2.2/team/by-summoner/' + id + '?api_key=818fcfce-3cb5-49eb-a38d-8ee45d6e3e76',
                dataType: 'json',
                success: function(data) {
                    for(var i = 0; i < data.length; ++i){
                        var splitLeftinfo = "swag";
                        var splitRightinfo = "swag2";
                        document.getElementById('rankedTeam' + i).innerHTML = "<div class='rankedTeamName'>[" + data[i].tag + "] " + data[i].name + "</div>" +
                                                                              "<div class='rankedTeamWins'>" + data[i].teamStatSummary.teamStatDetails[0].wins + "</div> " +
                                                                              "<div class='rankedTeamLosses'>" + data[i].teamStatSummary.teamStatDetails[0].losses + "</div> ";
                        document.getElementById('rankedTeamExtended' + i).innerHTML = "<div class='splitContent'><div class='splitLeft'>" + splitLeftinfo + "</div><div class='splitRight'>" + splitRightinfo + "</div></div>";
                    }

                },
                statusCode: {
                    404: function() {
                        alert('404 error, ');
                    },
                    503: function() {
                        alert('503 error, ');
                    }
                }
            });
        },
        statusCode: {
            404: function() {
                alert('404 error, ');
            },
            503: function() {
                alert('503 error, ');
            }
        }
    });
});