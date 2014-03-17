$(function getChampionInfo() {
    var pathname = $(location).attr('href');
    var partsArray = pathname.split('#');
    var lastChampionPlayed;   //id för senast spelade champion
    var championId = partsArray[1];
    if(championId == undefined)
        championId = "60";
    //alert(championId);
    $.ajax({
        url: 'https://prod.api.pvp.net/api/lol/static-data/euw/v1/champion/' + championId + '?champData=all&api_key=818fcfce-3cb5-49eb-a38d-8ee45d6e3e76',
        dataType: 'json',
        success: function(data) {
            document.getElementById('championHeaderImage').innerHTML = "<img class='championHeaderImage' src='championHeaderImages/" + championId + "_header.png'> ";
            var tmp = data.passive.description.replace("<br>","");
            var spellDescriptions = "<span style='font-size: 15px; font-style: italic'>" + data.passive.name + " [Passive]</span><br>" + data.passive.description.replace("<br>","") + "<hr>";
            var spellKey = ["Q", "W", "E", "R"];
            for(var i = 0; i < data.spells.length; ++i){
                tmp = data.spells[i].description.replace("<br>","");
                spellDescriptions += "<span style='font-size: 15px; font-style: italic'>" + data.spells[i].name + " [" + spellKey[i] + "]</span><br>" + tmp + "<hr>";
            }
            document.getElementById('ChampionHome').innerHTML = "<div class='championFaceImage'><img class='championFaceImage' src='championImages/" + championId + ".png'></div><div class='championTitleText'>" + data.name + " - " + data.title + "</div><hr>" + spellDescriptions;

            var championTips = "Allied: <br>";
            for(var i = 0; i < data.allytips.length; ++i){
                championTips += data.allytips[i] + "<br>";
            }
            championTips += "<br>Enemy: <br>";
            for(var i = 0; i < data.enemytips.length; ++i){
                championTips += data.enemytips[i] + "<br>";
            }
            document.getElementById('ChampionTips').innerHTML = "<div class='championTipsText'>" + championTips + "</div>";
            document.getElementById('ChampionLore').innerHTML = "<div class='championLoreText'>" + data.lore + "</div>";
            var advancedSpellDescriptions = "";
            for(var i = 0; i < data.spells.length; ++i){
                advancedSpellDescriptions += "<span style='font-size: 15px; font-style: italic'>" + data.spells[i].name + " [" + spellKey[i] + "]</span><br>" + data.spells[i].tooltip.replace("<br>","") + "<hr>";
            }
            document.getElementById('ChampionDetailed').innerHTML = "<div class='ChampionDetailedText'>" + advancedSpellDescriptions + "</div>";
        },
        statusCode: {
            404: function() {
                alert('404 error, Could not connect to server, championId: ' + championId);
            },
            503: function() {
                alert('503 error, ');
            }
        }
    });
});