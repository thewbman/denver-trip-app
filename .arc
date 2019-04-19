@app
denvertrip

@http
get /
get /routes
get /route/:routeID
get /trip/:tripID
get /stop/:stopID
get /nexttrip/:stopID


@static
staging denver-trip-app-bucket-staging
production denver-trip-app-bucket-production

@tables
route
  route_id *String

trip
  route_id *String
  trip_id **String

stop
  stop_id *String

stoptime
  trip_id *String
  stop_id **String
