@app
denvertrip

@http
get /
get /routes
get /route/:routeID



@static
staging denver-trip-app-bucket-staging
production denver-trip-app-bucket-production

@tables
route
  route_id *String

trip
  route_id *String
  trip_id **String


