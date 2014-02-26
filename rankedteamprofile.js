
$(function getRankedTeamInfo() {
    $.ajax({
        url: 'http://prod.api.pvp.net/api/lol/euw/v1.2/summoner/by-name/Barkelius?api_key=818fcfce-3cb5-49eb-a38d-8ee45d6e3e76',
        dataType: 'json',
        success: function(data) {
            var id = data.id;
            //alert("id = '" + id + "'");
            document.getElementById('summonerIdToShowMe').innerHTML = id;
            $.ajax({
                url: 'https://prod.api.pvp.net/api/lol/euw/v2.2/team/by-summoner/' + id + '?api_key=818fcfce-3cb5-49eb-a38d-8ee45d6e3e76',
                dataType: 'json',
                success: function(data) {
                    alert(data[0].tag);

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