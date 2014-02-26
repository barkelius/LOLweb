$(function() {
  
  $('#clickme').click(function() {
   
    /*
    $.getJSON('http://prod.api.pvp.net/api/lol/euw/v1.1/champion?freeToPlay=true&api_key=818fcfce-3cb5-49eb-a38d-8ee45d6e3e76', function(data) {

        var items = [];

        $.each(data, function(key, val) {

          items.push('<li id="' + key + '">' + val + '</li>');    

        });

        $('<ul/>', {
          'class': 'interest-list',
          html: items.join('')
        }).appendTo('body');

     });
     */
    
    $.ajax({
       url: 'http://prod.api.pvp.net/api/lol/euw/v1.1/champion?freeToPlay=true&api_key=818fcfce-3cb5-49eb-a38d-8ee45d6e3e76',
       dataType: 'json',
       success: function(data) {
          var items = [];

          $.each(data, function(key, val) {
	    val.forEach(function(entry) {
    		items.push(entry.name);
	    });
	    
            //items.push(val[i++].name);    
	    //JSON.stringify(val)
          });

        $('<ul/>', {
          'class': 'interest-list',
          html: items.join('<br/>')
        }).appendTo('body');

       },
      statusCode: {
         404: function() {
           alert('There was a problem with the server. Try again soon!');
         }
       }
    });
  });

});