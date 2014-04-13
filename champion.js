$(function getChampionInfo() {
    var pathname = $(location).attr('href');
    var partsArray = pathname.split('=');
    var lastChampionPlayed;   //id för senast spelade champion
    var championId = partsArray[1];
    if(championId == undefined)
        championId = "60";
    championId = championId.replace("+","");
    championId = championId.replace("+","");
    championId = championId.replace("\'","");
    if(championId.match(/^([a-z]|[A-Z])+$/)){
        //alert(championId);
        for(var i = 0; i < keys.length; ++i){
            championId = championId.toLowerCase();
            if(keys[i][1] == (championId.charAt(0).toUpperCase() + championId.slice(1))){
                championId = keys[i][0];
                break;
            }
        }
    }

    //alert(championId);
    $.ajax({
        url: 'https://prod.api.pvp.net/api/lol/static-data/euw/v1/champion/' + championId + '?champData=all&api_key=818fcfce-3cb5-49eb-a38d-8ee45d6e3e76',
        dataType: 'json',
        success: function(data) {
            document.getElementById('championHeaderImage').innerHTML = "<img class='championHeaderImage' src='championHeaderImages/" + championId + "_header.png'> ";
            var tmp = data.passive.description;
            var spellDescriptions = "<span class='spellName'><b>" + data.passive.name + " [Passive]</b></span><br>" + data.passive.description + "<hr>";
            var spellKey = ["Q", "W", "E", "R"];
            for(var i = 0; i < data.spells.length; ++i){
                tmp = data.spells[i].description;
                spellDescriptions += "<span class='spellName'><b>" + data.spells[i].name + " [" + spellKey[i] + "]</b></span><br>" + tmp + "<hr>";
            }
            document.getElementById('ChampionHome').innerHTML = "<div class='championFaceImage'><img class='championFaceImage' src='championImages/" + championId + ".png'></div><div class='championTitleText'>" + data.name + " - " + data.title.charAt(0).toUpperCase() + data.title.slice(1) + "</div><hr>" + spellDescriptions;
            var championTips = "<b><span class='spellName'>Allied: </span></b><br>";
            for(var i = 0; i < data.allytips.length; ++i){
                championTips += data.allytips[i] + "<br>";
            }
            championTips += "<br><span class='spellName'><b> Enemy: </b></span><br>";
            for(var i = 0; i < data.enemytips.length; ++i){
                championTips += data.enemytips[i] + "<br>";
            }
            document.getElementById('ChampionTips').innerHTML = "<div class='championTipsText'>" + championTips + "</div>";
            document.getElementById('ChampionLore').innerHTML = "<div class='championLoreText'>" + data.lore + "</div>";
            var advancedSpellDescriptions = "<table class='table'>" +
                "<thead>" +
                    "<tr><th>Stat</th><th>Value</th><th>Stat</th><th>Value</th></tr>" +
                "</thead>" +
                "<tbody>" +
                    "<tr><td>Health (per level)</td><td>" + data.stats.hp + "(+" + data.stats.hpperlevel + ")</td><td>Health/5 (per level)</td><td>" + data.stats.hpregen + "(+" + data.stats.hpregenperlevel + ")</td></tr>" +
                    "<tr><td>" + data.partype + " (per level)</td><td>" + data.stats.mp + "(+" + data.stats.mpperlevel + ")</td><td>" + data.partype + "/5 (per level)<td>" + data.stats.mpregen + "(+" + data.stats.mpregenperlevel + ")</td></tr>" +
                    "<tr><td>Movementspeed</td><td>" + data.stats.movespeed + "</td><td>Attack Range</td><td>" + data.stats.attackrange + "</td></tr>" +
                    "<tr><td>Armor (per level)</td><td>" + data.stats.armor + "(+" + data.stats.armorperlevel + ")</td><td>Magic Resist (per level)</td><td>" + data.stats.spellblock + "(+" + data.stats.spellblockperlevel + ")</td></tr>" +
                    "<tr><td>Attack Dmg (per level)</td><td>" + data.stats.attackdamage + "(+" + data.stats.attackdamageperlevel + ")</td><td>Attack Speed (per level)</td><td>" + (1/(1.6*(1 + data.stats.attackspeedoffset))).toFixed(3) + "(+" + data.stats.attackspeedperlevel + "%)</td></tr>" +
                "</tbody>" +
            "</table><hr>";
            advancedSpellDescriptions += "<b><span class='spellName'>" + data.passive.name + "</span></b><br>" + data.passive.description + "<hr>";
            for(var i = 0; i < data.spells.length; ++i){
                tmp = data.spells[i].tooltip;
                if(data.spells[i].vars != undefined){
                    for(var j = 0; j < data.spells[i].vars.length; j++){
                        tmp = tmp.replace("{{ " + data.spells[i].vars[j].key + " }}", data.spells[i].vars[j].coeff  + getSpellDamageModifier(data.spells[i].vars[j].link));
                        tmp = tmp.replace("{{ " + data.spells[i].vars[j].key + " }}", data.spells[i].vars[j].coeff  + getSpellDamageModifier(data.spells[i].vars[j].link));
                    }
                }
                for(var j = 0; j < data.spells[i].effect.length; j++){
                    tmp = tmp.replace("{{ e" + (j + 1) + " }}", data.spells[i].effect[j].join("/"));
                    tmp = tmp.replace("{{ e" + (j + 1) + " }}", data.spells[i].effect[j].join("/"));
                }
                var spellInfo = getSpellInfo(data.spells[i].cost, data.spells[i].resource, data.spells[i].range, data.spells[i].cooldown,data.spells[i].effectBurn);

                advancedSpellDescriptions += "<span class='spellName'><b>" + data.spells[i].name + " [" + spellKey[i] + "]</b></span><span class='spellAdvancedCost'>" + spellInfo + "</b></span><br>" + tmp + "<hr>";
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

function getSpellDamageModifier(x){
    if(x == "spelldamage")
        return " AP";
    else if(x == "bonusattackdamage")
        return " Bonus AD";
    else if(x == "attackdamage")
        return " Total AD";
    return "No Damage Modifier";
}

function getSpellInfo(cost, costType, range, cd, effect){
    //var aoeRv = "Aoe: " + aoe.join("/");
    var rangeRv = "<b>Range: </b>";
    if(range[0] == range[2])
        rangeRv += range[0];
    else
        rangeRv += range;
    var cdRv = "<b> Cooldown: </b>";
    if(cd[0] == cd[2])
        cdRv += cd[0];
    else
        cdRv += cd.join("/");
    var costRv = "<b> Cost: </b>";
    if(cost[0] == cost[2]){
        var tmp = costType.replace("{{ cost }}", cost[0]);

        for(var i = 0; i < effect.length; ++i)
            tmp = tmp.replace("{{ e" + (i + 1) + " }}",effect[i])

        costRv += tmp;
    }
    else
        costRv += costType.replace("{{ cost }}", cost.join("/"));
    /*
    var cdRv = " Cooldown: " + cd;
    var costRv = " Cost: " + cost + " " + costType;
*/
    return rangeRv + cdRv + costRv;
}


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