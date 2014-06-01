$(function getSummonerInfo() {
    var pathname = $(location).attr('href');
    var partsArray = pathname.split('=');
    var lastChampionPlayed;   //id för senast spelade champion
    name = partsArray[1];
    if(name == "undefined")
        name = "barkelius";
    name = name.replace("+"," ");
    name = name.replace("+"," ");
    $.ajax({
       url:'https://prod.api.pvp.net/api/lol/euw/v1.4/summoner/by-name/' + name + '?api_key=818fcfce-3cb5-49eb-a38d-8ee45d6e3e76',
        //'http://prod.api.pvp.net/api/lol/' + window.summonerServer + '/v1.4/summoner/by-name/' + name + '?api_key=818fcfce-3cb5-49eb-a38d-8ee45d6e3e76',
       dataType: 'json',
       success: function(data) {
       //document.getElementById('test').innerHTML = "https://prod.api.pvp.net/api/lol/euw/v1.4/summoner/by-name/" + name + "?api_key=818fcfce-3cb5-49eb-a38d-8ee45d6e3e76";
	   var id = data[name].id;

       document.getElementById('summonerIdToShowMe').innerHTML = id;
        //----------ranked stats(lite)---------------------------------------
           $.ajax({
               url: 'https://prod.api.pvp.net/api/lol/' + window.summonerServer + '/v1.3/stats/by-summoner/' + id + '/ranked?season=SEASON4&api_key=818fcfce-3cb5-49eb-a38d-8ee45d6e3e76',
               dataType: 'json',
               success: function(data) {

                   for(var i = 0; i < data.champions.length; ++i){
                       if(data.champions[i].id == 0){
                        /*   var averageKda = (data.champions[i].stats.totalChampionKills/data.champions[i].stats.totalSessionsPlayed).toFixed(1) + "/" +
                                            (data.champions[i].stats.totalDeathsPerSession/data.champions[i].stats.totalSessionsPlayed).toFixed(1) + "/" +
                                            (data.champions[i].stats.totalAssists/data.champions[i].stats.totalSessionsPlayed).toFixed(1);*/
                           document.getElementById('playerTopSummaryWins').innerHTML =data.champions[i].stats.totalSessionsWon;
                           document.getElementById('playerTopSummaryLosses').innerHTML =data.champions[i].stats.totalSessionsLost;
                       }
                   }
               },
               statusCode: {
                   404: function() {
                       alert('404, ranked wins + ranked losses failed to load');
                   }
               }
           });
        //-----------Match History for given player--------------------------
           $.ajax({
               url: 'https://prod.api.pvp.net/api/lol/' + window.summonerServer + '/v1.3/game/by-summoner/' + id + '/recent?api_key=818fcfce-3cb5-49eb-a38d-8ee45d6e3e76',
               dataType: 'json',
               success: function(data) {
                   var gameMode = "";
                   var timePlayed;
                   lastChampionPlayed = data.games[0].championId;
                   for(var i = 0; i < data.games.length; ++i){
                       var matchHistoryOutput = document.getElementById('matchHistory' + i);
                       timePlayed = (data.games[i].stats.timePlayed/60).toFixed(0);

                       gameMode = matchHistoryGameMode(data.games[i].subType);

                       var gamescore = matchHistoryGamescore(data.games[i].stats.championsKilled, data.games[i].stats.numDeaths, data.games[i].stats.assists);
                       var neutralMinionsKilled = data.games[i].stats.neutralMinionsKilled;
                       if(data.games[i].stats.neutralMinionsKilled == undefined)
                            neutralMinionsKilled = 0;
                       var minionsKilled = data.games[i].stats.minionsKilled;
                       if(data.games[i].stats.minionsKilled == undefined)
                           minionsKilled = 0;
                       var totalCreapScore = (minionsKilled + neutralMinionsKilled) + " cs";

                       matchHistoryOutput.innerHTML = "<div class='matchHistoryImage'><img class='matchHistoryChampionImage' src='championImages/" + data.games[i].championId + ".png'></div>" +
                                                      "<div class='matchHistoryGameMode'>" + gameMode + "</div>" +
                                                      "<div class='matchHistoryTimePlayed'>~" + timePlayed + " min</div>" +
                                                      "<div class='matchHistoryKDA'>" + gamescore + "</div>" +
                                                      "<div class='matchHistoryCreapScore'>" + totalCreapScore + "</div>" +
                                                      "<div class='matchHistoryItemStyle'><img class='matchHistoryItem' id='matchHistoryImage0" + i + "' src='itemImages/" + data.games[i].stats.item0 + ".png'></div>" +
                                                      "<div class='matchHistoryItemStyle'><img class='matchHistoryItem' id='matchHistoryImage1" + i + "' src='itemImages/" + data.games[i].stats.item1 + ".png'></div>" +
                                                      "<div class='matchHistoryItemStyle'><img class='matchHistoryItem' id='matchHistoryImage2" + i + "' src='itemImages/" + data.games[i].stats.item2 + ".png'></div>" +
                                                      "<div class='matchHistoryItemStyle'><img class='matchHistoryItem' id='matchHistoryImage3" + i + "' src='itemImages/" + data.games[i].stats.item3 + ".png'></div>" +
                                                      "<div class='matchHistoryItemStyle'><img class='matchHistoryItem' id='matchHistoryImage4" + i + "' src='itemImages/" + data.games[i].stats.item4 + ".png'></div>" +
                                                      "<div class='matchHistoryItemStyle'><img class='matchHistoryItem' id='matchHistoryImage5" + i + "' src='itemImages/" + data.games[i].stats.item5 + ".png'></div>" +
                                                      "<div class='matchHistoryItemStyle'><img class='matchHistoryItem' id='matchHistoryImage6" + i + "' src='itemImages/" + data.games[i].stats.item6 + ".png'></div>" +
                                                      "<div class='matchHistorySummonersStyle'><img class='matchHistorySummoners' src='summonerSpells/" + data.games[i].spell1 + ".png'></div>" +
                                                      "<div class='matchHistorySummonersStyle'><img class='matchHistorySummoners' src='summonerSpells/" + data.games[i].spell2 + ".png'></div>";
                                                      //"<div class='matchHistoryItemStyle'><img class='matchHistoryMoreStatsButton' src='menuImages/moreArrow.jpg'></div>";

                       if(data.games[i].stats.win != true){
                           matchHistoryOutput.style.backgroundColor = "#FF5555"; //crimson
                           //document.getElementById('matchHistoryExtended' + i).style.backgroundColor = "#FF5555"
                       }

                       if(data.games[i].stats.item0 == undefined){
                           document.getElementById('matchHistoryImage0' + i).style.visibility = "hidden";
                       }
                       if(data.games[i].stats.item1 == undefined){
                           document.getElementById('matchHistoryImage1' + i).style.visibility = "hidden";
                       }
                       if(data.games[i].stats.item2 == undefined){
                           document.getElementById('matchHistoryImage2' + i).style.visibility = "hidden";
                       }
                       if(data.games[i].stats.item3 == undefined){
                           document.getElementById('matchHistoryImage3' + i).style.visibility = "hidden";
                       }
                       if(data.games[i].stats.item4 == undefined){
                           document.getElementById('matchHistoryImage4' + i).style.visibility = "hidden";
                       }
                       if(data.games[i].stats.item5 == undefined){
                           document.getElementById('matchHistoryImage5' + i).style.visibility = "hidden";
                       }
                       if(data.games[i].stats.item6 == undefined){
                           document.getElementById('matchHistoryImage6' + i).style.visibility = "hidden";
                       }
                       document.getElementById('matchHistoryExtended' + i).innerHTML = extendedMatchHistory(data.games[i].stats, data.games[i].fellowPlayers, data.games[i].teamId, data.games[i].championId);
                   }
               },
               statusCode: {
                   404: function() {
                       alert('404, match history failed to load.');
                   }
               }
           });

           $.ajax({
               url: 'https://prod.api.pvp.net/api/lol/' + window.summonerServer + '/v2.3/league/by-summoner/' + id + '/entry?api_key=818fcfce-3cb5-49eb-a38d-8ee45d6e3e76',
               dataType: 'json',
               success: function(data) {
                   for(var i = 0; i < data.length; ++i){
                       if(data[i].queueType == "RANKED_SOLO_5x5"){
                           document.getElementById('playerTopSummaryLeaguePoints').innerHTML = data[i].leaguePoints + " League Points";
                           document.getElementById('playerTopSummaryRankingImage').innerHTML = "<img class='playerTopSummaryRankingImage' src='ratingImages/" + data[i].tier + data[i].rank + ".png'>";
                           document.getElementById('playerTopSummaryRankingText').innerHTML = data[i].tier.charAt(0).toUpperCase() + data[i].tier.slice(1).toLowerCase() + " " + data[i].rank;
                       }

                   }
               },
               statusCode: {
                   404: function() {
                       alert('404, Left top element request failed, contains summoner ranking and stats.');
                   }
               }
           });

           $.ajax({
               url: 'https://prod.api.pvp.net/api/lol/' + window.summonerServer + '/v1.3/stats/by-summoner/' + id + '/ranked?season=SEASON4&api_key=818fcfce-3cb5-49eb-a38d-8ee45d6e3e76',
               dataType: 'json',
               success: function(data) {
                   var x;  //mostPlayedChampionArrayPossition
                   var tmpMostPlayedChampion = 0;
                   for(var i = 0; i < data.champions.length; ++i){
                        if(data.champions[i].stats.totalSessionsPlayed > tmpMostPlayedChampion && data.champions[i].id != 0){
                            x = i;
                            tmpMostPlayedChampion = data.champions[i].stats.totalSessionsPlayed;
                        }
                   }
                   var kda = (data.champions[x].stats.totalChampionKills/data.champions[x].stats.totalSessionsPlayed).toFixed(1) + "/" +
                       (data.champions[x].stats.totalDeathsPerSession/data.champions[x].stats.totalSessionsPlayed).toFixed(1) + "/" +
                       (data.champions[x].stats.totalAssists/data.champions[x].stats.totalSessionsPlayed).toFixed(1);
                    var championName;
                   for(var i = 0; i < keys.length; ++i){
                       if(keys[i][0] == data.champions[x].id){
                           championName = keys[i][1];
                           break;
                       }
                   }
                   document.getElementById('playerTopRightChampionName').innerHTML = championName;
                   document.getElementById('playerTopRightChampionImage').innerHTML = "<img class='playerTopRightImage' src='championImages/" + data.champions[x].id + ".png'>";
                   document.getElementById('playerTopRightKDA').innerHTML = kda;
                   document.getElementById('playerTopRightChampionLosses').innerHTML = data.champions[x].stats.totalSessionsLost;
                   document.getElementById('playerTopRightChampionWins').innerHTML = data.champions[x].stats.totalSessionsWon + "  ";
               },
               statusCode: {
                   404: function() {
                       alert('404, Right top element request failed, contains summoners most played champion');
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

function initServer(){
    window.summonerServer = "euw";
}

function setServer(server){
    window.summonerServer = server;
    alert(window.summonerServer);

}

function extendedMatchHistory(stats, fellowPlayers, myTeamId, myChampionId){
    var teamBlue = "<span>Allied Team<br></span>";
    var teamPurple = "<span>Enemy Team<br></span>";
    if(myTeamId == 200){
        teamBlue = "<span>Enemy Team<br></span>";
        teamPurple = "<span>Allied Team<br></span>";
    }

    for(var i = 0; i < fellowPlayers.length; ++i){
        if(fellowPlayers[i].teamId == 100)
            teamBlue += "<a href='champion.html?championId=" + fellowPlayers[i].championId + "'><img class='matchHistoryExtendedChampion'  src='championImages/" + fellowPlayers[i].championId + ".png'></a>";
            //teamBlue += fellowPlayers[i].championId + ", ";
        else if(fellowPlayers[i].teamId == 200)
            teamPurple += "<a href='champion.html?championId=" + fellowPlayers[i].championId + "'><img class='matchHistoryExtendedChampion'  src='championImages/" + fellowPlayers[i].championId + ".png'></a>";
            //teamPurple += fellowPlayers[i].championId + ", ";
    }
    if(myTeamId == 100)
        teamBlue += "<a href='champion.html?championId=" + myChampionId + "' ><img class='matchHistoryExtendedChampion'  src='championImages/" + myChampionId + ".png'></a>";
    else if(myTeamId == 200)
        teamPurple += "<a href='champion.html?championId=" + myChampionId + "' ><img class='matchHistoryExtendedChampion'  src='championImages/" + myChampionId + ".png'></a>";
    var goldEarned = isUndefined(stats.goldEarned);
    var damageDealt = isUndefined(stats.totalDamageDealtToChampions);
    var damageTaken = isUndefined(stats.totalDamageTaken);
    var minionKills = isUndefined(stats.minionsKilled);
    var monsterKills = isUndefined(stats.neutralMinionsKilled);
    var monsterKillsFriendly = isUndefined(stats.neutralMinionsKilledYourJungle);
    var monsterKillsEnemy = isUndefined(stats.neutralMinionsKilledEnemyJungle);
    var towerKills = isUndefined(stats.turretsKilled);
    var inhibKills = isUndefined(stats.barracksKilled);

    return "<div class='matchHistoryExtendedfellowPlayers'><div class='fellowPlayersFriendly'>" + teamBlue + "</div> VS <div class='fellowPlayersEnemy'>" + teamPurple + "</div></div>" +
            "<table class='table table-condensed' style='width: 500px;margin-bottom: 0;'><thead><th> Stats" +
            "</th></thead><tbody>" +
            "<tr><td>Gold Earned: " + goldEarned +
            "</td></tr><tr><td>Dmg Dealt to Champions: " + damageDealt +
            "</td></tr><tr><td>Dmg Taken: " + damageTaken +
            "</td></tr><tr><td>Minions + Monsters Killed: " + minionKills + " + " + monsterKills + " (<span style='color: mediumseagreen'>" + monsterKillsFriendly + "</span> + <span style='color: #FF5555'>" + monsterKillsEnemy + "</span>)" +
            "</td></tr><tr><td>Wards Placed: " + stats.wardPlaced +
            "</td></tr><tr><td>Towers + Inhibs killed: " + towerKills + " + " + inhibKills +
            "</td></tr></tbody></table>";
}

function isUndefined(number){
    if(number == undefined)
        return 0;
    return number;
}

//https://prod.api.pvp.net/api/lol/' + window.summonerServer + '/v2.3/league/by-summoner/23672758/entry?api_key=818fcfce-3cb5-49eb-a38d-8ee45d6e3e76

function matchHistoryGameMode(matchMode){
    var rv;
    switch(matchMode)
    {
        case "NONE":
            rv = "Custom";
            break;
        case "NORMAL":
            rv = "Normal 5v5";
            break;
        case "RANKED_SOLO_5x5":
            rv = "Ranked Solo 5v5";
            break;
        case "ODIN_UNRANKED":
            rv = "Dominion";
            break;
        case "ARAM_UNRANKED_5x5":
            rv = "ARAM";
            break;
        case "RANKED_TEAM_5x5":
            rv = "Ranked Team 5v5";
            break;
        case "SR_6x6":
            rv = "Hexakill";
            break;
        case "BOT_3x3":
            rv = "Bots 3v3";
            break;
        case "RANKED_TEAM_3x3":
            rv = "Ranked Team 3v3";
            break;
        case "ONEFORALL_5x5":
            rv = "One For All";
            break;
        case "FIRSTBLOOD_1x1":
            rv = "Showdown 1v1";
            break;
        case "FIRSTBLOOD_2x2":
            rv = "Showdown 2v2";
            break;
        case "BOT":
            rv = "Bots 5v5";
            break;
        case "NORMAL_3x3":
            rv = "Normal 3v3";
            break;
        case "CAP_5x5":
            rv = "Normal 5v5"
            break;3
        case "URF":
            rv = "URF"
            break;
        default:
            rv = "Error: Undefined gametype";
    }

    return rv;
}


function matchHistoryGamescore(kills, deaths, assists){
    if(deaths == undefined)
        deaths = 0;
    if(kills == undefined)
        kills = 0;
    if(assists == undefined)
        assists = 0;
    return (kills + "/" + deaths + "/" + assists);
}

/*
var pieChartDataSource = [
                {champion: 'Lee Sin', value: 3},
                {champion: 'Elise', value: 4},
                {champion: 'Wukong', value: 2},
                {champion: 'Lucian', value: 1}
];

pieChartDataSource.push({champion: "Swagmo", value: 5});
pieChartDataSource.push({champion: "Chill stuffs", value: 2});


$(function () {
    $("#pieChartContainer").dxPieChart({
        dataSource: pieChartDataSource,
        series: {
            type: "doughnut",
            argumentField: 'champion',
            valueField: 'value'
        },
tooltip: {
    enabled: true,
    customizeText: function () {
    return this.argumentText + ": " + this.valueText;
    },
font: {
    font: "Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif",
    size: 15,
    weight: 400
    }
},
title: {
    text: "10 Last Champions Played"
    },
legend: {
    horizontalAlignment: 'center',
    verticalAlignment: 'bottom'
    }
});
});
    */

var keys=[
    [35, "Shaco"],
    [36, "DrMundo"],
    [33, "Rammus"],
    [34, "Anivia"],
    [39, "Irelia"],
    [157, "Yasuo"],
    [37, "Sona"],
    [38, "Kassadin"],
    [154, "Zac"],
    [43, "Karma"],
    [42, "Corki"],
    [41, "Gangplank"],
    [40, "Janna"],
    [22, "Ashe"],
    [23, "Tryndamere"],
    [24, "Jax"],
    [25, "Morgana"],
    [26, "Zilean"],
    [27, "Singed"],
    [28, "Evelynn"],
    [29, "Twitch"],
    [161, "Velkoz"],
    [3, "Galio"],
    [2, "Olaf"],
    [1, "Annie"],
    [7, "Leblanc"],
    [30, "Karthus"],
    [6, "Urgot"],
    [32, "Amumu"],
    [5, "XinZhao"],
    [4, "TwistedFate"],
    [31, "Chogath"],
    [9, "FiddleSticks"],
    [8, "Vladimir"],
    [19, "Warwick"],
    [17, "Teemo"],
    [18, "Tristana"],
    [15, "Sivir"],
    [16, "Soraka"],
    [13, "Ryze"],
    [14, "Sion"],
    [11, "MasterYi"],
    [12, "Alistar"],
    [21, "MissFortune"],
    [20, "Nunu"],
    [107, "Rengar"],
    [106, "Volibear"],
    [105, "Fizz"],
    [104, "Graves"],
    [103, "Ahri"],
    [99, "Lux"],
    [102, "Shyvana"],
    [101, "Xerath"],
    [412, "Thresh"],
    [98, "Shen"],
    [222, "Jinx"],
    [96, "KogMaw"],
    [92, "Riven"],
    [91, "Talon"],
    [90, "Malzahar"],
    [10, "Kayle"],
    [89, "Leona"],
    [79, "Gragas"],
    [117, "Lulu"],
    [114, "Fiora"],
    [78, "Poppy"],
    [115, "Ziggs"],
    [77, "Udyr"],
    [112, "Viktor"],
    [113, "Sejuani"],
    [110, "Varus"],
    [111, "Nautilus"],
    [119, "Draven"],
    [82, "Mordekaiser"],
    [83, "Yorick"],
    [80, "Pantheon"],
    [81, "Ezreal"],
    [86, "Garen"],
    [84, "Akali"],
    [85, "Kennen"],
    [67, "Vayne"],
    [126, "Jayce"],
    [69, "Cassiopeia"],
    [127, "Lissandra"],
    [68, "Rumble"],
    [121, "Khazix"],
    [122, "Darius"],
    [120, "Hecarim"],
    [72, "Skarner"],
    [236, "Lucian"],
    [74, "Heimerdinger"],
    [238, "Zed"],
    [75, "Nasus"],
    [76, "Nidalee"],
    [134, "Syndra"],
    [59, "JarvanIV"],
    [133, "Quinn"],
    [58, "Renekton"],
    [57, "Maokai"],
    [56, "Nocturne"],
    [55, "Katarina"],
    [64, "LeeSin"],
    [62, "MonkeyKing"],
    [63, "Brand"],
    [267, "Nami"],
    [60, "Elise"],
    [131, "Diana"],
    [61, "Orianna"],
    [266, "Aatrox"],
    [143, "Zyra"],
    [48, "Trundle"],
    [45, "Veigar"],
    [44, "Taric"],
    [51, "Caitlyn"],
    [53, "Blitzcrank"],
    [54, "Malphite"],
    [254, "Vi"],
    [50, "Swain"]
];