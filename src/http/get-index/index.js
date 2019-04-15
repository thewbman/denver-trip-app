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

  var bodyCenter = '<ul class="my-new-list"  />'

  var ajaxScript = `
<script type="text/javascript">
$.getJSON( "`+url('/routes')+`", function( data ) {
  var items = [];
  $.each( data.Items, function( key, val ) {
    items.push( "<li id='" + key + "'>" + val.route_id + "</li>" );
  });
 
  $( "<ul/>", {
    "class": "my-new-list",
    html: items.join( "" )
  }).appendTo( "body" );
});
</script>
`



  var bodyText = bodyTop+bodyCenter+ajaxScript





  return {
    cookie,
    headers: {'content-type': 'text/html; charset=utf8'},
    body: layout('<title>Denver Trip App</title>'+jqueryLoad,bodyText)
  }
}


