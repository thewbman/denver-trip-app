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

  var bodyCenter = '<div id="container" style="display: flex; flex-direction: row;"><div id="allRoutes"></div><div id="allTrips"></div><div id="allStops"></div><div id="myStop"></div></div>'
  var bodyBottom = '<div id="cookieData">'+JSON.stringify(session, null, 2)+'</div>'


  var ajaxAllRoutesScript = `
<script type="text/javascript">
$.getJSON( "`+url('/routes')+`", function( data ) {
  var items = [];
  $.each( data, function( key, val ) {
    items.push( "<li class='allRoutesItem' id='" + val.route_id + "' onclick='getTrips(this.id)'  >" + val.route_id + " - " + val.route_long_name + "</li>" );
  });

  $("#allRoutes").empty();
  $( "<ul/>", {
    "class": "allRoutesList",
    html: items.join( "" )
  }).appendTo( "#allRoutes" );
});
</script>
`


 var ajaxClickRouteScript = `
<script type="text/javascript">

function getTrips(str) {

console.log(str)

$.getJSON( "`+url('/route/')+`"+str, function( data ) {
  var items = [];
  $.each( data, function( key, val ) {
    items.push( "<li class='allTripsItem' id='" + val.trip_id + "'  onclick='getStops(this.id)' >Trip " + val.trip_id + " to " + val.trip_headsign + "</li>" );
  });

  $("#allTrips").empty();
  $("#allStops").empty();
  $("#myStop").empty();
  
  $( "<ul/>", {
    "class": "allTripsList",
    html: items.join( "" )
  }).appendTo( "#allTrips" );
});


};
</script>
`

 var ajaxClickTripScript = `
<script type="text/javascript">

function getStops(str) {

console.log(str)

$.getJSON( "`+url('/trip/')+`"+str, function( data ) {
  var items = [];
  $.each( data, function( key, val ) {
    items.push( "<li class='allStopsItem' id='" + val.stop_id + "'  onclick='getSingleStop(this.id)' >SEQ" + val.stop_sequence + " to stop " + val.stop.stop_name + " at " + val.arrival_time + "</li>" );
  });

  $("#allStops").empty();
  $("#myStop").empty();
  
  $( "<ul/>", {
    "class": "allStopsList",
    html: items.join( "" )
  }).appendTo( "#allStops" );
});


};
</script>
`


var ajaxClickStopScript = `
<script type="text/javascript">

function getSingleStop(str) {

console.log(str)

$.getJSON( "`+url('/stop/')+`"+str, function( data ) {
  var items = [];
  $.each( data, function( key, val ) {
    items.push( "<li class='myStopItem' id='" + val.stop_id + "'  >" + val.stop_name +  "</li>" );
  });

  $("#myStop").empty();
  $( "<ul/>", {
    "class": "myStopList",
    html: items.join( "" )
  }).appendTo( "#myStop" );
});


};
</script>
`



  var headText = '<title>Denver Trip App</title>'+jqueryLoad
  var bodyText = bodyTop + bodyCenter + bodyBottom + ajaxAllRoutesScript + ajaxClickRouteScript + ajaxClickTripScript + ajaxClickStopScript;





  return {
    cookie,
    headers: {'content-type': 'text/html; charset=utf8'},
    body: layout(headText,bodyText)
  }
}


