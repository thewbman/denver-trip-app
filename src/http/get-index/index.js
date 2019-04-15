// @architect/functions enables secure sessions, express-style middleware and more
let arc = require('@architect/functions')
let url = arc.http.helpers.url
let layout = require('@architect/shared/layout')

exports.handler = async function http(req) {
  console.log(req)
  let session  = await arc.http.session.read(req)

  session.count = (session.count || 0) + 1
  session.routes = (session.routes || [])
  session.myurl = (session.myurl || url('/'))
  
  // save the session state to DynamoDB
  let cookie = await arc.http.session.write(session)

  
  var jqueryLoad = '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>'


  var bodyTop = '<h1>Denver Trip App</h1>'
  //bodyText += JSON.stringify(session, null, 2)

  var bodyCenter = '<div id="allRoutes"></div><div id="allTrips"></div>'
  var bodyBottom = '<div id="cookieData">'+JSON.stringify(session, null, 2)+'</div>'


  var ajaxAllRoutesScript = `
<script type="text/javascript">
$.getJSON( "`+url('/routes')+`", function( data ) {
  var items = [];
  $.each( data, function( key, val ) {
    items.push( "<li class='allRoutesItem' id='" + val.route_id + "' onclick='getTrips(this.id)'  >" + val.route_id + " - " + val.route_long_name + "</li>" );
  });

  $("#allRoutes").innerHTML = "";
  $( "<ul/>", {
    "class": "allRoutesList",
    html: items.join( "" )
  }).appendTo( "#allRoutes" );
});
</script>
`


 var ajaxClickRouteScript = `
<script type="text/javascript">
//$('.allRoutesItem').click(function() {
function getTrips(str) {

//var str = $(this).text();
console.log(str)

$.getJSON( "`+url('/route/')+`"+str, function( data ) {
  var items = [];
  $.each( data, function( key, val ) {
    items.push( "<li class='allTripsItem' id='" + val.trip_id + "'>" + val.trip_id + " - " + val.route_id + "</li>" );
  });

  $("#allTrips").innerHTML = "";
  $( "<ul/>", {
    "class": "allTripsList",
    html: items.join( "" )
  }).appendTo( "#allTrips" );
});



//});
};
</script>
`

  var headText = '<title>Denver Trip App</title>'+jqueryLoad
  var bodyText = bodyTop + bodyCenter + bodyBottom + ajaxAllRoutesScript + ajaxClickRouteScript





  return {
    cookie,
    headers: {'content-type': 'text/html; charset=utf8'},
    body: layout(headText,bodyText)
  }
}


